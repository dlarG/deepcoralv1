# Complete AWS Deployment Guide - DeepCoral Backend

## 🎯 Overview
This guide covers the complete setup of:
- AWS EC2 instance (Ubuntu/Amazon Linux)
- AWS RDS PostgreSQL database with PostGIS
- Backend deployment with Docker
- SSL/HTTPS configuration
- Production security setup

---

## 📋 Prerequisites

### Required AWS Resources
1. AWS Account with appropriate permissions
2. AWS CLI installed and configured locally
3. EC2 Key Pair (`.pem` file) downloaded

### Local Requirements
- Git configured with your repository access
- SSH client
- AWS CLI v2

---

## 🚀 Part 1: AWS Console Setup

### Step 1: Create RDS PostgreSQL Database

1. **Navigate to RDS Console**
   - Go to AWS Console → RDS → Databases → Create database

2. **Engine Configuration**
   - Engine type: PostgreSQL
   - Version: PostgreSQL 15.x (recommended)
   - Template: Production (or Free tier for testing)

3. **Settings**
   - DB instance identifier: `deepcoral-db`
   - Master username: `postgres`
   - Master password: Create strong password (save to password manager!)

4. **Instance Configuration**
   - DB instance class: 
     - Production: `db.t3.medium` or higher
     - Testing: `db.t3.micro` (free tier eligible)
   - Storage: 
     - Type: General Purpose SSD (gp3)
     - Allocated: 20 GB minimum
     - Enable storage autoscaling (max 100 GB)

5. **Connectivity**
   - VPC: Default VPC (or create custom VPC)
   - Public access: **Yes** (for initial setup)
   - VPC security group: Create new `deepcoral-rds-sg`
   - Availability zone: No preference
   - Database port: 5432

6. **Additional Configuration**
   - Initial database name: `deep_coral_ai`
   - Enable automated backups (7-35 day retention)
   - Backup window: Choose low-traffic time
   - Enable encryption (recommended)
   - Enable Enhanced monitoring (optional)

7. **Create Database**
   - Click "Create database"
   - Wait 5-10 minutes for creation
   - **Save the endpoint URL** (e.g., `deepcoral-db.xxxx.region.rds.amazonaws.com`)

### Step 2: Configure RDS Security Group

1. **Navigate to EC2 Console → Security Groups**
2. **Find** `deepcoral-rds-sg`
3. **Edit Inbound Rules:**
   - Type: PostgreSQL
   - Port: 5432
   - Source: 
     - Your IP (for testing): `<your-ip>/32`
     - EC2 Security Group (after EC2 creation): `sg-xxxxxxxx`
   - Description: Allow PostgreSQL from EC2

### Step 3: Create EC2 Instance

1. **Navigate to EC2 Console → Launch Instance**

2. **Name and Tags**
   - Name: `deepcoral-backend`

3. **Application and OS Images (AMI)**
   - Choose: **Amazon Linux 2023** or **Ubuntu Server 22.04 LTS**
   - Architecture: 64-bit (x86)

4. **Instance Type**
   - Production: `t3.medium` (2 vCPU, 4 GB RAM) or higher
   - Testing: `t3.small` (2 vCPU, 2 GB RAM)
   - Note: Deep learning models need at least 2 GB RAM

5. **Key Pair**
   - Select existing key pair or create new
   - **Download and save** `.pem` file to `PROTECTED/` folder
   - Name example: `aws-ec2-deepcoral.pem`

6. **Network Settings**
   - VPC: Same as RDS
   - Auto-assign public IP: Enable
   - Firewall (security groups): Create new `deepcoral-ec2-sg`
   - Add rules:
     - SSH (22): Your IP
     - HTTP (80): Anywhere (0.0.0.0/0)
     - HTTPS (443): Anywhere (0.0.0.0/0)
     - Custom TCP (5000): Anywhere (for testing, restrict later)

7. **Configure Storage**
   - Root volume: 30 GB minimum (gp3)
   - Note: Deep learning models and uploads need space

8. **Advanced Details**
   - IAM instance profile: Create IAM role for Secrets Manager access (see below)
   - Monitoring: Enable detailed monitoring (optional)

9. **Launch Instance**
   - Wait for instance to be "Running"
   - **Save the Public IPv4 address**

### Step 4: Create IAM Role for EC2 (Secrets Manager Access)

1. **Navigate to IAM Console → Roles → Create role**
2. **Trusted entity type:** AWS service → EC2
3. **Permissions policies:**
   - `SecretsManagerReadWrite`
4. **Role name:** `deepcoral-ec2-secrets-role`
5. **Create role**
6. **Attach to EC2:**
   - EC2 Console → Select instance → Actions → Security → Modify IAM role
   - Select `deepcoral-ec2-secrets-role`

### Step 5: Store Secrets in AWS Secrets Manager

1. **Navigate to Secrets Manager → Store a new secret**

2. **Secret #1: Database Credentials**
   - Secret type: Credentials for RDS database
   - Username: `postgres`
   - Password: Your RDS master password
   - Database: Select your RDS instance
   - Secret name: `deepcoral/rds/credentials`

3. **Secret #2: SendGrid API Key**
   - Secret type: Other type of secret
   - Key/value pairs:
     - `SENDGRID_API_KEY`: Your SendGrid API key
   - Secret name: `deepcoral/sendgrid/api-key`

4. **Secret #3: reCAPTCHA Secret**
   - Secret type: Other type of secret
   - Key/value pairs:
     - `RECAPTCHA_SECRET`: Your reCAPTCHA secret key
   - Secret name: `deepcoral/recaptcha/secret`

---

## 🔧 Part 2: EC2 Initial Setup

### Connect to EC2

```bash
# Set proper permissions on key file
chmod 400 PROTECTED/aws-ec2-deepcoral.pem

# SSH to EC2 (replace with your IP and key file name)
ssh -i "PROTECTED/aws-ec2-deepcoral.pem" ec2-user@<YOUR-EC2-PUBLIC-IP>

# For Ubuntu, use:
ssh -i "PROTECTED/aws-ec2-deepcoral.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

### System Update and Dependencies

**For Amazon Linux 2023:**
```bash
# Update system
sudo yum update -y

# Install basic tools
sudo yum install -y git wget curl vim htop

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install PostgreSQL client
sudo yum install -y postgresql15

# Install Python (if running without Docker)
sudo yum install -y python3.11 python3.11-pip python3.11-devel

# Install AWS CLI (usually pre-installed on Amazon Linux)
aws --version
```

**For Ubuntu:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install basic tools
sudo apt install -y git wget curl vim htop

# Install Docker
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install PostgreSQL client
sudo apt install -y postgresql-client

# Install Python
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Logout and login again for Docker group to take effect:**
```bash
exit
# SSH back in
ssh -i "PROTECTED/aws-ec2-deepcoral.pem" ec2-user@<YOUR-EC2-PUBLIC-IP>
```

---

## 🗄️ Part 3: Database Setup

### Initialize PostgreSQL Database

```bash
# Connect to RDS (replace with your RDS endpoint and password)
export PGPASSWORD='your-rds-password'
export RDS_ENDPOINT='deepcoral-db.xxxx.region.rds.amazonaws.com'

# Test connection
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai -c "SELECT version();"

# Create PostGIS extension
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Verify PostGIS installation
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai -c "SELECT PostGIS_version();"
```

### Option 1: Initialize from SQL file (if you have init_db.sql)

```bash
# Clone your repository first (see next section)
cd ~/deepcoralv1/backend

# Run initialization script
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai -f init_db.sql
```

### Option 2: Restore from backup dump

```bash
# If you have a backup dump file
# First, upload dump to EC2 using SCP from local machine:
# scp -i "PROTECTED/aws-ec2-deepcoral.pem" PROTECTED/deep_coral_backup.sql ec2-user@<EC2-IP>:~/

# Then restore on EC2:
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai -f ~/deep_coral_backup.sql
```

### Verify Database Setup

```bash
# List all tables
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai -c "\dt"

# Check users table structure
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai -c "\d users"

# Verify PostGIS tables exist
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai -c "\d coral_distribution"
```

---

## 📦 Part 4: Backend Deployment

### Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository
git clone <YOUR-REPO-URL> deepcoralv1
cd deepcoralv1/backend
```

### Create Production Environment File

```bash
# Create .env.production
cat > .env.production << 'EOF'
# Environment
FLASK_ENV=production
DEBUG=False

# Database
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-rds-password
DB_NAME=deep_coral_ai

# Flask
SECRET_KEY=your-generated-secret-key-here

# CORS (replace with your frontend domain)
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# SendGrid (or leave empty, will fetch from AWS Secrets)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@deepcoral.com
SENDGRID_FROM_NAME=DeepCoral AI System

# Admin settings
ADMIN_NOTIFICATION_EMAIL=admin@deepcoral.com
COMPANY_NAME=DeepCoral AI
COMPANY_WEBSITE=https://deepcoral.com
SUPPORT_EMAIL=support@deepcoral.com
EOF

# Generate secure SECRET_KEY
python3 -c "import secrets; print(secrets.token_hex(32))"
# Copy the output and update SECRET_KEY in .env.production

# Update .env.production with your values
vim .env.production
```

### Option A: Deploy with Docker (Recommended)

```bash
# Build Docker image
docker build -t deepcoral-backend .

# Create data directories
mkdir -p ~/deepcoral_data/coral_uploads/outputs
mkdir -p ~/deepcoral_data/coral_uploads/masks
mkdir -p ~/deepcoral_data/profile_uploads
mkdir -p ~/deepcoral_data/shared_uploads

# Run container
docker run -d \
  --name deepcoral-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env.production \
  -v ~/deepcoral_data/coral_uploads:/app/coral_uploads \
  -v ~/deepcoral_data/profile_uploads:/app/profile_uploads \
  -v ~/deepcoral_data/shared_uploads:/app/shared_uploads \
  -v ~/deepcoralv1/backend/models:/app/models:ro \
  deepcoral-backend

# Check logs
docker logs -f deepcoral-backend

# Check if running
docker ps

# Test API
curl http://localhost:5000/csrf-token
```

### Option B: Deploy with Systemd Service (Direct Python)

```bash
# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Test run
python app.py
# Press Ctrl+C to stop

# Create systemd service
sudo tee /etc/systemd/system/deepcoral-backend.service > /dev/null << 'EOF'
[Unit]
Description=DeepCoral Backend API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/deepcoralv1/backend
Environment="PATH=/home/ec2-user/deepcoralv1/backend/venv/bin"
EnvironmentFile=/home/ec2-user/deepcoralv1/backend/.env.production
ExecStart=/home/ec2-user/deepcoralv1/backend/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# For Ubuntu, replace ec2-user with ubuntu

# Reload systemd
sudo systemctl daemon-reload

# Start service
sudo systemctl start deepcoral-backend

# Enable auto-start on boot
sudo systemctl enable deepcoral-backend

# Check status
sudo systemctl status deepcoral-backend

# View logs
sudo journalctl -u deepcoral-backend -f

# Test API
curl http://localhost:5000/csrf-token
```

---

## 🔒 Part 5: SSL/HTTPS Setup with Let's Encrypt

### Install Nginx

**Amazon Linux:**
```bash
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**Ubuntu:**
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
sudo tee /etc/nginx/conf.d/deepcoral.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Increase upload size
    client_max_body_size 200M;

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
        
        # Timeouts for large uploads
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }
}
EOF

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Install Certbot and Get SSL Certificate

**Amazon Linux:**
```bash
# Install Certbot
sudo yum install -y python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Ubuntu:**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Follow prompts:**
- Enter email address
- Agree to terms
- Choose to redirect HTTP to HTTPS (option 2)

**Test auto-renewal:**
```bash
sudo certbot renew --dry-run
```

---

## 🔐 Part 6: Security Hardening

### Update Security Groups

1. **EC2 Security Group - Restrict SSH:**
   - Edit inbound rules
   - SSH (22): Change from "Anywhere" to "My IP"

2. **RDS Security Group:**
   - Edit inbound rules
   - PostgreSQL (5432): Remove "Anywhere", add EC2 security group only

### Configure Firewall

**Amazon Linux:**
```bash
# Enable firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Allow SSH, HTTP, HTTPS
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

**Ubuntu (UFW):**
```bash
# Enable UFW
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### Set Up Automatic Security Updates

**Amazon Linux:**
```bash
sudo yum install -y yum-cron
sudo systemctl enable yum-cron
sudo systemctl start yum-cron
```

**Ubuntu:**
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📊 Part 7: Monitoring and Maintenance

### Set Up CloudWatch Logs (Optional)

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Configure (follow interactive prompts)
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### Useful Monitoring Commands

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check system load
htop

# Docker: View logs
docker logs -f deepcoral-backend

# Docker: Container stats
docker stats deepcoral-backend

# Systemd: View logs
sudo journalctl -u deepcoral-backend -f

# Systemd: Service status
sudo systemctl status deepcoral-backend

# Nginx: Access logs
sudo tail -f /var/log/nginx/access.log

# Nginx: Error logs
sudo tail -f /var/log/nginx/error.log
```

### Database Backup Script

```bash
# Create backup script
cat > ~/backup-db.sh << 'EOF'
#!/bin/bash
export PGPASSWORD='your-rds-password'
export RDS_ENDPOINT='your-rds-endpoint'
BACKUP_DIR="$HOME/db-backups"
mkdir -p $BACKUP_DIR

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/deepcoral_backup_$DATE.sql"

pg_dump -h $RDS_ENDPOINT -U postgres -d deep_coral_ai > $BACKUP_FILE

# Keep only last 7 backups
ls -t $BACKUP_DIR/deepcoral_backup_*.sql | tail -n +8 | xargs rm -f

echo "Backup completed: $BACKUP_FILE"
EOF

chmod +x ~/backup-db.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add line:
# 0 2 * * * /home/ec2-user/backup-db.sh >> /home/ec2-user/backup.log 2>&1
```

---

## 🚀 Part 8: Redeployment Process

### Quick Redeploy (Code Updates)

**With Docker:**
```bash
# SSH to EC2
ssh -i "PROTECTED/aws-ec2-deepcoral.pem" ec2-user@<EC2-IP>

# Navigate to repo
cd ~/deepcoralv1

# Pull latest code
git pull origin main

# Rebuild and restart
cd backend
docker build -t deepcoral-backend .
docker stop deepcoral-backend
docker rm deepcoral-backend

# Run with same configuration
docker run -d \
  --name deepcoral-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env.production \
  -v ~/deepcoral_data/coral_uploads:/app/coral_uploads \
  -v ~/deepcoral_data/profile_uploads:/app/profile_uploads \
  -v ~/deepcoral_data/shared_uploads:/app/shared_uploads \
  -v ~/deepcoralv1/backend/models:/app/models:ro \
  deepcoral-backend

# Check logs
docker logs -f deepcoral-backend
```

**With Systemd:**
```bash
# SSH to EC2
ssh -i "PROTECTED/aws-ec2-deepcoral.pem" ec2-user@<EC2-IP>

# Pull latest code
cd ~/deepcoralv1
git pull origin main

# Restart service
sudo systemctl restart deepcoral-backend

# Check logs
sudo journalctl -u deepcoral-backend -f
```

---

## ✅ Testing Checklist

After deployment, verify:

- [ ] EC2 instance running and accessible via SSH
- [ ] RDS database accessible from EC2
- [ ] PostGIS extension installed in database
- [ ] Backend application running (Docker or systemd)
- [ ] API responding: `curl https://your-domain.com/csrf-token`
- [ ] SSL certificate valid and auto-renewing
- [ ] CORS configured correctly for frontend domain
- [ ] File uploads working (check directories)
- [ ] Database queries working (test registration/login)
- [ ] Email notifications working (SendGrid)
- [ ] CloudWatch logs streaming (if configured)
- [ ] Automatic backups configured
- [ ] Security groups properly restricted

---

## 🆘 Troubleshooting

### Backend not responding
```bash
# Check if process is running
docker ps  # or
sudo systemctl status deepcoral-backend

# Check logs
docker logs deepcoral-backend  # or
sudo journalctl -u deepcoral-backend -n 100

# Check port
sudo netstat -tlnp | grep 5000
```

### Database connection errors
```bash
# Test connection
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai

# Check security group allows EC2
# Check .env.production has correct credentials
```

### SSL certificate issues
```bash
# Test renewal
sudo certbot renew --dry-run

# Check Nginx configuration
sudo nginx -t

# View Nginx errors
sudo tail -f /var/log/nginx/error.log
```

### Out of memory
```bash
# Check memory
free -h

# Consider upgrading EC2 instance type
# Or add swap space
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 📝 Important Notes

1. **Costs**: Monitor your AWS billing dashboard regularly
2. **Backups**: Set up automated RDS backups and snapshots
3. **Scaling**: Consider using Application Load Balancer for multiple EC2 instances
4. **CDN**: Use CloudFront for static assets and frontend
5. **Monitoring**: Set up CloudWatch alarms for CPU, memory, disk usage
6. **Security**: Regularly update dependencies and apply security patches
7. **Secrets**: Never commit credentials to Git; use AWS Secrets Manager

---

## 🔗 Quick Reference

**Connect to EC2:**
```bash
ssh -i "PROTECTED/aws-ec2-deepcoral.pem" ec2-user@<EC2-IP>
```

**Connect to RDS:**
```bash
export PGPASSWORD='your-password'
psql -h your-rds-endpoint -U postgres -d deep_coral_ai
```

**Restart Backend:**
```bash
# Docker
docker restart deepcoral-backend

# Systemd
sudo systemctl restart deepcoral-backend
```

**View Logs:**
```bash
# Docker
docker logs -f deepcoral-backend

# Systemd
sudo journalctl -u deepcoral-backend -f
```

---

**Created:** February 2, 2026  
**For:** DeepCoral Backend Deployment  
**Version:** 1.0
