#!/bin/bash
# Setup SSL for EC2 Backend with nginx and Let's Encrypt

# Prerequisites:
# 1. You need a domain/subdomain pointing to your EC2 IP (54.206.75.196)
#    Example: api.deepcoral.site
# 2. Port 80 and 443 must be open in EC2 security group

echo "=== Installing nginx ==="
sudo yum update -y
sudo amazon-linux-extras install nginx1 -y

echo "=== Installing certbot for Let's Encrypt ==="
sudo yum install -y certbot python3-certbot-nginx

echo "=== Configuring nginx as reverse proxy ==="
sudo tee /etc/nginx/conf.d/deepcoral-backend.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name api.deepcoral.site;  # CHANGE THIS to your actual domain

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

echo "=== Starting nginx ==="
sudo systemctl start nginx
sudo systemctl enable nginx

echo "=== Obtaining SSL certificate from Let's Encrypt ==="
# CHANGE api.deepcoral.site to your actual domain and add your email
sudo certbot --nginx -d api.deepcoral.site --non-interactive --agree-tos -m your-email@example.com

echo "=== Setup complete! ==="
echo "Your backend should now be accessible at https://api.deepcoral.site"
echo ""
echo "Next steps:"
echo "1. Update frontend API_BASE_URL to https://api.deepcoral.site"
echo "2. Update CORS settings in backend to allow your frontend domain"
