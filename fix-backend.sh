#!/bin/bash
# Fix model files and paths on EC2

echo "=== Fixing DeepCoral Backend ==="

cd ~/deepcoralv1

# Reset any local changes and pull fresh code
echo "1. Resetting and pulling latest code..."
git fetch origin
git reset --hard origin/production

# Install Git LFS if not installed
echo "2. Installing Git LFS..."
sudo yum install -y git-lfs
git lfs install

# Pull LFS files (model files) - must be from root directory
echo "3. Downloading model files from Git LFS..."
git lfs pull

# Verify models exist
echo "4. Checking model files..."
ls -lh backend/models/*.pt backend/models/*.pth backend/models/segmentation/version4/*.pth 2>/dev/null || echo "⚠️  Some model files missing"

# Create directories with proper permissions
echo "5. Creating upload directories..."
cd backend
mkdir -p coral_uploads/outputs coral_uploads/masks
mkdir -p profile_uploads shared_uploads elements
chmod -R 755 coral_uploads profile_uploads shared_uploads elements

# Check upload_image.py for correct paths
echo "6. Verifying upload_image.py paths..."
grep -n "coral_uploads" routes/upload_image.py | head -5

# Restart service
echo "7. Restarting backend service..."
sudo systemctl restart deepcoral-backend

echo "8. Waiting for service to start..."
sleep 5

# Check status
echo "9. Service status:"
sudo systemctl status deepcoral-backend --no-pager -l | tail -20

echo ""
echo "=== Fix Complete ==="
echo ""
echo "Check logs:"
echo "  sudo journalctl -u deepcoral-backend -f"
echo ""
echo "Test API:"
echo "  curl http://localhost:5000/csrf-token"
