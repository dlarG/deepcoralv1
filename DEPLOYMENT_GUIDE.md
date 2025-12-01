# DeepCoral Backend Deployment Guide

## Issue Summary
1. Email field not populating - **Database missing email column**
2. Username conflict error - **Backend code needs deployment**
3. Docker container crashing - **Missing sendgrid module**

## Solution: Two Options

### OPTION 1: Update Docker Container (Recommended)
This rebuilds the Docker image with all updates.

```bash
# SSH to EC2
ssh -i "PROTECTED/aws-ec2.pem" ec2-user@54.206.47.239

# Run the update script
chmod +x update-docker.sh
bash update-docker.sh
```

**What it does:**
- Pulls latest code from GitHub
- Builds new Docker image with sendgrid
- Creates backup of current container
- Starts new container with all fixes
- Mounts data directories properly

---

### OPTION 2: Run Flask Directly (If Docker fails)
This runs the Flask app as a systemd service without Docker.

```bash
# SSH to EC2
ssh -i "PROTECTED/aws-ec2.pem" ec2-user@54.206.47.239

# Run the direct setup script
chmod +x run-direct.sh
bash run-direct.sh
```

**What it does:**
- Installs Python 3.11 and dependencies
- Creates virtual environment
- Installs all packages including sendgrid
- Creates systemd service for auto-restart
- Stops Docker container to avoid port conflicts

**Service commands after setup:**
```bash
# View live logs
sudo journalctl -u deepcoral-backend -f

# Check status
sudo systemctl status deepcoral-backend

# Restart service
sudo systemctl restart deepcoral-backend

# Stop service
sudo systemctl stop deepcoral-backend
```

---

## CRITICAL: Add Email Column to Database

**This must be done FIRST before either option above!**

```bash
# SSH to EC2
ssh -i "PROTECTED/aws-ec2.pem" ec2-user@54.206.47.239

# Install PostgreSQL client
sudo yum install -y postgresql15

# Add email column
PGPASSWORD='postgres-DEEPCORAL-db' psql \
  -h deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com \
  -U postgres \
  -d deep_coral_ai \
  -f add_email_column.sql

# Verify columns were added
PGPASSWORD='postgres-DEEPCORAL-db' psql \
  -h deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com \
  -U postgres \
  -d deep_coral_ai \
  -c "\d users"
```

---

## Testing After Deployment

```bash
# Test the API is responding
curl http://localhost:5000/csrf-token

# Test through nginx
curl https://api.deepcoral.site/csrf-token

# Test from your browser
# Open DevTools Console and run:
fetch('https://api.deepcoral.site/csrf-token', {credentials: 'include'})
  .then(r => r.json())
  .then(console.log)
```

---

## What Gets Fixed

✅ **Email field** - Database now has email column, backend returns it, frontend displays it
✅ **Username conflict** - Backend uses case-insensitive check
✅ **sendgrid module** - Included in requirements.txt and installed
✅ **Profile updates** - All fixes deployed together
✅ **Auto-restart** - Container/service restarts automatically on failure

---

## Recommended Order

1. **First**: SSH to EC2
2. **Second**: Add email column to database (CRITICAL)
3. **Third**: Try Option 1 (Docker update)
4. **If Docker fails**: Use Option 2 (Direct Flask)
5. **Finally**: Test the application

---

## Rollback (If needed)

### For Docker:
```bash
# The update script creates a backup
docker images | grep backup

# Restore backup (replace timestamp with actual)
docker tag anonjeffz/deepcoral-backend:backup-TIMESTAMP anonjeffz/deepcoral-backend:latest
docker stop deepcoral-backend
docker rm deepcoral-backend
# Then restart with old image
```

### For Direct Flask:
```bash
# Stop the service
sudo systemctl stop deepcoral-backend

# Restart Docker container
docker start deepcoral-backend
```

---

## Files Transferred to EC2:
- ✅ `update-docker.sh` - Docker rebuild script
- ✅ `run-direct.sh` - Direct Flask setup script  
- ✅ `add_email_column.sql` - Database migration script

All ready to use!
