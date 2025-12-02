# Quick Setup Guide

## For New Team Members or New Servers

### 1. Clone the Repository
```bash
git clone https://github.com/dlarG/deepcoralv1.git
cd deepcoralv1
```

### 2. Set Up Backend Environment
```bash
cd backend
cp .env.production.example .env.production
```

Edit `.env.production` with your actual credentials. **Never commit this file!**

### 3. Set Up Frontend Environment
```bash
cd ../frontend
cp .env.production.example .env.production
cp .env.development.example .env.development
```

Edit both files with your actual keys. **Never commit these files!**

### 4. Create PROTECTED Directory (Optional)
```bash
cd ..
mkdir -p PROTECTED
```

Place your database dumps, SSH keys, and other sensitive files here. **Never commit these files!**

## What's Safe to Commit?

✅ **Safe to commit:**
- `*.example` files
- Code files (unless they contain hardcoded secrets)
- Configuration templates
- Documentation
- `SECURITY.md`
- `.gitignore`

❌ **Never commit:**
- `.env` files (except `.example`)
- Files in `PROTECTED/` directory
- `*.pem`, `*.key` files
- `*.sql`, `*.dump` files (database backups)
- SSH keys
- Any file with real passwords, API keys, or tokens

## Verification

Check that your sensitive files are ignored:
```bash
git check-ignore backend/.env.production
git check-ignore PROTECTED/deepCoralDB.sql
git check-ignore frontend/.env.production
```

All should return the path if properly ignored.

## More Details

See `SECURITY.md` for comprehensive security guidelines.
