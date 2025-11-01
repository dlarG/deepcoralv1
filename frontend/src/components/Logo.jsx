import React from "react";
import { logoConfig } from "../config/logoConfig";
import "../styles/logo.css";

/**
 * Reusable Logo Component
 * @param {string} variant - Logo variant: 'navbar', 'auth', 'dashboard', 'small', 'icon', 'footer'
 * @param {string} type - Logo type: 'image' or 'text'
 * @param {string} theme - Theme: 'light' or 'dark' (for choosing appropriate logo)
 * @param {string} className - Additional CSS classes
 */
const Logo = ({ 
  variant = "navbar", 
  type = "image", 
  theme = "dark", 
  className = "" 
}) => {
  if (type === "text") {
    return (
      <h1 
        className={`deepcoral-logo ${className}`}
        style={{
          fontFamily: logoConfig.textLogo.fontFamily,
          fontSize: logoConfig.textLogo.fontSize,
        }}
      >
        {logoConfig.textLogo.text}
      </h1>
    );
  }

  // Image logo
  let logoSrc;
  if (variant === "auth") {
    logoSrc = logoConfig.authLogoPath;
  } else if (variant === "footer") {
    logoSrc = logoConfig.footerLogoPath;
  } else {
    logoSrc = theme === "light" ? logoConfig.lightLogoPath : logoConfig.logoPath;
  }
  
  const cssClass = {
    navbar: "navbar-logo",
    auth: "auth-logo", 
    dashboard: "dashboard-logo",
    small: "logo-small",
    icon: "logo-icon",
    footer: "footer-logo"
  }[variant] || "navbar-logo";

  return (
    <img 
      src={logoSrc}
      alt={logoConfig.altText}
      className={`${cssClass} ${className}`}
    />
  );
};

export default Logo;
