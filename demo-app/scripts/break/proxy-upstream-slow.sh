#!/bin/sh
# Breakage (M5.4): point the proxy at an upstream that accepts the connection
# but never responds — simulating an app that's alive but stuck (deadlocked,
# starved for a resource, infinite loop). This is the 504 case, distinct
# from the 502 case in proxy-upstream-down.sh: the difference between
# "nobody home" and "somebody home but not answering."
#   sh scripts/break/proxy-upstream-slow.sh
# Observe:  time curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/
#           (takes ~5s, matching proxy_read_timeout, then returns 504)
# Restore:  sh scripts/break/proxy-restore.sh
set -e
cd "$(dirname "$0")/../.."
docker run -d --name slow-upstream-demo --network demo-app_default \
  python:3-alpine sh -c "python3 -c \"
import socket,time
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
s.bind(('0.0.0.0',9998)); s.listen(5)
while True:
    conn,_=s.accept(); time.sleep(30); conn.close()
\"" >/dev/null
cat > nginx/nginx.conf <<'EOF'
events {}
http {
  server {
    listen 80;
    location / {
      proxy_pass http://slow-upstream-demo:9998;
      proxy_connect_timeout 2s;
      proxy_read_timeout 5s;
    }
  }
}
EOF
docker compose restart proxy
echo "[break] proxy now points at an upstream that accepts but never responds."
echo "Try: time curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/"
