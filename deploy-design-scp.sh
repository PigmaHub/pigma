#!/usr/bin/env bash
# Deploy design dist folder to remote server via SCP
# Usage: ./deploy-design-scp.sh <user> <host> <remote-path> [port]
# Example: ./deploy-design-scp.sh root 192.168.1.100 /var/www/html 2222
# The script assumes that you have SSH key-based authentication set up.

set -e

# Load environment variables from .env if present
ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

LOCAL_DIR="${LOCAL_DIR:-apps/design/dist}"

REMOTE_USER="${SCP_USER:-$1}"
REMOTE_HOST="${SCP_HOST:-$2}"
REMOTE_PATH="${SCP_REMOTE_PATH:-$3}"
PORT="${SCP_PORT:-${4:-22}}"
SSH_KEY_PATH="${SSH_KEY_PATH:-}"

if [[ -z "$REMOTE_USER" || -z "$REMOTE_HOST" || -z "$REMOTE_PATH" ]]; then
  echo "Usage: $0 <user> <host> <remote-path> [port]"
  exit 1
fi

if [ ! -d "$LOCAL_DIR" ]; then
  echo "Local directory $LOCAL_DIR does not exist. Have you built the project?"
  exit 1
fi

# Build ssh key option if a custom key path is specified
KEY_OPTION=""
if [[ -n "$SSH_KEY_PATH" ]]; then
  KEY_OPTION="-i $SSH_KEY_PATH"
fi

echo "Deploying $LOCAL_DIR to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH via port $PORT ..."
scp -r -P "$PORT" $KEY_OPTION "$LOCAL_DIR"/* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

echo "Deployment finished successfully."
