# Staging Environment Configuration for DeepCoral AI
# This allows testing with production-like settings without affecting the live site

## Architecture:
# - staging.deepcoral.site (Frontend) -> AWS Amplify staging branch
# - api-staging.deepcoral.site (Backend) -> EC2 Docker container on port 5001
# - deep_coral_ai_staging (Database) -> RDS staging database

## Setup Steps:

### 1. DNS Configuration (Hostinger)
Add these DNS records in Hostinger:
- Type: A Record
  Name: api-staging
  Value: 54.206.75.196 (Your EC2 IP)
  TTL: 3600

### 2. EC2 Nginx Configuration
SSH into EC2 and create /etc/nginx/conf.d/deepcoral-staging.conf:

```nginx
server {
    server_name api-staging.deepcoral.site;
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5001;  # Different port for staging
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 80;
}
```

### 3. SSL Certificate (Let's Encrypt)
```bash
sudo certbot --nginx -d api-staging.deepcoral.site
sudo systemctl reload nginx
```

### 4. Staging Database (RDS)
Option A: Use the same RDS with different database name
```sql
CREATE DATABASE deep_coral_ai_staging;
```

Option B: Create a separate RDS instance (recommended for true isolation)

### 5. Docker Container for Staging
```bash
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
  -e SECRET_KEY=staging-secret-key-different-from-prod \
  -e SESSION_COOKIE_SECURE=True \
  -e SESSION_COOKIE_DOMAIN=.deepcoral.site \
  -e DEBUG=False \
  -e CORS_ORIGINS='https://staging.deepcoral.site,https://www.staging.deepcoral.site' \
  -e SENDGRID_API_KEY=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 \
  -e SENDGRID_FROM_EMAIL=itaokjeffy@gmail.com \
  -e SENDGRID_FROM_NAME='DeepCoral Staging' \
  -e ADMIN_NOTIFICATION_EMAIL=itaokjeffy@gmail.com \
  -e COMPANY_NAME='DeepCoral AI' \
  -e COMPANY_WEBSITE=https://staging.deepcoral.site \
  -e SUPPORT_EMAIL=support@deepcoral.site \
  --restart unless-stopped \
  anonjeffz/deepcoral-backend:latest
```

### 6. Frontend Staging (AWS Amplify)
- Create a new branch: `staging` 
- In Amplify Console, add this branch
- Set environment variable: REACT_APP_API_URL=https://api-staging.deepcoral.site
- Connect to subdomain: staging.deepcoral.site

### 7. Backend Configuration Files

Create backend/.env.staging:
```env
FLASK_ENV=staging
DEBUG=False

# Staging DB
DB_HOST=deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com
DB_PORT=5432
DB_NAME=deep_coral_ai_staging
DB_USER=postgres
DB_PASSWORD=postgres-DEEPCORAL-db

# CORS for staging
CORS_ORIGINS=https://staging.deepcoral.site,https://www.staging.deepcoral.site

# Security settings
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_DOMAIN=.deepcoral.site
SECRET_KEY=staging-secret-key-change-this

# SendGrid (can use same or different)
SENDGRID_API_KEY=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
SENDGRID_FROM_EMAIL=itaokjeffy@gmail.com
SENDGRID_FROM_NAME=DeepCoral Staging

ADMIN_NOTIFICATION_EMAIL=itaokjeffy@gmail.com
COMPANY_NAME=DeepCoral AI (Staging)
COMPANY_WEBSITE=https://staging.deepcoral.site
SUPPORT_EMAIL=support@deepcoral.site
```

## Benefits:
✅ Test new features without affecting production users
✅ Separate database prevents data corruption
✅ Can test email notifications safely
✅ Real SSL/HTTPS environment
✅ Same infrastructure as production
✅ Easy rollback if issues found

## Workflow:
1. Develop locally on `development` branch
2. Merge to `staging` branch -> Auto-deploy to staging environment
3. Test thoroughly on staging.deepcoral.site
4. Merge to `production` branch -> Deploy to deepcoral.site

Would you like me to help you set this up?
