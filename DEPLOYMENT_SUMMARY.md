# DeepCoral AWS Deployment - Complete Package

## 🎯 What You Have Now

I've created a complete AWS deployment solution for your DeepCoral backend. Here's everything that's been set up:

### 📚 Documentation (3 files)

1. **[AWS_DEPLOYMENT_COMPLETE_GUIDE.md](AWS_DEPLOYMENT_COMPLETE_GUIDE.md)**
   - Complete step-by-step deployment guide
   - Detailed explanations for each step
   - Troubleshooting section
   - Security hardening guide
   - Monitoring and maintenance
   - 🎯 Use this for: First-time setup, detailed reference

2. **[QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md)**
   - Quick start checklist
   - Essential commands reference
   - Fast redeployment guide
   - Common troubleshooting
   - 🎯 Use this for: Quick reference, experienced users

3. **[PROTECTED/DEPLOYMENT_README.md](PROTECTED/DEPLOYMENT_README.md)**
   - Overview of all deployment resources
   - Script documentation
   - Workflow diagrams
   - Tips and best practices
   - 🎯 Use this for: Understanding the deployment system

### 🔧 Automation Scripts (4 files)

1. **[PROTECTED/setup-ec2-complete.sh](PROTECTED/setup-ec2-complete.sh)**
   - Complete EC2 instance setup
   - Installs all dependencies (Docker, Python, Nginx, etc.)
   - Clones repository
   - Deploys backend (Docker or systemd)
   - Configures firewall and Nginx
   - Run on: EC2 instance (first-time setup)

2. **[PROTECTED/setup-rds-database.sh](PROTECTED/setup-rds-database.sh)**
   - Initializes RDS PostgreSQL database
   - Installs PostGIS extension
   - Creates schema and tables
   - Imports sample data
   - Creates backup
   - Run on: EC2 instance or local machine with psql

3. **[PROTECTED/redeploy-backend.sh](PROTECTED/redeploy-backend.sh)**
   - Quick code updates and redeployment
   - Pulls latest code from GitHub
   - Rebuilds and restarts application
   - Creates backups for rollback
   - Verifies deployment
   - Run on: EC2 instance (for updates)

4. **[upload-to-ec2.ps1](upload-to-ec2.ps1)**
   - Uploads deployment scripts to EC2
   - Interactive prompts for connection details
   - Validates files before upload
   - Optionally connects to EC2
   - Run on: Local Windows machine

### ⚙️ Configuration (1 file)

1. **[backend/.env.production.template](backend/.env.production.template)**
   - Template for production environment variables
   - Detailed comments for each setting
   - Security notes
   - Quick setup guide
   - Copy to: `.env.production` (created during setup)

---

## 🚀 Deployment Process Overview

### Initial Setup (One-time, ~45 minutes)

```
1. AWS Console (15-20 min)
   ├─ Create RDS PostgreSQL instance
   ├─ Create EC2 instance  
   ├─ Create IAM role
   └─ Configure security groups

2. Local Machine (2 min)
   └─ Run: .\upload-to-ec2.ps1

3. On EC2 - Database (5 min)
   └─ Run: ./setup-rds-database.sh

4. On EC2 - Application (10-15 min)
   └─ Run: ./setup-ec2-complete.sh

5. On EC2 - Configuration (2 min)
   └─ Edit: .env.production

6. Domain Setup (5 min)
   └─ Point DNS to EC2 IP

7. On EC2 - SSL (5 min)
   └─ Run: sudo certbot --nginx -d your-domain.com
```

### Code Updates (Quick, ~2 minutes)

```
1. Local Machine
   └─ git push origin main

2. On EC2
   └─ ./redeploy-backend.sh
```

---

## 📋 Quick Start Checklist

### Prerequisites
- [ ] AWS account with appropriate permissions
- [ ] Domain name (optional, but recommended)
- [ ] SendGrid account (optional, for email)
- [ ] GitHub repository with DeepCoral code
- [ ] Local machine with Git, SSH, PowerShell

### AWS Setup
- [ ] RDS PostgreSQL instance created
- [ ] RDS endpoint and password saved
- [ ] EC2 instance created
- [ ] EC2 public IP saved
- [ ] SSH key (.pem file) downloaded to PROTECTED/
- [ ] IAM role created and attached to EC2
- [ ] Security groups configured (RDS ← EC2, EC2 ← Your IP)

### Deployment
- [ ] Scripts uploaded to EC2
- [ ] Database initialized
- [ ] EC2 configured
- [ ] Backend deployed and running
- [ ] .env.production updated with CORS_ORIGINS
- [ ] DNS pointed to EC2
- [ ] SSL certificate installed
- [ ] API tested and working

### Post-Deployment
- [ ] Backend responding to API calls
- [ ] Database queries working
- [ ] File uploads working
- [ ] Email notifications working (if configured)
- [ ] SSL certificate valid
- [ ] Automatic backups configured
- [ ] Security groups restricted
- [ ] Monitoring set up

---

## 🎓 How to Use This Package

### For First-Time Deployment

1. **Start with the Quick Guide**
   - Open [QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md)
   - Follow Step 1-8 in order
   - Use as a checklist

2. **Reference the Complete Guide when needed**
   - Open [AWS_DEPLOYMENT_COMPLETE_GUIDE.md](AWS_DEPLOYMENT_COMPLETE_GUIDE.md)
   - Find detailed explanations for each step
   - Troubleshoot issues

3. **Use the automation scripts**
   - Upload with: `upload-to-ec2.ps1`
   - Setup database: `setup-rds-database.sh`
   - Setup EC2: `setup-ec2-complete.sh`

### For Updates/Redeployment

1. **Push your code**
   ```powershell
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **SSH to EC2 and redeploy**
   ```bash
   ssh -i "PROTECTED/aws-ec2.pem" ec2-user@YOUR-EC2-IP
   ./redeploy-backend.sh
   ```

### For Troubleshooting

1. **Check Quick Guide troubleshooting section**
   - [QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md) → "Quick Troubleshooting"

2. **Check Complete Guide troubleshooting**
   - [AWS_DEPLOYMENT_COMPLETE_GUIDE.md](AWS_DEPLOYMENT_COMPLETE_GUIDE.md) → "Troubleshooting"

3. **Review logs**
   ```bash
   # Docker
   docker logs -f deepcoral-backend
   
   # Systemd
   sudo journalctl -u deepcoral-backend -f
   ```

---

## 💡 Key Features

### ✅ Automation
- Single-command EC2 setup
- Automated database initialization
- One-click redeployment
- Automatic backups

### ✅ Flexibility
- Support for Docker OR systemd deployment
- Works with Amazon Linux OR Ubuntu
- Optional SSL/domain configuration
- Customizable environment settings

### ✅ Safety
- Automatic backups before updates
- Easy rollback capability
- Configuration validation
- Detailed logging

### ✅ Documentation
- Step-by-step guides
- Quick reference
- Troubleshooting help
- Best practices

---

## 🔐 Security Features

- ✅ IAM roles (no hardcoded AWS credentials)
- ✅ Security group restrictions
- ✅ SSL/HTTPS with Let's Encrypt
- ✅ Firewall configuration
- ✅ Secrets management ready (AWS Secrets Manager)
- ✅ Environment variable isolation
- ✅ Automatic security updates

---

## 📊 What Gets Deployed

### On EC2 Instance
```
~/deepcoralv1/
├── backend/
│   ├── app.py                    (Flask application)
│   ├── .env.production          (Your configuration)
│   ├── requirements.txt         (Python dependencies)
│   ├── Dockerfile               (Container definition)
│   └── models/                  (AI models)
│
~/deepcoral_data/                 (Persistent data)
├── coral_uploads/
├── profile_uploads/
└── shared_uploads/
│
~/setup-rds-database.sh          (Database setup script)
~/setup-ec2-complete.sh          (EC2 setup script)
└── redeploy-backend.sh          (Update script)
```

### Services Running
```
- Docker container "deepcoral-backend" (port 5000)
  OR
- Systemd service "deepcoral-backend" (port 5000)

- Nginx (ports 80, 443) → Reverse proxy to backend
- Firewall (firewalld or ufw) → SSH, HTTP, HTTPS only
```

### On RDS
```
Database: deep_coral_ai
├── users                    (User accounts)
├── coral_lifeforms         (Coral types)
├── coral_distribution      (Location data with PostGIS)
├── coral_images           (Uploaded images)
├── detection_results      (AI detection results)
└── activity_logs          (Audit trail)

Extensions:
└── PostGIS                (Geospatial data)
```

---

## 🆘 Getting Help

### Documentation References

| Question | Document | Section |
|----------|----------|---------|
| How do I create EC2/RDS? | [Complete Guide](AWS_DEPLOYMENT_COMPLETE_GUIDE.md) | Part 1 |
| How do I deploy the backend? | [Quick Guide](QUICK_DEPLOYMENT_GUIDE.md) | Steps 1-8 |
| How do I update my code? | [Quick Guide](QUICK_DEPLOYMENT_GUIDE.md) | Redeployment |
| What does each script do? | [Deployment README](PROTECTED/DEPLOYMENT_README.md) | Script Details |
| Backend not responding? | [Complete Guide](AWS_DEPLOYMENT_COMPLETE_GUIDE.md) | Troubleshooting |
| How do I configure environment? | [Template File](backend/.env.production.template) | Comments |

### Common Issues

1. **Can't connect to EC2**
   - Check security group allows your IP for SSH (port 22)
   - Verify EC2 is running
   - Check key file path and permissions

2. **Database connection fails**
   - Check RDS security group allows EC2 security group
   - Verify RDS endpoint in .env.production
   - Check RDS status in AWS Console

3. **Backend not starting**
   - Check Docker/systemd logs
   - Verify .env.production has all required variables
   - Ensure port 5000 is not in use

4. **SSL certificate fails**
   - Verify DNS points to EC2 IP
   - Wait for DNS propagation (up to 24 hours)
   - Check domain name spelling

---

## 🎯 Next Steps

### After Successful Deployment

1. **Test thoroughly**
   - Register a test user
   - Upload test images
   - Verify AI detection
   - Test all features

2. **Monitor performance**
   - Check CloudWatch metrics
   - Review application logs
   - Monitor disk space

3. **Set up backups**
   - Configure automated RDS backups
   - Set up database backup script
   - Test restore procedure

4. **Optimize**
   - Adjust EC2/RDS instance sizes
   - Configure caching
   - Optimize database queries

5. **Scale** (when needed)
   - Add Application Load Balancer
   - Set up Auto Scaling
   - Configure CloudFront CDN

---

## 📞 Support Resources

### AWS Documentation
- [EC2 User Guide](https://docs.aws.amazon.com/ec2/)
- [RDS User Guide](https://docs.aws.amazon.com/rds/)
- [VPC Security Groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)

### Tools Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ✨ Summary

You now have everything needed to:

✅ Deploy DeepCoral backend to AWS EC2  
✅ Set up PostgreSQL RDS with PostGIS  
✅ Automate the entire deployment process  
✅ Quickly update and redeploy your code  
✅ Configure SSL/HTTPS  
✅ Monitor and maintain your application  
✅ Troubleshoot common issues  

**Total Time Investment:**
- First deployment: ~45 minutes
- Future updates: ~2 minutes

**Files Created:**
- 3 comprehensive guides
- 4 automation scripts
- 1 configuration template
- This summary

**Ready to deploy?** Start with [QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md)!

---

**Created:** February 2, 2026  
**For:** DeepCoral AWS Deployment  
**Version:** 1.0  
**Status:** Production Ready ✅
