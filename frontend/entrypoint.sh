#!/bin/sh

echo "Generating runtime config.js..."
envsubst < /app/config.template.js > /app/dist/config.js

echo "Starting frontend server..."
exec "$@"
