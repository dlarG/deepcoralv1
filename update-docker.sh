#!/bin/bash
# Complete Docker Update Script for DeepCoral Backend
# Run this on EC2: bash update-docker.sh

set -e  # Exit on any error

echo "=================================================="
echo "  DeepCoral Backend Docker Update Script"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="deepcoral-backend"
IMAGE_NAME="anonjeffz/deepcoral-backend:latest"
BACKUP_IMAGE="anonjeffz/deepcoral-backend:backup-$(date +%Y%m%d-%H%M%S)"

echo -e "${YELLOW}Step 1: Checking if container exists...${NC}"
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✓ Container found${NC}"
    
    # Backup current image
    echo -e "${YELLOW}Step 2: Creating backup of current container...${NC}"
    docker commit $CONTAINER_NAME $BACKUP_IMAGE
    echo -e "${GREEN}✓ Backup created: $BACKUP_IMAGE${NC}"
    
    # Stop and remove container
    echo -e "${YELLOW}Step 3: Stopping and removing old container...${NC}"
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
    echo -e "${GREEN}✓ Old container removed${NC}"
else
    echo -e "${YELLOW}Container not found, will create new one${NC}"
fi

# Check if we have updated backend files
echo -e "${YELLOW}Step 4: Checking for updated backend code...${NC}"
if [ -d ~/deepcoralv1/backend ]; then
    cd ~/deepcoralv1/backend
    echo -e "${GREEN}✓ Backend directory found${NC}"
else
    echo -e "${RED}✗ Backend directory not found!${NC}"
    echo "Please clone the repository first:"
    echo "  cd ~ && git clone https://github.com/dlarG/deepcoralv1.git"
    exit 1
fi

# Pull latest code
echo -e "${YELLOW}Step 5: Pulling latest code from GitHub...${NC}"
cd ~/deepcoralv1
git pull origin production
echo -e "${GREEN}✓ Code updated${NC}"

# Build new Docker image
echo -e "${YELLOW}Step 6: Building new Docker image...${NC}"
cd ~/deepcoralv1/backend

# Try to build the image
if docker build -t $IMAGE_NAME .; then
    echo -e "${GREEN}✓ Docker image built successfully${NC}"
else
    echo -e "${RED}✗ Docker build failed${NC}"
    echo -e "${YELLOW}Attempting alternative: Manual installation...${NC}"
    
    # Pull base image and install manually
    docker pull python:3.11-slim
    
    # Create temporary container
    docker run -d --name temp-build python:3.11-slim tail -f /dev/null
    
    # Copy files
    docker cp requirements.txt temp-build:/tmp/
    docker exec temp-build pip install -r /tmp/requirements.txt
    
    # Commit as new image
    docker commit temp-build $IMAGE_NAME
    docker stop temp-build
    docker rm temp-build
    
    echo -e "${GREEN}✓ Alternative build completed${NC}"
fi

# Create necessary directories on host
echo -e "${YELLOW}Step 7: Creating data directories...${NC}"
mkdir -p ~/deepcoralv1/backend/coral_uploads/outputs
mkdir -p ~/deepcoralv1/backend/coral_uploads/masks
mkdir -p ~/deepcoralv1/backend/profile_uploads
mkdir -p ~/deepcoralv1/backend/shared_uploads
echo -e "${GREEN}✓ Directories created${NC}"

# Start new container
echo -e "${YELLOW}Step 8: Starting new container...${NC}"
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 5000:5000 \
  -e DB_HOST="deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com" \
  -e DB_NAME="deep_coral_ai" \
  -e DB_USER="postgres" \
  -e DB_PASSWORD="postgres-DEEPCORAL-db" \
  -e DB_PORT="5432" \
  -e FLASK_ENV="production" \
  -e SECRET_KEY="deepcoral-secret-key-production-2024" \
  -e SENDGRID_API_KEY="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" \
  -e CORS_ORIGINS="https://deepcoral.site,https://www.deepcoral.site" \
  -v ~/deepcoralv1/backend/coral_uploads:/app/coral_uploads \
  -v ~/deepcoralv1/backend/profile_uploads:/app/profile_uploads \
  -v ~/deepcoralv1/backend/shared_uploads:/app/shared_uploads \
  -v ~/deepcoralv1/backend/models:/app/models \
  $IMAGE_NAME

echo -e "${GREEN}✓ Container started${NC}"

# Wait for container to start
echo -e "${YELLOW}Step 9: Waiting for container to initialize...${NC}"
sleep 5

# Check container status
echo -e "${YELLOW}Step 10: Checking container status...${NC}"
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✓ Container is running${NC}"
    
    # Show logs
    echo ""
    echo -e "${YELLOW}Container logs:${NC}"
    docker logs --tail 30 $CONTAINER_NAME
    
    echo ""
    echo -e "${GREEN}=================================================="
    echo "  ✓ Docker Update Complete!"
    echo "==================================================${NC}"
    echo ""
    echo "Container Status:"
    docker ps | grep $CONTAINER_NAME
    echo ""
    echo "Useful Commands:"
    echo "  - View logs:        docker logs -f $CONTAINER_NAME"
    echo "  - Restart:          docker restart $CONTAINER_NAME"
    echo "  - Stop:             docker stop $CONTAINER_NAME"
    echo "  - Check status:     docker ps | grep $CONTAINER_NAME"
    echo "  - Restore backup:   docker tag $BACKUP_IMAGE $IMAGE_NAME"
    echo ""
else
    echo -e "${RED}✗ Container failed to start${NC}"
    echo ""
    echo "Error logs:"
    docker logs --tail 50 $CONTAINER_NAME
    echo ""
    echo "To restore backup:"
    echo "  docker tag $BACKUP_IMAGE $IMAGE_NAME"
    exit 1
fi
