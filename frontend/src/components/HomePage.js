import React from "react";
import { Link } from "react-router-dom";
import {
  FiLogIn,
  FiUserPlus,
  FiCamera,
  FiDatabase,
  FiBarChart2,
} from "react-icons/fi";

function HomePage() {
  return (
    <div className="homepage-container">
      {/* Background with overlay */}
      <div className="background-overlay">
        <div className="background-image"></div>
        <div className="overlay"></div>
      </div>

      {/* Main content */}
      <div className="content-wrapper">
        {/* Navigation */}
        <nav className="navbar">
          <div className="navbar-brand">
            <span className="logo-icon">
              <img src="/icon.png" alt="icon" class="logo" />
            </span>
            <h1 className="deepcoral-logo">DeepCoral</h1>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">
              <FiLogIn className="link-icon" />
              <span>Login</span>
            </Link>
            <Link to="/register" className="nav-link">
              <FiUserPlus className="link-icon" />
              <span>Register</span>
            </Link>
          </div>
        </nav>

        {/* Hero section */}
        <main className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Preserving Our Reefs,
              <br />
              One Pixel at a Time
            </h1>
            <p className="hero-subtitle">
              AI-powered coral cover estimation for marine biologists and ocean
              lovers
            </p>

            <div className="cta-buttons">
              <Link to="/register" className="cta-button primary">
                Get Started
              </Link>
              <Link to="/login" className="cta-button secondary">
                Sign In
              </Link>
            </div>
          </div>
        </main>

        {/* Features section */}
        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <FiCamera />
            </div>
            <h3>Image Analysis</h3>
            <p>Upload reef images and get instant coral coverage estimates</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiDatabase />
            </div>
            <h3>Data Tracking</h3>
            <p>Monitor reef health over time with our powerful database</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiBarChart2 />
            </div>
            <h3>Visual Reports</h3>
            <p>Generate beautiful reports to share with your team</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>
            Made with <span className="heart">💙</span> by the DeepCoral Team |
            Capstone Project 2025
          </p>
        </footer>
      </div>
    </div>
  );
}

// CSS Styles
const styles = `
  .homepage-container {
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .logo {
    width: 40px;
    height: 40px;
  }
  .deepcoral-logo {
    font-family: 'Georgia', 'Times New Roman', serif; /* or a fancy serif */
    font-size: 1.9rem;
    font-weight: bold;
    background: linear-gradient(to right,rgb(45, 146, 255), #00d4ff); /* deep blue to cyan */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    margin: 0;
    padding: 0;
  }

  .background-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/img/coralbg.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 96, 100, 0.85) 0%, rgba(0, 77, 64, 0.85) 100%);
  }

  .content-wrapper {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Navigation */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: rgba(0, 96, 100, 0.9);
    backdrop-filter: blur(5px);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .logo-icon {
    font-size: 1.8rem;
  }

  .nav-links {
    display: flex;
    gap: 20px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 20px;
    transition: all 0.3s ease;
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .link-icon {
    font-size: 1.1rem;
  }

  /* Hero section */
  .hero-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    color: white;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 2.8rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 20px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .hero-subtitle {
    font-size: 1.3rem;
    font-weight: 300;
    margin-bottom: 40px;
    opacity: 0.9;
  }

  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
  }

  .cta-button {
    padding: 12px 30px;
    border-radius: 30px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
  }

  .cta-button.primary {
    background: #26c6da;
    color: white;
    box-shadow: 0 4px 15px rgba(38, 198, 218, 0.3);
  }

  .cta-button.primary:hover {
    background: #00acc1;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(38, 198, 218, 0.4);
  }

  .cta-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
  }

  .cta-button.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  /* Features section */
  .features-section {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
    padding: 60px 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
  }

  .feature-card {
    flex: 1;
    min-width: 250px;
    max-width: 300px;
    background: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-10px);
  }

  .feature-icon {
    font-size: 2.5rem;
    color: #26c6da;
    margin-bottom: 20px;
  }

  .feature-card h3 {
    color: #00796b;
    margin-bottom: 15px;
    font-size: 1.3rem;
  }

  .feature-card p {
    color: #555;
    line-height: 1.5;
  }

  /* Footer */
  .footer {
    padding: 20px;
    background: rgba(0, 77, 64, 0.9);
    color: white;
    text-align: center;
    font-size: 0.9rem;
  }

  .heart {
    color: #26c6da;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .navbar {
      padding: 15px 20px;
    }

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .cta-buttons {
      flex-direction: column;
      gap: 15px;
    }

    .cta-button {
      width: 100%;
      max-width: 250px;
      margin: 0 auto;
    }

    .features-section {
      flex-direction: column;
      align-items: center;
    }

    .feature-card {
      width: 100%;
      max-width: 350px;
    }
  }

  @media (max-width: 480px) {
    .navbar-brand h1 {
      font-size: 1.3rem;
    }

    .nav-links {
      gap: 10px;
    }

    .nav-link span {
      display: none;
    }

    .hero-title {
      font-size: 1.8rem;
    }
  }
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default HomePage;
