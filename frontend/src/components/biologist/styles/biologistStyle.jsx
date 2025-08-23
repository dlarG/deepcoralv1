// src/components/biologist/styles/biologistStyle.js
const getBiologistStyle = (sidebarOpen, darkMode = false) => `
/* Biologist Dashboard Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.biologist-dashboard {
  min-height: 100vh;
  background: ${darkMode ? "#0f172a" : "#f8fafc"};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  transition: all 0.3s ease;
}
.logo-container img {
  background: ${
    darkMode
      ? "url('img/logos/LogoSideTextB.png')"
      : "url('img/logos/LogoSideTextW.png')"
  };
}
.biologist-dashboard.dark-mode {
  background: #0f172a;
  color: #e2e8f0;
}

/* Loading Screen */
.biologist-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%);
  color: white;
}

.loading-spinner-bio {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top: 6px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Top Navigation */
.bio-top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: ${darkMode ? "#1e293b" : "white"};
  border-bottom: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.08"});
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.sidebar-toggle {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: ${darkMode ? "#334155" : "#f1f5f9"};
  color: ${darkMode ? "#e2e8f0" : "#475569"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: ${darkMode ? "#475569" : "#e2e8f0"};
  transform: scale(1.05);
}

.nav-brand h1 {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 1rem;
}

.nav-center {
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  z-index: 2;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 1rem 0 3rem;
  border: 2px solid ${darkMode ? "#334155" : "#e2e8f0"};
  border-radius: 22px;
  background: ${darkMode ? "#0f172a" : "white"};
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

.search-input::placeholder {
  color: ${darkMode ? "#64748b" : "#94a3b8"};
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-action-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: ${darkMode ? "#334155" : "#f1f5f9"};
  color: ${darkMode ? "#e2e8f0" : "#475569"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.nav-action-btn:hover {
  background: ${darkMode ? "#475569" : "#e2e8f0"};
  transform: scale(1.05);
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${darkMode ? "#1e293b" : "white"};
}

.notification-container,
.profile-container {
  position: relative;
}

.notification-dropdown,
.profile-dropdown {
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  width: 350px;
  background: ${darkMode ? "#1e293b" : "white"};
  border: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, ${darkMode ? "0.4" : "0.15"});
  z-index: 100;
  animation: dropdownSlide 0.3s ease;
  backdrop-filter: blur(10px);
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 1.5rem;
  border-bottom: 1px solid ${darkMode ? "#334155" : "#f1f5f9"};
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
}

.mark-all-read {
  color: #0ea5e9;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${darkMode ? "#334155" : "#f8fafc"};
  transition: all 0.2s ease;
}

.notification-item:hover {
  background: ${darkMode ? "#334155" : "#f8fafc"};
}

.notification-item.unread {
  background: ${
    darkMode ? "rgba(14, 165, 233, 0.1)" : "rgba(14, 165, 233, 0.05)"
  };
  border-left: 4px solid #0ea5e9;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-icon.discovery {
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
}

.notification-icon.analysis {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.notification-icon.system {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.notification-content h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.notification-content p {
  font-size: 0.8rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
}

.dropdown-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid ${darkMode ? "#334155" : "#f1f5f9"};
}

.view-all-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
  transform: translateY(-1px);
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-trigger:hover {
  background: ${darkMode ? "#334155" : "#f1f5f9"};
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${darkMode ? "#334155" : "#e2e8f0"};
}

.profile-avatar img,
.avatar-initials {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  background: linear-gradient(135deg, #0ea5e9 0%,rgb(16, 157, 185) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.profile-name {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
}

.profile-role {
  font-size: 0.75rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  line-height: 1.2;
}

.dropdown-arrow {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  transition: transform 0.3s ease;
}

.profile-dropdown {
  width: 300px;
}

.profile-summary {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.profile-avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${darkMode ? "#334155" : "#e2e8f0"};
}

.profile-avatar-large img,
.avatar-initials-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials-large {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.profile-details h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.profile-details p {
  font-size: 0.875rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0 0 0.5rem 0;
}

.role-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
}

.dropdown-menu {
  padding: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 10px;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: ${darkMode ? "#334155" : "#f1f5f9"};
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
}

.dropdown-divider {
  height: 1px;
  background: ${darkMode ? "#334155" : "#e2e8f0"};
  margin: 0.5rem 0;
}

/* Sidebar */
.bio-sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  width: ${sidebarOpen ? "280px" : "80px"};
  height: calc(100vh - 70px);
  background: ${darkMode ? "#1e293b" : "white"};
  border-right: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
  transition: all 0.3s ease;
  z-index: 900;
  overflow: hidden;
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
}

.sidebar-header {
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid ${darkMode ? "#334155" : "#f1f5f9"};
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.logo-text h2 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-text span {
  font-size: 0.75rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-weight: 500;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nav-section {
  padding: 0 ${sidebarOpen ? "1.5rem" : "1rem"};
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  opacity: ${sidebarOpen ? "1" : "0"};
  transition: opacity 0.3s ease;
}

.nav-menu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  background: none;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background: ${darkMode ? "#334155" : "#f8fafc"};
  transform: translateX(4px);
}

.nav-link.active {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  color: #0ea5e9;
}

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${darkMode ? "#94a3b8" : "#0ea5e9"};
}

.nav-content {
  flex: 1;
  opacity: ${sidebarOpen ? "1" : "0"};
  transition: opacity 0.3s ease;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  display: block;
  color: ${darkMode ? "#94a3b8" : "#0ea5e9"};
}

.nav-description {
  font-size: 0.75rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  line-height: 1.2;
  margin-top: 0.25rem;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #0ea5e9 0%,rgb(16, 114, 185) 100%);
  border-radius: 0 4px 4px 0;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-action-btn.primary {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.quick-action-btn.success {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

.quick-action-btn.info {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0369a1;
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stats-widget {
  background: ${darkMode ? "#334155" : "#f8fafc"};
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid ${darkMode ? "#475569" : "#e2e8f0"};
}

.stats-header h4 {
  font-size: 0.875rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-item .stat-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  line-height: 1;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid ${darkMode ? "#334155" : "#f1f5f9"};
  margin-top: auto;
}

.footer-content {
  opacity: ${sidebarOpen ? "1" : "0"};
  transition: opacity 0.3s ease;
}

.version-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.version-info span {
  font-size: 0.75rem;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
}

/* Dashboard Container */
.dashboard-container {
  display: flex;
  min-height: calc(100vh - 70px);
  margin-top: 70px;
}

.main-content {
  flex: 1;
  margin-left: ${sidebarOpen ? "280px" : "80px"};
  padding: 2rem;
  transition: all 0.3s ease;
  background: ${darkMode ? "#0f172a" : "#f8fafc"};
}

/* Dashboard Content */
.bio-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 2rem;
  background: ${darkMode ? "#1e293b" : "white"};
  border-radius: 24px;
  border: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
  box-shadow: 0 4px 20px rgba(0, 0, 0, ${darkMode ? "0.2" : "0.08"});
}

.welcome-section h2 {
  font-size: 1.9rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: ${darkMode ? "#e2e8f0" : "rgb(16, 15, 15)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-section p {
  font-size: 1.1rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.action-btn.primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(14, 165, 233, 0.4);
}

.action-btn.secondary {
  background: ${darkMode ? "#334155" : "#f8fafc"};
  color: ${darkMode ? "#e2e8f0" : "#475569"};
  border: 2px solid ${darkMode ? "#475569" : "#e2e8f0"};
}

.action-btn.secondary:hover {
  background: ${darkMode ? "#475569" : "#e2e8f0"};
  transform: translateY(-2px);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: ${darkMode ? "#1e293b" : "white"};
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
  box-shadow: 0 4px 20px rgba(0, 0, 0, ${darkMode ? "0.2" : "0.08"});
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 20px 20px 0 0;
}

.stat-card.primary::before {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

.stat-card.success::before {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-card.info::before {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

.stat-card.warning::before {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.12"});
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-card.info .stat-icon {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-content h3 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
}

.stat-content p {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.stat-change.positive {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.dashboard-card {
  background: ${darkMode ? "#1e293b" : "white"};
  border-radius: 20px;
  border: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
  box-shadow: 0 4px 20px rgba(0, 0, 0, ${darkMode ? "0.2" : "0.08"});
  transition: all 0.3s ease;
  overflow: hidden;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.12"});
}

.card-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid ${darkMode ? "#334155" : "#f1f5f9"};
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
}

.card-header p {
  font-size: 0.875rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
}

.card-content {
  padding: 2rem;
}

/* Recent Analyses */
.analyses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: ${darkMode ? "#334155" : "#f8fafc"};
  border: 1px solid ${darkMode ? "#475569" : "#e2e8f0"};
  border-radius: 16px;
  transition: all 0.3s ease;
}

.analysis-item:hover {
  background: ${darkMode ? "#475569" : "#f1f5f9"};
  transform: translateX(4px);
}

.analysis-info {
  flex: 1;
}

.species-name {
  font-size: 1rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  display: block;
  margin-bottom: 0.5rem;
  font-style: italic;
}

.analysis-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.confidence {
  color: #10b981;
  font-weight: 600;
}

.timestamp {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
}

.analysis-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.completed {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

.status-badge.processing {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.status-badge.failed {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
}

.card-footer {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid ${darkMode ? "#334155" : "#f1f5f9"};
}

.view-all-analyses {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-analyses:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
  transform: translateY(-2px);
}

/* Weekly Progress Chart */
.chart-container {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-legend {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.analyses {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

.legend-color.accuracy {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.progress-chart {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1rem;
  border-bottom: 2px solid ${darkMode ? "#334155" : "#e2e8f0"};
  margin-bottom: 1rem;
}

.chart-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.chart-bars {
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  width: 100%;
  justify-content: center;
}

.bar {
  width: 12px;
  border-radius: 6px 6px 0 0;
  min-height: 4px;
  transition: all 0.3s ease;
}

.bar.analyses {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

.bar.accuracy {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.day-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Species Distribution */
.species-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.species-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.species-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.species-info .species-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  font-style: italic;
}

.species-count {
  font-size: 0.8rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-weight: 500;
}

.species-bar {
  height: 8px;
  background: ${darkMode ? "#334155" : "#f1f5f9"};
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.5rem;
  background: ${darkMode ? "#334155" : "#f8fafc"};
  border: 2px solid ${darkMode ? "#475569" : "#e2e8f0"};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.quick-action-card:hover {
  background: ${darkMode ? "#475569" : "#f1f5f9"};
  border-color: #0ea5e9;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.15);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.action-icon.camera {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

.action-icon.database {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.action-icon.report {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.action-icon.charts {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.action-content h4 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
}

.action-content p {
  font-size: 0.875rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .main-content {
    margin-left: ${sidebarOpen ? "280px" : "80px"};
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 992px) {
  .nav-center {
    max-width: 400px;
    margin: 0 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
  
  .welcome-section h1 {
    font-size: 2rem;
  }
  
  .header-actions {
    justify-content: flex-start;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .bio-sidebar {
    width: ${sidebarOpen ? "100%" : "0"};
    transform: translateX(${sidebarOpen ? "0" : "-100%"});
  }
  
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
  
  .nav-center {
    display: none;
  }
  
  .nav-right {
    gap: 0.5rem;
  }
  
  .profile-info {
    display: none;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .stat-content h3 {
    font-size: 2rem;
  }
  
  .dashboard-header {
    padding: 1.5rem;
  }
  
  .welcome-section h1 {
    font-size: 1.75rem;
  }
  
  .welcome-section p {
    font-size: 1rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .notification-dropdown,
  .profile-dropdown {
    width: calc(100vw - 2rem);
    right: -1rem;
  }
}

@media (max-width: 576px) {
  .bio-top-nav {
    padding: 0 1rem;
  }
  
  .nav-left {
    gap: 1rem;
  }
  
  .nav-brand h1 {
    font-size: 1.25rem;
  }
  
  .role-badge {
    display: none;
  }
  
  .main-content {
    padding: 0.75rem;
  }
  
  .dashboard-header {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .welcome-section h1 {
    font-size: 1.5rem;
  }
  
  .action-btn {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }
  
  .stats-grid {
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-content h3 {
    font-size: 1.75rem;
  }
  
  .dashboard-grid {
    gap: 1rem;
  }
  
  .card-header {
    padding: 1.5rem 1.5rem 0.75rem;
  }
  
  .card-content {
    padding: 1rem 1.5rem;
  }
  
  .card-footer {
    padding: 0.75rem 1.5rem 1.5rem;
  }
  
  .analysis-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .chart-bars {
    height: 150px;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .quick-action-card {
    flex-direction: row;
    text-align: left;
    padding: 1rem;
  }
  
  .action-icon {
    width: 40px;
    height: 40px;
  }
}

/* Dark Mode Specific Overrides */
.biologist-dashboard.dark-mode .search-input {
  background: #0f172a;
  border-color: #334155;
  color: #e2e8f0;
}

.biologist-dashboard.dark-mode .search-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

.biologist-dashboard.dark-mode .nav-action-btn {
  background: #334155;
  color: #e2e8f0;
}

.biologist-dashboard.dark-mode .nav-action-btn:hover {
  background: #475569;
}

.biologist-dashboard.dark-mode .dropdown-header {
  border-bottom-color: #334155;
}

.biologist-dashboard.dark-mode .notification-item {
  border-bottom-color: #334155;
}

.biologist-dashboard.dark-mode .dropdown-footer {
  border-top-color: #334155;
}

.biologist-dashboard.dark-mode .sidebar-header {
  border-bottom-color: #334155;
}

.biologist-dashboard.dark-mode .sidebar-footer {
  border-top-color: #334155;
}

.biologist-dashboard.dark-mode .nav-link:hover {
  background: #334155;
}

.biologist-dashboard.dark-mode .card-header {
  border-bottom-color: #334155;
}

.biologist-dashboard.dark-mode .card-footer {
  border-top-color: #334155;
}

.biologist-dashboard.dark-mode .analysis-item {
  background: #334155;
  border-color: #475569;
}

.biologist-dashboard.dark-mode .analysis-item:hover {
  background: #475569;
}

.biologist-dashboard.dark-mode .quick-action-card {
  background: #334155;
  border-color: #475569;
}

.biologist-dashboard.dark-mode .quick-action-card:hover {
  background: #475569;
  border-color: #0ea5e9;
}

/* Print Styles */
@media print {
  .bio-top-nav,
  .bio-sidebar,
  .header-actions,
  .quick-actions-grid {
    display: none !important;
  }
  
  .main-content {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .dashboard-card {
    break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #e2e8f0 !important;
  }
  
  .stat-card {
    break-inside: avoid;
    box-shadow: none !important;
  }
  
  * {
    color: black !important;
    background: white !important;
  }
}

/* Animation Classes */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-in-left {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.bounce-in {
  animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

/* Utility Classes */
.text-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-effect {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.shadow-smooth {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.shadow-hover {
  transition: box-shadow 0.3s ease;
}

.shadow-hover:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* Focus Styles for Accessibility */
.nav-link:focus,
.action-btn:focus,
.quick-action-btn:focus,
.sidebar-toggle:focus,
.nav-action-btn:focus {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .biologist-dashboard {
    background: ${darkMode ? "#000000" : "#ffffff"};
  }
  
  .bio-top-nav,
  .bio-sidebar,
  .dashboard-card,
  .stat-card {
    border: 2px solid ${darkMode ? "#ffffff" : "#000000"};
  }
  
  .nav-link.active {
    background: ${darkMode ? "#ffffff" : "#000000"};
    color: ${darkMode ? "#000000" : "#ffffff"};
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .loading-spinner-bio {
    animation: none;
    border: 6px solid rgba(255, 255, 255, 0.3);
    border-top: 6px solid white;
  }
}
`;

export { getBiologistStyle };
