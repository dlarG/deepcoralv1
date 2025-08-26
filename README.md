# DeepCoral - AI-Powered Coral Detection System

A comprehensive web application for coral reef analysis using AI and machine learning.

## 🚀 Features

- **AI-Powered Coral Detection**: Automated coral identification using YOLO models
- **User Management**: Multi-role system (Admin, Biologist, Guest)
- **Image Processing**: Smart cropping and coral analysis
- **Dashboard Analytics**: Comprehensive coral data visualization
- **RESTful API**: Full backend API for coral data management

## 🛠️ Technology Stack

### Backend
- **Flask** - Python web framework
- **PostgreSQL** - Database
- **OpenCV** - Image processing
- **Ultralytics YOLO** - AI model for coral detection
- **Docker** - Containerization

### Frontend
- **React** - User interface
- **Tailwind CSS** - Styling
- **Axios** - API communication
- **Nginx** - Web server and proxy

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js (for development)
- Python 3.11+ (for development)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd deepcoralv1
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment template
   cp backend/.env.example backend/.env.docker
   # Edit backend/.env.docker with your settings
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Manual Setup (Development)

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-base.txt
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📊 Database Setup

1. **Create PostgreSQL database**
2. **Run database migrations**
   ```bash
   docker-compose exec db psql -U postgres -d deep_coral_ai -f /docker-entrypoint-initdb.d/01-init.sql
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env.docker)
```bash
DB_HOST=db
DB_PORT=5432
DB_NAME=deep_coral_ai
DB_USER=postgres
DB_PASSWORD=postgres
SECRET_KEY=your-secret-key
RECAPTCHA_SECRET=your-recaptcha-secret
```

### Docker Services

- **backend**: Flask API server (Port 5000)
- **frontend**: React app with Nginx (Port 3000)  
- **db**: PostgreSQL database (Port 5432)

## 🎯 API Endpoints

### Authentication
- `GET /csrf-token` - Get CSRF token
- `POST /login` - User login
- `POST /register` - User registration
- `GET /check-auth` - Check authentication status

### Coral Management
- `GET /coral/information` - Get coral data
- `POST /image/detect_custom` - AI coral detection
- `POST /image/upload` - Upload coral images

### Admin
- `GET /admin/users` - Manage users
- `GET /admin/activities` - View activities

## 🚧 Current Status

### ✅ Working Features
- Docker containerization
- User authentication system
- Database integration
- Frontend-backend communication
- Basic coral data management

### 🔄 In Progress
- AI model integration (OpenCV/YOLO)
- Image processing features
- Advanced dashboard analytics

### 📝 Known Issues
- OpenCV requires headless version in Docker
- ML features temporarily disabled for Docker compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

NOt yet

## 👥 Team

- Denissa Doron - Project Lead
- Rinvee Betonio - Documenter
- Gerald Catina - Lead Developer
- Jefferson Itaok - System Analyst
- Jonas Arcken Salac - QA/Tester

## 📞 Support

For support, email [jeffersonitaok11@gmail.com] or create an issue in this repository.