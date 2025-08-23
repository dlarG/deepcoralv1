// Logo Configuration
// Edit this file to change logo settings across all components

export const logoConfig = {
  // Main logo image path
  logoPath: "img/logos/LogoSideTextW.png",
  
  // Alternative logo for dark backgrounds
  darkLogoPath: "img/logos/LogoSideTextW.png",
  
  // Alternative logo for light backgrounds (if you have one)
  lightLogoPath: "img/logos/LogoSideTextB.png",
  
  // Special logo for auth pages (login/register)
  authLogoPath: "img/logos/DeepCoralLogo.png",
  
  // Footer logo for homepage footer
  footerLogoPath: "img/logos/DeepCoralWhite.png",
  
  // Text-based logo settings
  textLogo: {
    text: "DeepCorals",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontSize: "1.9rem",
    gradientColors: ["rgb(45, 146, 255)", "#00d4ff"]
  },
  
  // Size presets for different use cases
  sizes: {
    navbar: "180px",      // Homepage navbar
    auth: "120px",        // Login/Register pages
    dashboard: "140px",   // Dashboard sidebar
    small: "100px",       // General small usage
    icon: "40px"          // Icon-only size
  },
  
  // Alt text for accessibility
  altText: "DeepCoral Logo"
};
