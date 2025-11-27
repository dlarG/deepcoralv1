#!/bin/bash

# Script to rebuild Docker container with all updates
# Run this on EC2 server

echo "=== DeepCoral Backend Docker Rebuild ==="
echo ""

# Stop the current container
echo "1. Stopping current container..."
docker stop deepcoral-backend

# Install sendgrid in the stopped container
echo "2. Installing sendgrid module..."
docker start deepcoral-backend
sleep 2
docker exec deepcoral-backend pip install sendgrid==6.10.0
docker stop deepcoral-backend

# Copy updated files
echo "3. Copying updated files..."
docker cp ~/profile_routes.py deepcoral-backend:/app/routes/profile_routes.py

# Check if app.py exists in home directory
if [ -f ~/app.py ]; then
    echo "   - Copying app.py..."
    docker cp ~/app.py deepcoral-backend:/app/app.py
fi

# Commit the container as a new image
echo "4. Creating new image from updated container..."
docker commit deepcoral-backend anonjeffz/deepcoral-backend:latest

# Remove old container
echo "5. Removing old container..."
docker rm deepcoral-backend

# Start new container with updated image
echo "6. Starting new container..."
docker run -d \
  --name deepcoral-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  -e DB_HOST="deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com" \
  -e DB_NAME="deep_coral_ai" \
  -e DB_USER="postgres" \
  -e DB_PASSWORD="postgres-DEEPCORAL-db" \
  -e DB_PORT="5432" \
  -e FLASK_ENV="production" \
  -e SECRET_KEY="your-secret-key-here" \
  -e SENDGRID_API_KEY="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" \
  -e CORS_ORIGINS="https://deepcoral.site,https://www.deepcoral.site" \
  -v /home/ec2-user/deepcoralv1/backend/coral_uploads:/app/coral_uploads \
  -v /home/ec2-user/deepcoralv1/backend/profile_uploads:/app/profile_uploads \
  anonjeffz/deepcoral-backend:latest

echo ""
echo "7. Waiting for container to start..."
sleep 5

echo ""
echo "8. Checking container status..."
docker ps | grep deepcoral-backend

echo ""
echo "9. Container logs (last 30 lines):"
docker logs --tail 30 deepcoral-backend

echo ""
echo "=== Rebuild Complete! ==="
echo ""
echo "To push the new image to Docker Hub:"
echo "  docker push anonjeffz/deepcoral-backend:latest"
echo ""
echo "To check logs:"
echo "  docker logs -f deepcoral-backend"
