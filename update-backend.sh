#!/bin/bash
# Quick update script for DeepCoral backend on EC2
# Run this to pull latest code and restart the service

echo "=== Updating DeepCoral Backend ==="

# Navigate to backend directory
cd ~/deepcoralv1

# Pull latest code
echo "1. Pulling latest code from GitHub..."
git pull origin production

# Activate virtual environment and install any new packages
cd backend
source venv/bin/activate

echo "2. Installing/updating Python packages..."
pip install -r requirements.txt

# Restart the service
echo "3. Restarting backend service..."
sudo systemctl restart deepcoral-backend

echo "4. Waiting for service to start..."
sleep 3

# Check status
echo "5. Service status:"
sudo systemctl status deepcoral-backend --no-pager -l

echo ""
echo "=== Update Complete ==="
echo ""
echo "Check logs with:"
echo "  sudo journalctl -u deepcoral-backend -f"
