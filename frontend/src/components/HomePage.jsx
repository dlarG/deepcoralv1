import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiLogIn,
  FiUserPlus,
  // FiCamera,
  // FiDatabase,
  // FiBarChart2,
  FiChevronDown,
  FiPlay,
  FiArrowRight,
  FiStar,
  // FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  // FiCheckCircle,
  // FiHeart,
  // FiLinkedin,
  FiGithub,
  // FiTwitter,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Logo from "./Logo";
import "../styles/homepage.css";

function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "DeepCoral - AI-Powered Marine Conservation";

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = ["home", "services", "about", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMobileMenuOpen(false);
  };

  // const services = [
  //   {
  //     icon: <FiCamera />,
  //     title: "AI Image Analysis",
  //     description:
  //       "Advanced deep learning algorithms analyze coral reef images with 99.5% accuracy, providing instant coral coverage estimates.",
  //     features: ["Real-time Processing", "Auto Cropping", "Batch Analysis"],
  //     gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  //   },
  //   {
  //     icon: <FiDatabase />,
  //     title: "Smart Data Management",
  //     description:
  //       "Intelligent database system that tracks reef health changes over time and identifies critical trends automatically.",
  //     features: ["Trend Analysis", "Data Visualization", "Export Options"],
  //     gradient: "linear-gradient(135deg, #10b981, #059669)",
  //   },
  //   {
  //     icon: <FiBarChart2 />,
  //     title: "Dynamic Reporting",
  //     description:
  //       "Generate beautiful, interactive reports and visualizations to share insights with your research team and stakeholders.",
  //     features: ["Custom Reports", "Interactive Charts", "Multi-format Export"],
  //     gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
  //   },
  // ];

  return (
    <div className="landing-container">
      {/* Background */}
      <div className="background-overlay">
        <div className="background-image"></div>
        <div className="gradient-overlay"></div>
        <div className="particle-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-content">
          <div className="navbar-brand">
            <Logo variant="navbar" type="image" theme="dark" />
          </div>

          <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <a
              href="#home"
              className={`nav-link ${activeSection === "home" ? "active" : ""}`}
              onClick={() => scrollToSection("home")}
            >
              Home
            </a>
            <a
              href="#services"
              className={`nav-link ${
                activeSection === "services" ? "active" : ""
              }`}
              onClick={() => scrollToSection("services")}
            >
              Services
            </a>
            <a
              href="#about"
              className={`nav-link ${
                activeSection === "about" ? "active" : ""
              }`}
              onClick={() => scrollToSection("about")}
            >
              About
            </a>
            <a
              href="#contact"
              className={`nav-link ${
                activeSection === "contact" ? "active" : ""
              }`}
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </a>
            <Link to="/login" className="nav-link login">
              <FiLogIn className="link-icon" />
              <span>Login</span>
            </Link>
            <Link to="/register" className="nav-link register">
              <FiUserPlus className="link-icon" />
              <span>Get Started</span>
            </Link>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <FiStar className="badge-icon" />
            <span>AI Technology</span>
          </div>
          <div className="hero-badge">
            <FiStar className="badge-icon" />
            <span>GIS Technology</span>
          </div>
          <div className="hero-badge">
            <FiStar className="badge-icon" />
            <span>Web Development</span>
          </div>

          <h1 className="hero-title">
            <span className="title-primary">Preserving Our Reefs</span>
            <span className="title-accent">One Pixel at a Time</span>
          </h1>

          <p className="hero-subtitle">
            AI-powered coral cover estimation platform designed for marine
            biologists, researchers, and ocean conservation enthusiasts
          </p>

          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">
              <span>Start Free Trial</span>
              <FiArrowRight className="button-arrow" />
            </Link>
            <button className="cta-button secondary">
              <FiPlay className="button-icon" />
              <span>Watch Demo</span>
            </button>
          </div>

          <div
            className="scroll-indicator"
            onClick={() => scrollToSection("contact")}
          >
            <span>Discover Our Services</span>
            <FiChevronDown className="scroll-icon" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      {/* <section id="services" className="services-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <FiGlobe className="badge-icon" />
              <span>Our Services</span>
            </div>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <div
                    className="service-icon"
                    style={{ background: service.gradient }}
                  >
                    {service.icon}
                  </div>
                  <h3>{service.title}</h3>
                </div>

                <p>{service.description}</p>

                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <FiCheckCircle className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="service-cta">
                  Learn More
                  <FiArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* About Section */}
      {/* <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text">
              <div className="section-badge">
                <FiHeart className="badge-icon" />
                <span>About Us</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <FiMail className="badge-icon" />
              <span>Contact Us</span>
            </div>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">
                  <FiMapPin />
                </div>
                <div className="contact-details">
                  <h4>Location</h4>
                  <p>
                    Southern Leyte State University
                    <br />
                    GIS Technology Center
                    <br />
                    Sogod, Southern Leyte, Philippines
                  </p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FiMail />
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>
                    dasdasdwr@deepcoral.ai
                    <br />
                    asdsdf@deepcoral.ai
                  </p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FiPhone />
                </div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <p>
                    +63 (XX) XXXX-XXXX
                    <br />
                  </p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Subject" required />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Your Message"
                    rows="6"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="form-submit">
                  Send Message
                  <FiArrowRight />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="brand-info">
                <Logo variant="footer" type="image" theme="dark" />
                <p>
                  Advancing marine conservation through artificial intelligence
                  and innovative research.
                </p>
                <div className="social-links">
                  {/* <a href="#" className="social-link">
                    <FiLinkedin />
                  </a> */}
                  <a href="https://github.com/dlarG/" className="social-link">
                    <FiGithub />
                  </a>
                  {/* <a href="#" className="social-link">
                    <FiTwitter />
                  </a> */}
                </div>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Project</h4>
                <p>BrAInstormers Team</p>
                <p>Capstone Project 2025</p>
                <p>Advanced AI Research</p>
                <p>Marine Conservation</p>
              </div>

              <div className="footer-column">
                <h4>Institution</h4>
                <p>Southern Leyte State University</p>
                <p>GIS Technology Center</p>
                <p>Marine Research Division</p>
                <p>Environmental Studies</p>
              </div>

              <div className="footer-column">
                <h4>Technology</h4>
                <p>Deep Learning Models</p>
                <p>Computer Vision</p>
                <p>Cloud Computing</p>
                <p>Data Analytics</p>
              </div>

              <div className="footer-column">
                <h4>Resources</h4>
                <p>Documentation</p>
                <p>API Reference</p>
                <p>Research Papers</p>
                <p>Support Center</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="copyright-section">
              <p className="copyright">
                © 2025 BrAInstormers. All rights reserved.
              </p>
              <p className="made-with">
                Made with <span className="heart">💙</span> for our oceans
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
