#!/bin/bash
# Quick setup script for staging environment on EC2

echo "🚀 Setting up DeepCoral AI Staging Environment"
echo "=============================================="

# 1. Create staging database
echo ""
echo "📊 Step 1: Create staging database on RDS"
echo "Run this SQL command on your RDS database:"
echo "   CREATE DATABASE deep_coral_ai_staging;"
echo "   -- Copy all tables from deep_coral_ai to deep_coral_ai_staging"
echo ""
read -p "Press Enter when done..."

# 2. Configure Nginx
echo ""
echo "⚙️  Step 2: Configure Nginx for staging subdomain"
sudo tee /etc/nginx/conf.d/deepcoral-staging.conf > /dev/null <<EOF
server {
    server_name api-staging.deepcoral.site;
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    listen 80;
}
EOF

echo "✅ Nginx configuration created"

# 3. Test Nginx configuration
echo ""
echo "🧪 Step 3: Testing Nginx configuration"
sudo nginx -t
if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "❌ Nginx configuration error!"
    exit 1
fi

# 4. Setup SSL
echo ""
echo "🔒 Step 4: Setting up SSL certificate"
echo "Make sure DNS for api-staging.deepcoral.site points to this server first!"
read -p "DNS configured? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot --nginx -d api-staging.deepcoral.site
    if [ $? -eq 0 ]; then
        echo "✅ SSL certificate installed"
    else
        echo "⚠️  SSL setup failed. You can run this manually later:"
        echo "   sudo certbot --nginx -d api-staging.deepcoral.site"
    fi
fi

# 5. Run Docker container
echo ""
echo "🐳 Step 5: Starting staging Docker container"
docker run -d \
  --name deepcoral-backend-staging \
  -p 5001:5000 \
  -e FLASK_ENV=staging \
  -e DB_HOST=deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres-DEEPCORAL-db \
  -e DB_NAME=deep_coral_ai_staging \
  -e RECAPTCHA_SECRET=6LfzdPgrAAAAAEAoYajhtsopyXLagc0zcyJW0NtX \
  -e SECRET_KEY=staging-08d34a04d883960a36dd863a7c047939da2a93718204f95c99f306f9c80e8650 \
  -e SESSION_COOKIE_SECURE=True \
  -e SESSION_COOKIE_DOMAIN=.deepcoral.site \
  -e DEBUG=False \
  -e SENDGRID_API_KEY=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 \
  -e SENDGRID_FROM_EMAIL=itaokjeffy@gmail.com \
  -e SENDGRID_FROM_NAME='DeepCoral Staging' \
  -e ADMIN_NOTIFICATION_EMAIL=itaokjeffy@gmail.com \
  -e COMPANY_NAME='DeepCoral AI (Staging)' \
  -e COMPANY_WEBSITE=https://staging.deepcoral.site \
  -e SUPPORT_EMAIL=support@deepcoral.site \
  --restart unless-stopped \
  anonjeffz/deepcoral-backend:latest

if [ $? -eq 0 ]; then
    echo "✅ Staging container started"
    echo ""
    echo "🔍 Checking container status:"
    docker ps | grep staging
else
    echo "❌ Failed to start staging container"
    exit 1
fi

echo ""
echo "✅ Staging environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure DNS: api-staging.deepcoral.site -> $(curl -s ifconfig.me)"
echo "2. Configure Amplify: Create 'staging' branch and connect subdomain"
echo "3. Test: https://api-staging.deepcoral.site"
echo ""
echo "📊 View logs: docker logs -f deepcoral-backend-staging"
echo "🛑 Stop staging: docker stop deepcoral-backend-staging"
echo "🔄 Restart staging: docker restart deepcoral-backend-staging"
