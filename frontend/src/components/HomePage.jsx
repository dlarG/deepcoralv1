import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  FiLogIn,
  FiUserPlus,
  FiCamera,
  FiBarChart2,
  FiChevronDown,
  FiPlay,
  FiArrowRight,
  FiStar,
  FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiMap,
  FiMenu,
  FiX,
  FiSend,
} from "react-icons/fi";
import Logo from "./Logo";
import VideoModal from "./VideoModal";

function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    document.title = "DeepCoral - AI-Powered Marine Conservation";

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDemoClick = () => setIsVideoModalOpen(true);
  const handleCloseVideoModal = () => setIsVideoModalOpen(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const services = [
    {
      icon: <FiCamera className="w-6 h-6" />,
      title: "AI Image Analysis",
      description:
        "Advanced deep learning algorithms analyze coral reef images with 99.5% accuracy.",
      features: ["Real-time Processing", "Auto Cropping", "Batch Analysis"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FiMap className="w-6 h-6" />,
      title: "GIS Integration",
      description:
        "Seamlessly integrate analyzed data with GIS platforms for comprehensive marine insights.",
      features: ["Trend Analysis", "Data Visualization", "Export Options"],
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "Dynamic Reporting",
      description:
        "Generate beautiful, interactive reports to share insights with your research team.",
      features: ["Custom Reports", "Interactive Charts", "Multi-format Export"],
      color: "from-amber-500 to-orange-500",
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with parallax effect */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1920")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-900/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-emerald-900/20" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/90 backdrop-blur-lg py-4 shadow-xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/img/logos/logonobg.png"
                alt="DeepCoral logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                DeepCoral
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {["home", "services", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-gray-300 hover:text-white transition-colors capitalize font-medium"
                >
                  {item}
                </button>
              ))}
              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center space-x-2"
              >
                <FiUserPlus className="w-5 h-5" />
                <span>Get Started</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-6 bg-gray-900/95 backdrop-blur-lg rounded-xl p-6 space-y-4"
            >
              {["home", "services", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left text-gray-300 hover:text-white py-3 capitalize"
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white py-3"
                >
                  <FiLogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-20"
      >
        <div className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {["AI Technology", "GIS Technology", "Web Development"].map(
                (tech, idx) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center space-x-2"
                  >
                    <FiStar className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white">
                      {tech}
                    </span>
                  </motion.div>
                )
              )}
            </div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="block text-white">Preserving Our Reefs</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                One Pixel at a Time
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              AI-powered coral cover estimation platform designed for marine
              biologists, researchers, and ocean conservation enthusiasts.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <span className="font-semibold">Get Started</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button
                onClick={handleDemoClick}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <FiPlay className="w-5 h-5" />
                <span className="font-semibold">Watch Demo</span>
              </button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <button
                onClick={() => scrollToSection("services")}
                className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-sm mb-2">Discover Our Services</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <FiChevronDown className="w-6 h-6" />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <FiGlobe className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Our Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Tools for{" "}
              <span className="text-cyan-400">Marine Research</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Advanced AI-powered solutions designed specifically for coral reef
              monitoring and conservation
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-6">{service.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center space-x-3 text-gray-300"
                    >
                      <FiCheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                  <span className="font-semibold">Learn More</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950" />
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <FiMail className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Contact Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get in <span className="text-cyan-400">Touch</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions or want to collaborate? Reach out to our team
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      Location
                    </h4>
                    <p className="text-gray-300">
                      Southern Leyte State University
                    </p>
                    <p className="text-gray-300">GIS Technology Center</p>
                    <p className="text-gray-300">
                      Sogod, Southern Leyte, Philippines
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Email</h4>
                    <p className="text-gray-300">support@deepcoral.site</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Phone</h4>
                    <p className="text-gray-300">+63 9700 684 932</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-white mb-4">
                  Research Hours
                </h4>
                <p className="text-gray-300 mb-2">
                  Monday - Friday: 9:00 AM - 5:00 PM (PHT/GMT+8)
                </p>
                <p className="text-gray-300 text-sm mb-2">
                  Philippine Standard Time
                </p>
                <p className="text-gray-300">
                  Weekend consultations available by appointment
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Message</label>
                  <textarea
                    rows="6"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center space-x-3 group"
                >
                  <span className="font-semibold">Send Message</span>
                  <FiSend className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/img/logos/logonobg.png"
                  alt="DeepCoral logo"
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  DeepCoral
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Advancing marine conservation through artificial intelligence
                and innovative research.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Project</h4>
              <ul className="space-y-3">
                {[
                  "BrAInstormers Team",
                  "Capstone Project 2025",
                  "Advanced AI Research",
                  "Marine Conservation",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Institution */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Institution</h4>
              <ul className="space-y-3">
                {[
                  "Southern Leyte State University",
                  "SLSU GIS Technology Center",
                  "Marine Research Division",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technology */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Technology</h4>
              <ul className="space-y-3">
                {[
                  "Deep Learning Models",
                  "Computer Vision",
                  "Data Analytics",
                  "GIS Integration",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex justify-center items-center">
              <p className="text-gray-400">
                © 2026 BrAInstormers. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        videoSrc="/demo/demo.mp4"
        title="DeepCoral AI Demo"
      />
    </div>
  );
}

export default HomePage;
