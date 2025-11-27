#!/bin/bash

echo "==================================="
echo "DeepCoral t3.xlarge Setup Script"
echo "==================================="

# Update system
echo "Step 1: Updating system..."
sudo yum update -y

# Install Docker
echo "Step 2: Installing Docker..."
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "Step 3: Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install nginx
echo "Step 4: Installing nginx..."
sudo amazon-linux-extras install nginx1 -y || sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install certbot for SSL
echo "Step 5: Installing certbot..."
sudo yum install certbot python3-certbot-nginx -y

# Create nginx config for production
echo "Step 6: Creating nginx configuration..."
sudo tee /etc/nginx/conf.d/deepcoral-backend.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name api.deepcoral.site;
    
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
EOF

# Test and reload nginx
echo "Step 7: Testing nginx configuration..."
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "==================================="
echo "Basic Setup Complete!"
echo "==================================="
echo ""
echo "NEXT STEPS:"
echo "1. Update DNS: api.deepcoral.site → 54.206.47.239"
echo "2. Wait 5 minutes for DNS propagation"
echo "3. Run: sudo certbot --nginx -d api.deepcoral.site"
echo "4. Deploy Docker container (I'll provide the command)"
echo ""
echo "Current instance specs:"
free -h
echo ""
df -h /
