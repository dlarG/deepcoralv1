#!/bin/bash
# Run DeepCoral Backend Directly (Without Docker)
# Use this if Docker continues to have build issues

echo "=================================================="
echo "  DeepCoral Backend Direct Setup (No Docker)"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Update code
echo -e "${YELLOW}1. Updating code from GitHub...${NC}"
cd ~/deepcoralv1

# Reset any local changes and pull fresh code
echo "   Resetting local changes..."
git reset --hard HEAD
git clean -fd

# Pull latest code
echo "   Pulling latest code..."
git pull origin production

echo -e "${GREEN}✓ Code updated${NC}"

# Install Python 3.11 if needed
echo -e "${YELLOW}2. Checking Python version...${NC}"
if ! command -v python3.11 &> /dev/null; then
    echo "Installing Python 3.11..."
    sudo yum install -y python3.11 python3.11-pip
fi
python3.11 --version
echo -e "${GREEN}✓ Python 3.11 ready${NC}"

# Create virtual environment (in backend directory)
echo -e "${YELLOW}3. Setting up virtual environment...${NC}"
cd ~/deepcoralv1/backend

# Remove old venv if exists
if [ -d "venv" ]; then
    echo "   Removing old virtual environment..."
    rm -rf venv
fi

echo "   Creating new virtual environment..."
python3.11 -m ensurepip --default-pip 2>/dev/null || true
python3.11 -m venv venv

if [ ! -f "venv/bin/activate" ]; then
    echo "   Virtual environment creation failed. Installing python3-virtualenv..."
    sudo yum install -y python3-virtualenv
    virtualenv -p python3.11 venv
fi

if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo -e "${GREEN}✓ Virtual environment activated${NC}"
else
    echo -e "${RED}✗ Failed to create virtual environment${NC}"
    echo "   Trying to continue without venv..."
    alias pip='python3.11 -m pip'
fi

# Install system dependencies
echo -e "${YELLOW}4. Installing system dependencies...${NC}"
sudo yum install -y \
    mesa-libGL \
    glib2 \
    python3-devel \
    gcc \
    gcc-c++

echo -e "${GREEN}✓ System dependencies installed${NC}"

# Install Python packages
echo -e "${YELLOW}5. Installing Python packages...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Python packages installed${NC}"

# Create directories (in backend folder)
echo -e "${YELLOW}6. Creating data directories...${NC}"
cd ~/deepcoralv1/backend
mkdir -p coral_uploads/outputs coral_uploads/masks
mkdir -p profile_uploads shared_uploads elements
echo -e "${GREEN}✓ Directories created${NC}"

# Set environment variables
echo -e "${YELLOW}7. Setting environment variables...${NC}"
export DB_HOST="deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com"
export DB_NAME="deep_coral_ai"
export DB_USER="postgres"
export DB_PASSWORD="postgres-DEEPCORAL-db"
export DB_PORT="5432"
export FLASK_ENV="production"
export SECRET_KEY="deepcoral-secret-key-production-2024"
export SENDGRID_API_KEY="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"
export CORS_ORIGINS="https://deepcoral.site,https://www.deepcoral.site"
echo -e "${GREEN}✓ Environment configured${NC}"

# Stop Docker container if running
echo -e "${YELLOW}8. Stopping Docker container (if running)...${NC}"
docker stop deepcoral-backend 2>/dev/null || true
echo -e "${GREEN}✓ Docker container stopped${NC}"

# Determine Python path
if [ -f "/home/ec2-user/deepcoralv1/backend/venv/bin/python" ]; then
    PYTHON_PATH="/home/ec2-user/deepcoralv1/backend/venv/bin/python"
    echo "   Using virtual environment Python"
else
    PYTHON_PATH="/usr/bin/python3.11"
    echo "   Using system Python 3.11"
fi

# Create systemd service
echo -e "${YELLOW}9. Creating systemd service...${NC}"
sudo tee /etc/systemd/system/deepcoral-backend.service > /dev/null <<EOF
[Unit]
Description=DeepCoral Backend Flask Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/deepcoralv1/backend
Environment="DB_HOST=deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com"
Environment="DB_NAME=deep_coral_ai"
Environment="DB_USER=postgres"
Environment="DB_PASSWORD=postgres-DEEPCORAL-db"
Environment="DB_PORT=5432"
Environment="FLASK_ENV=production"
Environment="SECRET_KEY=deepcoral-secret-key-production-2024"
Environment="SENDGRID_API_KEY=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"
Environment="CORS_ORIGINS=https://deepcoral.site,https://www.deepcoral.site"
Environment="PATH=/home/ec2-user/deepcoralv1/backend/venv/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=$PYTHON_PATH /home/ec2-user/deepcoralv1/backend/app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable deepcoral-backend
sudo systemctl start deepcoral-backend
echo -e "${GREEN}✓ Systemd service created and started${NC}"

# Check status
echo ""
echo -e "${YELLOW}10. Checking service status...${NC}"
sleep 3
sudo systemctl status deepcoral-backend --no-pager -l

echo ""
echo -e "${GREEN}=================================================="
echo "  ✓ Backend is now running directly!"
echo "==================================================${NC}"
echo ""
echo "Service Management:"
echo "  - View logs:        sudo journalctl -u deepcoral-backend -f"
echo "  - Check status:     sudo systemctl status deepcoral-backend"
echo "  - Restart:          sudo systemctl restart deepcoral-backend"
echo "  - Stop:             sudo systemctl stop deepcoral-backend"
echo "  - View recent logs: sudo journalctl -u deepcoral-backend -n 50"
echo ""
echo "Test the API:"
echo "  curl http://localhost:5000/csrf-token"
echo ""
