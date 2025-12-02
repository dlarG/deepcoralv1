# Security & Environment Configuration

This guide explains how to set up your environment files securely.

## ⚠️ Important Security Notes

1. **Never commit real credentials to Git**
2. **All `.env` files are gitignored and should stay local only**
3. **Use AWS Secrets Manager for production credentials**
4. **Keep the `PROTECTED/` directory local only**

## Environment Files Setup

### Backend Configuration

#### Development/Local
Create `backend/.env.production` from `backend/.env.production.example`:

```bash
cp backend/.env.production.example backend/.env.production
```

Then fill in your actual values:
- `SECRET_KEY`: Generate with `python -c "import secrets; print(secrets.token_hex(32))"`
- `DB_SECRET_NAME`: Your AWS Secrets Manager secret name
- `DB_SECRET_REGION`: Your AWS region (e.g., us-east-1)
- `SENDGRID_SECRET_NAME`: Your SendGrid secret in AWS Secrets Manager
- Update email addresses and domain names

### Frontend Configuration

#### Production
Create `frontend/.env.production` from `frontend/.env.production.example`:

```bash
cp frontend/.env.production.example frontend/.env.production
```

Fill in:
- `REACT_APP_ENCRYPTION_KEY`: Your encryption key
- `REACT_APP_RECAPTCHA_SITE_KEY`: Your reCAPTCHA site key
- `REACT_APP_API_URL`: Your API endpoint (e.g., https://api.yourdomain.com)

#### Development
Create `frontend/.env.development` from `frontend/.env.development.example`:

```bash
cp frontend/.env.development.example frontend/.env.development
```

## AWS Secrets Manager Setup

### Database Secret
Create a secret named `prod/deepcoral/database` with:

```json
{
  "username": "postgres",
  "password": "your-db-password",
  "host": "your-rds-endpoint.region.rds.amazonaws.com",
  "port": 5432,
  "dbname": "deep_coral_ai",
  "engine": "postgres"
}
```

### SendGrid Secret
Create a secret named `prod/deepcoral/sendgrid` with:

```json
{
  "api_key": "SG.your-sendgrid-api-key"
}
```

### AWS CLI Commands

```bash
# Create database secret
aws secretsmanager create-secret \
  --name prod/deepcoral/database \
  --description "DeepCoral RDS PostgreSQL credentials" \
  --secret-string '{"username":"postgres","password":"YOUR_PASSWORD","host":"YOUR_RDS_ENDPOINT","port":5432,"dbname":"deep_coral_ai","engine":"postgres"}' \
  --region us-east-1

# Create SendGrid secret
aws secretsmanager create-secret \
  --name prod/deepcoral/sendgrid \
  --description "DeepCoral SendGrid API Key" \
  --secret-string '{"api_key":"YOUR_SENDGRID_API_KEY"}' \
  --region us-east-1
```

## Files Excluded from Git

The following are automatically ignored (see `.gitignore`):

### Environment Files
- `backend/.env*`
- `frontend/.env*` (except `.example` files)

### Sensitive Directories
- `PROTECTED/` - Database dumps, keys, credentials
- `backend/coral_uploads/`
- `backend/profile_uploads/`
- `backend/shared_uploads/`

### SSH Keys & Credentials
- `*.pem`
- `*.key`
- `*.ppk`
- `id_rsa`, `id_ed25519`, etc.

### Database Files
- `*.sql` (except `backend/init_db.sql`)
- `*.dump`

## Server Deployment

When deploying to a new server:

1. Clone the repository
2. Copy your `.env.production` file to the server (via SCP or secure method)
3. Ensure AWS CLI is configured with appropriate IAM credentials
4. Verify Secrets Manager access
5. Never store credentials in the repository

## Checking for Exposed Secrets

Before committing, verify no secrets are tracked:

```bash
# Check what's staged
git status

# Verify gitignore is working
git check-ignore -v backend/.env.production
git check-ignore -v PROTECTED/

# Search for potential secrets in tracked files
git ls-files | xargs grep -i "password\|secret\|key" 2>/dev/null
```

## Emergency: Leaked Credentials

If credentials were accidentally committed:

1. **Immediately rotate all exposed credentials** (change passwords, regenerate keys)
2. Remove from Git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch PATH_TO_FILE" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push: `git push origin --force --all`
4. Notify team members to re-clone the repository

## Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Use AWS Secrets Manager for production
- Keep `.example` files updated with structure
- Use strong, randomly generated keys
- Rotate credentials regularly

❌ **DON'T:**
- Commit `.env` files with real values
- Store credentials in code comments
- Share credentials via chat/email
- Use the same keys for dev and production
- Commit database dumps or backups
