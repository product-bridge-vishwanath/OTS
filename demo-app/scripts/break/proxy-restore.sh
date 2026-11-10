#!/bin/sh
# Restores the reverse proxy to its normal config, pointing at the real app.
# Run this after proxy-upstream-down.sh or proxy-upstream-slow.sh.
set -e
cd "$(dirname "$0")/../.."
docker rm -f slow-upstream-demo >/dev/null 2>&1 || true
cat > nginx/nginx.conf <<'EOF'
events {}

http {
  upstream app_upstream {
    server app:3000;
  }

  server {
    listen 80;

    location /api/health {
      proxy_pass http://app_upstream;
      access_log off;
    }

    location / {
      proxy_pass http://app_upstream;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_connect_timeout 3s;
      proxy_read_timeout 5s;
    }
  }
}
EOF
docker compose restart proxy
echo "[restore] proxy back to normal — pointing at app:3000."
