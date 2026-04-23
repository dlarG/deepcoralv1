# DeepCoral: AI-Based System for Automated Estimation of Live Coral Cover Percentage in Reef Ecosystems

**Capstone Project by Team BrAInstormers**

A comprehensive web application for monitoring, mapping, and analyzing coral reef health using AI-powered image segmentation and biological data tracking.

**Live Application:** https://deepcoral.site

---

## Team Members

**Team Name:** BrAInstormers

- **Denissa T. Doron**
- **Gerald Catina**
- **Jefferson S. Itaok**
- **Rinvee E. Betonio**
- **Jonas Arcken M. Salac**

**Adviser:**
- **Jannie Fleur V. Oraño, MCS**

**Institution:** Southern Leyte State University (SLSU)  
**Program:** Bachelor of Science in Information Technology  
**Year:** 2026

---

## Project Overview

DeepCoral is a specialized platform designed for marine biologists and environmental organizations to:

- **Monitor Coral Health**: Upload and analyze coral reef images using AI-powered segmentation
- **Track Coral Lifeforms**: Classify and catalog coral species and health status
- **Manage Location Data**: Create transects and geographical mapping of monitoring locations
- **Collaborative Analysis**: Share findings and collaborate through user roles (Guest, Biologist, Admin)
- **Generate Insights**: Analyze trends and generate reports on coral reef status

### Technology Stack

**Frontend:**
- React 19.1.0 with TypeScript
- Vite bundler
- Tailwind CSS for styling
- Leaflet/Mapbox for geographical mapping
- SendGrid for email notifications
- reCAPTCHA v2 for security

**Backend:**
- Python 3.9+ with Flask
- PostgreSQL with PostGIS extension
- Supabase for managed database hosting
- AWS EC2 for server infrastructure
- Docker for containerization

**ML Models:**
- YOLOv11 for coral object detection
- UNet for coral segmentation
- Custom-trained on labeled coral reef datasets

## Prerequisites

- Node.js 16+ and npm
- Python 3.9+ and pip
- Git
- Docker and Docker Compose (optional, for containerized deployment)
- PostgreSQL 12+ with PostGIS extension (local development)

## Installation

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dlarG/deepcoralv1.git
   cd deepcoralv1/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database:**
   ```bash
   python -c "from app import db; db.create_all()"
   # Or run migrations if using Alembic
   ```

6. **Start the Flask server:**
   ```bash
   python app.py
   ```
   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API endpoint and API keys
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## Environment Configuration

### Backend (.env.example)

Required environment variables for backend operation:

```
# Database
DATABASE_URL=postgresql://user:password@host:5432/deepcoral_db

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DEBUG=False

# Email Service (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@deepcoral.site

# Security
RECAPTCHA_SECRET=your-recaptcha-secret-key
RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# AWS (optional, for S3 file storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=ap-southeast-2

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://deepcoral.site
```

### Frontend (.env.example)

Required environment variables for frontend operation:

```
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=30000

# reCAPTCHA
REACT_APP_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Environment
REACT_APP_ENV=development
```

## User Roles

### Guest User
- Browse published coral monitoring data
- View interactive maps of monitoring locations
- Export data for analysis
- Limited to publicly shared datasets

### Biologist
- Full data upload and analysis capabilities
- Create and manage monitoring transects
- Generate segmentation analysis on coral images
- Manage his/her own coral data
- Collaborate with team members

### Admin
- Manage user accounts and roles
- Review and approve new registrations
- Manage coral lifeform taxonomy
- System configuration and monitoring
- Database backup and recovery

## Core Features

### Image Upload & Analysis
- Batch upload coral reef images
- Automatic image segmentation using trained UNet model
- Object detection with YOLOv11
- Extract coral coverage percentage and health metrics

### Location Management
- Create monitoring locations with GPS coordinates
- Define transects within locations
- Track monitoring history and changes over time

### Data Visualization
- Interactive maps with Leaflet
- Time-series analysis of coral health metrics
- Comparative analysis across locations
- Interactive charts and graphs

### Collaboration Features
- User roles and permissions
- Share analysis results with team members
- Comment and annotation system
- Activity logging and audit trail

## Running the Application

### Local Development

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

### Docker Deployment

Build and run with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- Frontend on port 3000
- Backend on port 5000
- PostgreSQL on port 5432 (if using local database)

## Deployment

### Production Deployment

**Frontend:** Deployed to Vercel with automatic CI/CD from `production` branch
```bash
git push origin production
```

**Backend:** Deployed to AWS EC2
```bash
# Connect to EC2 instance
ssh -i aws-ec2.pem ec2-user@52.62.53.38

# Pull latest code
cd /opt/deepcoral
git pull origin production
docker-compose up -d --build
```

### Database

PostgreSQL instance managed on Supabase:
- Host: aws-1-ap-southeast-2.pooler.supabase.com
- Database: deepcoral_db
- Connection handled via DATABASE_URL environment variable

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh authentication token

### Coral Analysis Endpoints
- `POST /api/coral/upload` - Upload and analyze coral images
- `GET /api/coral/instances` - List coral instances
- `GET /api/coral/instances/{id}` - Get coral instance details
- `DELETE /api/coral/instances/{id}` - Delete coral instance

### Location Endpoints
- `GET /api/locations` - List all locations
- `POST /api/locations` - Create new location
- `GET /api/locations/{id}` - Get location details
- `PUT /api/locations/{id}` - Update location
- `DELETE /api/locations/{id}` - Delete location

### User Profile Endpoints
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete account and all associated data

For detailed API documentation, run:
```bash
cd backend
python -m flask shell  # Or access Swagger UI at /api/docs
```

## Database Schema

Main tables:
- `users` - User accounts with roles (guest, biologist, admin)
- `coral_instances` - Individual coral monitoring records
- `locations` - Monitoring location metadata
- `segmentation_results` - ML segmentation output for coral images
- `images` - Uploaded image records
- `coral_lifeforms` - Coral species taxonomy

PostGIS Extensions:
- `geometry` columns for GPS coordinates
- Spatial indexing for location-based queries

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 5000 or 5173
lsof -ti:5000 | xargs kill -9  # Unix/Mac
netstat -ano | findstr :5000   # Windows
```

### Database Connection Error
- Verify DATABASE_URL in .env is correct
- Check PostgreSQL server is running
- Confirm network access to database host
- Review error logs: `tail -f logs/app.log`

### Image Upload Fails
- Verify CORS settings allow frontend origin
- Check file size limits (default: 50MB)
- Ensure S3 credentials are correct (if using AWS)
- Check disk space on server

### reCAPTCHA Validation Error
- Verify RECAPTCHA_SECRET matches site key
- Check reCAPTCHA v2 is enabled in Google Cloud
- Ensure request origin is whitelisted

## Development Workflow

### Creating a New Feature

1. Create feature branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally

3. Commit with clear messages:
   ```bash
   git add .
   git commit -m "Feature: Add new feature description"
   ```

4. Push and create Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

5. After code review, merge to `main`, then to `production`

### Code Standards

**Python:**
- PEP 8 style guide
- Use type hints for function parameters
- Document complex functions with docstrings
- Test coverage minimum 80%

**JavaScript/React:**
- Use ES6+ syntax
- Component naming: PascalCase for components, camelCase for functions
- Prop validation with PropTypes
- Keep components under 300 lines

### Git Workflow

```
main (stable, always deployable)
  ↑
  ├─ production (current live version)
  └─ feature/* (feature branches)
```

## Security Considerations

1. **Secrets Management**
   - Never commit .env files with secrets
   - Use environment variables for sensitive data
   - Rotate API keys regularly
   - Store SSH keys in secure location (not in repo)

2. **Authentication**
   - Passwords hashed with bcrypt
   - CSRF tokens on all state-changing operations
   - reCAPTCHA validation on registration
   - Session-based authentication

3. **Data Protection**
   - HTTPS/TLS encryption in transit
   - Database-level access controls
   - User data isolation by role
   - Audit logging of sensitive operations

4. **File Security**
   - Uploaded files stored outside web root
   - File type validation (whitelist approach)
   - Access controls on file downloads
   - Regular security scanning

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

Please ensure:
- Code follows project standards
- Tests pass: `npm test` (frontend) and `pytest` (backend)
- No hardcoded secrets or sensitive data
- Clear commit messages and PR descriptions

## License

This project is licensed under the **DeepCoral Custom Non-Commercial Academic License v1.0** - see [LICENSE](LICENSE) file for details.

Commercial use is not allowed without prior written permission from Team BrAInstormers.

## Intellectual Property Notice

The Utility Model (UM) application related to the system features and methods has been filed with IPOPHL and is currently **pending examination/approval**.


## Contact & Support

For issues, questions, or contributions:

**Contact Us:**
- Email: support@deepcoral.site
- GitHub Issues: https://github.com/AnonJeffz/DeepCoral/issues


> **Note:** If deepcoral.site domain expires, you can reach the development team via the GitHub repository issues page.

## About This Project

This application was developed as a capstone project at Southern Leyte State University (SLSU) to provide marine biologists, researchers, and environmental organizations with an automated tool for coral reef ecosystem monitoring and analysis. The system leverages artificial intelligence and geospatial technology to provide accurate, real-time insights into coral cover percentage and ecosystem health.

### Use Cases

- **For Researchers & Biologists:** Streamlined workflow for coral reef monitoring and data analysis
- **For Educational Institutions:** Teaching platform for marine biology, GIS, and AI applications
- **For Environmental Organizations:** Cost-effective monitoring solution for conservation efforts
- **For Students:** Learning platform demonstrating practical AI, web development, and database design

## Acknowledgments

- Marine biology research community for expertise and guidance
- Open-source ML community (YOLO, UNet, Framer Motion implementations)
- AWS, Supabase, and Vercel for providing robust infrastructure
- Southern Leyte State University for research facilities and support
