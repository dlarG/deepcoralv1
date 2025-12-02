#!/bin/bash

# Quick fix: Use environment variables instead of Secrets Manager
# Run this on EC2 instance

echo "Setting up database credentials via environment variables..."

# Add to .env.production
cat >> ~/deepcoralv1/backend/.env.production << 'EOF'

# Override Secrets Manager (use env vars instead)
USE_ENV_DB=true

# Database credentials (replace with actual values)
DB_HOST=deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres-DEEPCORAL-db
DB_NAME=deep_coral_ai
EOF

echo "✅ Environment variables configured!"
echo ""
echo "Restarting backend service..."
sudo systemctl restart deepcoral-backend

sleep 3

echo "Checking service status..."
sudo systemctl status deepcoral-backend --no-pager

echo ""
echo "Checking logs (should show no credential errors)..."
sudo journalctl -u deepcoral-backend -n 30 --no-pager

echo ""
echo "✅ Quick fix applied! Backend should now connect to RDS directly."
