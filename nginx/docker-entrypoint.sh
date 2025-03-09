#!/bin/sh

# Load environment variables from .env if running locally (not needed in Docker)
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Replace placeholders with actual environment variables
envsubst '${DOMAIN}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start NGINX
nginx -g 'daemon off;'
