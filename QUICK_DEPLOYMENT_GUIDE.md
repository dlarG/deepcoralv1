# AWS Deployment - Quick Start Guide

## 🎯 Complete Deployment from Scratch

Follow these steps to deploy DeepCoral backend to AWS from a fresh start:

### Step 1: AWS Console Setup (15-20 minutes)

**1.1 Create RDS PostgreSQL Database**
- AWS Console → RDS → Create database
- Engine: PostgreSQL 15.x
- Instance: `db.t3.medium` (production) or `db.t3.micro` (testing)
- Master username: `postgres`
- Master password: Create and **save securely**
- DB name: `deep_coral_ai`
- Public access: Yes
- Security group: Create `deepcoral-rds-sg`
- **Save the RDS endpoint URL**

**1.2 Create EC2 Instance**
- AWS Console → EC2 → Launch Instance
- AMI: Amazon Linux 2023 or Ubuntu 22.04
- Instance type: `t3.medium` (production) or `t3.small` (testing)
- Key pair: Create and **download .pem file** to `PROTECTED/` folder
- Security group: Create `deepcoral-ec2-sg`
  - Allow: SSH (22), HTTP (80), HTTPS (443)
- Storage: 30 GB minimum
- **Save the public IP address**

**1.3 Create IAM Role**
- IAM Console → Roles → Create role
- Service: EC2
- Permissions: `SecretsManagerReadWrite`
- Name: `deepcoral-ec2-secrets-role`
- Attach to EC2: Actions → Security → Modify IAM role

**1.4 Configure Security Groups**
- RDS Security Group: Allow port 5432 from EC2 security group
- EC2 Security Group: Allow SSH from your IP only

### Step 2: Upload Key and Scripts (2 minutes)

From your local machine (Windows PowerShell):

```powershell
# Navigate to project directory
cd "C:\Users\acer\Documents\DOCUMENTS\CAPSTONE PROJECT (DeepCoral)\codes\deepcoralv1"

# Set key permissions (if not already done)
# Right-click aws-ec2.pem → Properties → Security → Advanced
# Remove all permissions except current user

# Upload deployment scripts to EC2
scp -i "PROTECTED\aws-ec2.pem" PROTECTED\setup-ec2-complete.sh ec2-user@YOUR-EC2-IP:~/
scp -i "PROTECTED\aws-ec2.pem" PROTECTED\setup-rds-database.sh ec2-user@YOUR-EC2-IP:~/
scp -i "PROTECTED\aws-ec2.pem" PROTECTED\redeploy-backend.sh ec2-user@YOUR-EC2-IP:~/

# For Ubuntu, replace 'ec2-user' with 'ubuntu'
```

### Step 3: Connect to EC2 (1 minute)

```powershell
# SSH to EC2
ssh -i "PROTECTED\aws-ec2.pem" ec2-user@YOUR-EC2-IP

# For Ubuntu:
# ssh -i "PROTECTED\aws-ec2.pem" ubuntu@YOUR-EC2-IP
```

### Step 4: Setup Database (5 minutes)

On EC2:

```bash
# Make script executable
chmod +x setup-rds-database.sh

# Run database setup
./setup-rds-database.sh

# Follow prompts:
# - Enter RDS endpoint
# - Enter database name: deep_coral_ai
# - Enter username: postgres
# - Enter password: [your RDS password]
# - Run initialization: y
# - Import sample data: y (optional)
```

**What this does:**
- Tests connection to RDS
- Creates PostGIS extension
- Creates database schema (tables, indexes)
- Imports sample data (if available)
- Creates backup

### Step 5: Setup EC2 (10-15 minutes)

On EC2:

```bash
# Make script executable
chmod +x setup-ec2-complete.sh

# Run EC2 setup
./setup-ec2-complete.sh

# Follow prompts:
# - GitHub repo URL: https://github.com/your-username/deepcoral.git
# - RDS endpoint: [from AWS Console]
# - RDS password: [your RDS password]
# - Deployment method: docker (recommended) or systemd
# - Domain name: your-domain.com (or skip for now)
```

**What this does:**
- Updates system packages
- Installs Docker, Python, PostgreSQL client, Nginx, AWS CLI
- Clones your repository
- Tests database connection
- Creates data directories
- Generates `.env.production` file
- Builds and runs Docker container OR sets up systemd service
- Configures Nginx reverse proxy
- Sets up firewall

**IMPORTANT:** After setup completes, logout and login again for Docker permissions to take effect.

### Step 6: Configure Environment (2 minutes)

```bash
# SSH back to EC2
ssh -i "PROTECTED/aws-ec2.pem" ec2-user@YOUR-EC2-IP

# Edit environment file
cd ~/deepcoralv1/backend
nano .env.production

# Update these critical values:
# - CORS_ORIGINS=https://your-frontend-domain.com
# - SENDGRID_API_KEY=SG.your-api-key (optional)
# - ADMIN_NOTIFICATION_EMAIL=your-email@example.com

# Save: Ctrl+O, Enter
# Exit: Ctrl+X

# Restart application
docker restart deepcoral-backend
# OR for systemd:
# sudo systemctl restart deepcoral-backend
```

### Step 7: Setup SSL Certificate (5 minutes)

Only after your domain DNS points to EC2 IP:

```bash
# Install Certbot
sudo yum install -y python3-certbot-nginx  # Amazon Linux
# OR
sudo apt install -y certbot python3-certbot-nginx  # Ubuntu

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# - Enter email
# - Agree to terms: y
# - Share email: n
# - Redirect HTTP to HTTPS: 2

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 8: Verify Deployment ✅

```bash
# Test API locally
curl http://localhost:5000/csrf-token

# Test via domain (after SSL setup)
curl https://your-domain.com/csrf-token

# Check logs
docker logs -f deepcoral-backend
# OR
sudo journalctl -u deepcoral-backend -f

# Check container status
docker ps

# Test database connection
cd ~/deepcoralv1/backend
export PGPASSWORD='your-rds-password'
psql -h your-rds-endpoint -U postgres -d deep_coral_ai -c "SELECT COUNT(*) FROM users;"
```

---

## 🔄 Redeployment (Code Updates)

When you push new code to GitHub:

```bash
# SSH to EC2
ssh -i "PROTECTED/aws-ec2.pem" ec2-user@YOUR-EC2-IP

# Run redeployment script
chmod +x redeploy-backend.sh
./redeploy-backend.sh

# Follow prompts:
# - Branch to pull from: main (or your branch)
```

**What this does:**
- Backs up current version
- Pulls latest code from GitHub
- Rebuilds Docker image (or updates dependencies)
- Stops old container/service
- Starts new container/service
- Verifies deployment
- Keeps old version for rollback

---

## 🆘 Quick Troubleshooting

### Backend not responding
```bash
# Check if running
docker ps  # or: sudo systemctl status deepcoral-backend

# View logs
docker logs deepcoral-backend  # or: sudo journalctl -u deepcoral-backend -n 100

# Restart
docker restart deepcoral-backend  # or: sudo systemctl restart deepcoral-backend
```

### Database connection error
```bash
# Test connection
export PGPASSWORD='your-password'
psql -h your-rds-endpoint -U postgres -d deep_coral_ai

# Check security groups in AWS Console
# Verify .env.production has correct credentials
```

### SSL certificate issue
```bash
# Renew certificate
sudo certbot renew

# Check Nginx config
sudo nginx -t
sudo systemctl reload nginx
```

### Out of disk space
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Clean up old deployment backups
rm -rf ~/deployments/backup_*
```

---

## 📊 Monitoring Commands

```bash
# System resources
htop
free -h
df -h

# Application logs
docker logs -f deepcoral-backend
sudo journalctl -u deepcoral-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Database
psql -h $RDS_ENDPOINT -U postgres -d deep_coral_ai
```

---

## 🔐 Security Checklist

After deployment:

- [ ] RDS security group only allows EC2 security group (port 5432)
- [ ] EC2 security group only allows your IP for SSH (port 22)
- [ ] SSL certificate installed and auto-renewing
- [ ] `.env.production` has secure SECRET_KEY (64+ chars)
- [ ] Database password is strong and unique
- [ ] Automatic backups enabled on RDS
- [ ] IAM role attached to EC2 (no hardcoded AWS credentials)
- [ ] Firewall enabled (firewalld or ufw)
- [ ] Automatic security updates enabled

---

## 📁 Important Files

| File | Location | Purpose |
|------|----------|---------|
| `AWS_DEPLOYMENT_COMPLETE_GUIDE.md` | Root | Complete deployment documentation |
| `setup-ec2-complete.sh` | PROTECTED/ | Automated EC2 setup |
| `setup-rds-database.sh` | PROTECTED/ | Automated RDS setup |
| `redeploy-backend.sh` | PROTECTED/ | Quick redeployment |
| `.env.production.template` | backend/ | Environment config template |
| `aws-ec2.pem` | PROTECTED/ | EC2 SSH key (keep secure!) |

---

## 🔗 Quick Commands Reference

**Connect to EC2:**
```bash
ssh -i "PROTECTED/aws-ec2.pem" ec2-user@YOUR-EC2-IP
```

**Connect to Database:**
```bash
export PGPASSWORD='your-password'
psql -h your-rds-endpoint -U postgres -d deep_coral_ai
```

**Restart Backend:**
```bash
docker restart deepcoral-backend  # or
sudo systemctl restart deepcoral-backend
```

**View Logs:**
```bash
docker logs -f deepcoral-backend  # or
sudo journalctl -u deepcoral-backend -f
```

**Backup Database:**
```bash
pg_dump -h $RDS_ENDPOINT -U postgres -d deep_coral_ai > backup.sql
```

**Update Code and Redeploy:**
```bash
./redeploy-backend.sh
```

---

## 💰 Cost Optimization Tips

**Development/Testing:**
- EC2: t3.micro or t3.small
- RDS: db.t3.micro (free tier eligible)
- Stop EC2 when not in use

**Production:**
- EC2: t3.medium or higher
- RDS: db.t3.medium with Multi-AZ for high availability
- Use Reserved Instances for 40-60% savings

---

**Need help?** Refer to [AWS_DEPLOYMENT_COMPLETE_GUIDE.md](AWS_DEPLOYMENT_COMPLETE_GUIDE.md) for detailed instructions.

**Last Updated:** February 2, 2026
