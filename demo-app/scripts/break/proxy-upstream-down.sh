#!/bin/sh
# Breakage (M5.4): point the proxy at a port nothing listens on, simulating
# an app that's crashed or never started. The proxy itself stays up and
# answers — with a 502, because it reached out and got nothing back.
#   sh scripts/break/proxy-upstream-down.sh
# Observe:  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/
# Restore:  sh scripts/break/proxy-restore.sh
set -e
cd "$(dirname "$0")/../.."
cat > nginx/nginx.conf <<'EOF'
events {}
http {
  server {
    listen 80;
    location / {
      proxy_pass http://app:9999;   # nothing listens here — connection refused
      proxy_connect_timeout 2s;
    }
  }
}
EOF
docker compose restart proxy
echo "[break] proxy now points at a dead port. Try: curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/"
