# PROTECTED Directory

This directory contains sensitive files that are excluded from version control.

## Files (Not in Git)
- `*.pem` - SSH/AWS private keys
- `*.sql` - Database dumps and backups
- `*.dump` - PostgreSQL database dumps
- `*.sh` - Deployment and setup scripts with credentials

## Security Note
**Never commit files from this directory to Git!**

All files in this directory are automatically ignored by `.gitignore`.
