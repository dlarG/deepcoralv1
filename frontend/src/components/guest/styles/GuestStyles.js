// src/components/guest/styles/GuestStyles.js
export const getGuestStyles = (sidebarOpen) => `
  .coral-header {
    margin-bottom: 2rem;
  }
  .coral-controls {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
  .search-container {
    flex: 1;
    min-width: 300px;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    background: white;
  }

  .search-input:focus {
    outline: none;
    border-color: #0284c7;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
  }

  .filter-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .filter-btn {
    padding: 0.75rem 1.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  .filter-btn.active {
    background: #0284c7;
    border-color: #0284c7;
    color: white;
  }
  .coral-sections {
    margin-top: 2rem;
  }

  .classification-section {
    margin-bottom: 3rem;
  }

  .classification-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .coral-count {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 400;
  }

  .coral-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
  }

  .coral-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .coral-item:hover {
    border-color: #0284c7;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  .coral-item-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .coral-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .coral-item-info {
    flex: 1;
  }

  .coral-item-name {
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 0.25rem 0;
  }

  .coral-item-scientific {
    font-size: 0.875rem;
    color: #64748b;
    font-style: italic;
    margin: 0 0 0.5rem 0;
  }

  .coral-item-subtype {
    font-size: 0.75rem;
    background: #f1f5f9;
    color: #475569;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 500;
  }

  .coral-item-arrow {
    color: #94a3b8;
    font-size: 1.25rem;
    margin-left: 1rem;
  }
  .coral-detail-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
  }

  .coral-detail-content {
    background: white;
    border-radius: 16px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .coral-detail-header {
    position: sticky;
    top: 0;
    background: white;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    border-radius: 16px 16px 0 0;
  }

  .close-detail-btn {
    background: #f8fafc;
    border: none;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
  }

  .close-detail-btn:hover {
    background: #f1f5f9;
    color: #475569;
  }

  .coral-detail-body {
    padding: 0 1.5rem 1.5rem;
  }

  .coral-detail-image {
    position: relative;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .coral-detail-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .coral-detail-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 96, 100, 0.9);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .coral-detail-name {
    font-size: 2rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 0.5rem 0;
  }

  .coral-detail-scientific {
    font-size: 1.25rem;
    color: #0284c7;
    font-style: italic;
    margin: 0 0 2rem 0;
  }

  .coral-detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .detail-item {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #0284c7;
  }

  .detail-label {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .detail-value {
    font-size: 1rem;
    color: #0f172a;
    font-weight: 500;
  }

  .coral-description {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 12px;
  }

  .coral-description h3 {
    font-size: 1.25rem;
    color: #0f172a;
    margin: 0 0 1rem 0;
  }

  .coral-description p {
    line-height: 1.6;
    color: #374151;
    margin: 0;
  }

  .no-results {
    text-align: center;
    padding: 3rem;
    color: #64748b;
  }

  @media (max-width: 768px) {
    .coral-controls {
      flex-direction: column;
    }

    .filter-buttons {
      justify-content: center;
    }

    .coral-list {
      grid-template-columns: 1fr;
    }

    .coral-detail-modal {
      padding: 1rem;
    }

    .coral-detail-name {
      font-size: 1.5rem;
    }

    .coral-detail-grid {
      grid-template-columns: 1fr;
    }
  }

  .guest-dashboard {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #f8fafc;
  }

  /* Modern Top Navigation */
  .top-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid #e2e8f0;
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    height: 70px;
    max-width: 100%;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: transparent;
    border: none;
    color: #334155;
    cursor: pointer;
    transition: all 0.2s;
  }

  .menu-toggle:hover {
    background: #f1f5f9;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    font-size: 1.75rem;
  }

  .nav-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }

  .portal-tag {
    font-size: 0.75rem;
    background: rgb(202, 204, 206);
    color: rgb(35, 35, 35);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-weight: 500;
  }

  .user-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .welcome-text {
    font-size: 0.75rem;
    color: #64748b;
  }

  .username {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
  }

  .logout-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .logout-button:hover {
    background: #f1f5f9;
    color: #475569;
  }

  /* Modern Sidebar */
  .dashboard-container {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .sidebar {
    width: ${sidebarOpen ? "280px" : "80px"};
    background: white;
    border-right: 1px solid #e2e8f0;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: calc(100vh - 70px);
    position: fixed;
    top: 70px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .sidebar-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    font-weight: 600;
    margin: 0;
    opacity: ${sidebarOpen ? "1" : "0"};
    transition: opacity 0.2s;
    white-space: nowrap;
  }

  .sidebar-nav {
    flex: 1;
    padding: 0.75rem;
  }

  .sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar-nav li {
    position: relative;
    margin-bottom: 0.25rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .sidebar-nav li:hover {
    background: #f8fafc;
  }

  .sidebar-nav li.active {
    background: #f0f9ff;
  }

  .sidebar-nav li.active .nav-text {
    color: #0369a1;
    font-weight: 500;
  }

  .sidebar-nav li.active .nav-icon {
    color: #0284c7;
  }

  /* Coral Grid - Responsive to sidebar state */
  .coral-grid {
    display: grid;
    gap: 2rem;
    padding: 1rem 0;
  }

  .coral-grid.sidebar-collapsed {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }

  .coral-grid:not(.sidebar-collapsed) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }

  /* Coral Card */
  .coral-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .coral-image-container {
    position: relative;
    height: 200px;
  }

  .coral-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .coral-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 96, 100, 0.9);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .coral-content {
    padding: 1.8rem;
  }
  .coral-content-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }
  .coral-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
    text-align: center;
  }

  .coral-scientific-name {
    text-align: center;
    font-style: italic;
    color: #006064;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  /* Info Cards - Responsive to sidebar state */
  .info-cards-container {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .coral-grid.sidebar-collapsed .info-cards-container {
    grid-template-columns: 1fr;
  }

  .coral-grid:not(.sidebar-collapsed) .info-cards-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-card {
    background: rgba(0, 96, 100, 0.05);
    border-left: 3px solid rgba(0, 96, 100, 0.9);
    padding: 1rem;
    border-radius: 4px;
  }

  .info-label {
    font-size: 0.8rem;
    color: rgba(0, 96, 100, 0.8);
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  .info-value {
    font-size: 1rem;
    color: #333;
    font-weight: 500;
  }

  .description-section {
    background: #f9f9f9;
    padding: 1.5rem;
    border-radius: 8px;
  }

  .description-text {
    color: #555;
    line-height: 1.6;
  }

  .nav-item-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    white-space: nowrap;
  }

  .nav-icon {
    font-size: 1.25rem;
    color: #64748b;
    min-width: 24px;
    display: flex;
    justify-content: center;
  }

  .nav-text {
    font-size: 0.9375rem;
    color: #334155;
    transition: opacity 0.3s;
    opacity: ${sidebarOpen ? "1" : "0"};
  }

  .active-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #0284c7;
    border-radius: 0 3px 3px 0;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .sidebar-nav li.active .active-indicator {
    opacity: 1;
  }

  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid #f1f5f9;
  }

  .app-version {
    font-size: 0.6875rem;
    color: #94a3b8;
    opacity: ${sidebarOpen ? "1" : "0"};
    transition: opacity 0.2s;
    white-space: nowrap;
  }

  /* Main Content */
  .main-content {
    flex: 1;
    padding: 2rem;
    background: #f8fafc;
    overflow-y: auto;
    margin-left: ${sidebarOpen ? "280px" : "80px"};
    transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: calc(100vh - 70px);
  }

  .content-section {
    max-width: 1400px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .content-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 1.5rem;
  }

  .content-placeholder {
    color: #64748b;
    text-align: center;
    padding: 3rem 0;
    max-height: 800px;
  }

  @media (max-width: 1024px) {
    .coral-grid:not(.sidebar-collapsed),
    .coral-grid.sidebar-collapsed {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }
    .info-cards-container {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 768px) {
    .content-section {
      padding: 1.5rem;
    }
    .sidebar {
      z-index: 100;
      transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
      width: 280px;
    }
    .main-content {
      margin-left: 0;
    }

    .coral-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .nav-container {
      padding: 0 1rem;
    }

    .sidebar {
      position: fixed;
      z-index: 40;
      height: calc(100vh - 70px);
      box-shadow: ${sidebarOpen ? "4px 0 15px rgba(0, 0, 0, 0.1)" : "none"};
    }

    .main-content {
      padding: 1rem;
    }

    .content-section {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .portal-tag,
    .welcome-text {
      display: none;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      font-size: 0.875rem;
    }

    .username {
      font-size: 0.8125rem;
    }

    .logout-button span {
      display: none;
    }

    .logout-button {
      padding: 0.5rem;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      justify-content: center;
    }
  }
/* Enhanced Profile Management Styles */
  .profile-management-header {
    margin-bottom: 2.5rem;
    text-align: center;
  }
.profile-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
    }

  .profile-subtitle {
    color: #64748b;
    margin: 0.75rem 0 0 0;
    font-size: 1rem;
    font-weight: 400;
  }

  .profile-overview-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
    position: relative;
  }

  .profile-overview-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%);
    z-index: 1;
  }

  .profile-header {
    position: relative;
    z-index: 2;
    padding: 2rem 2.5rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0;
    border-bottom: none;
  }

  .profile-avatar-section {
    display: flex;
    gap: 1.5rem;
    align-items: flex-end;
  }

  .profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    border: 5px solid white;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    background: white;
  }

  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-initials {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .profile-info {
    margin-top: 1rem;
  }

  .profile-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .profile-username {
    color: rgba(34, 32, 32, 0.9);
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .role-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .edit-profile-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    color: black;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    font-size: 0.875rem;
  }

  .edit-profile-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .profile-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    padding: 2rem 2.5rem;
    margin-bottom: 0;
  }

  .detail-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #f1f5f9;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .detail-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  }

  .detail-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }

  .detail-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f1f5f9;
  }

  .detail-header svg {
    color: #0ea5e9;
    background: #f0f9ff;
    padding: 0.5rem;
    border-radius: 10px;
    width: 40px;
    height: 40px;
  }

  .detail-header h4 {
    margin: 0;
    color: #0f172a;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .detail-content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .detail-items {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 12px;
    border-left: 4px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .detail-items:hover {
    background: #f1f5f9;
    border-left-color: #0ea5e9;
  }

  .detail-label {
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-value {
    color: #0f172a;
    font-weight: 600;
    text-align: right;
    max-width: 60%;
    word-wrap: break-word;
  }

  .danger-zone {
    margin: 2rem 2.5rem;
    padding: 2rem;
    background: linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%);
    border-radius: 16px;
    border: 2px solid #fecaca;
    position: relative;
    overflow: hidden;
  }

  .danger-zone::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }

  .danger-header {
    margin-bottom: 1.5rem;
  }

  .danger-header h4 {
    color: #dc2626;
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .danger-header h4::before {
    content: '⚠️';
    font-size: 1.5rem;
  }

  .danger-header p {
    color: #7f1d1d;
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .delete-account-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }

  .delete-account-btn:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }

  /* Enhanced Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-container {
    background: white;
    border-radius: 20px;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1rem;
    border-bottom: none;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 20px 20px 0 0;
  }

  .modal-header h3 {
    margin: 0;
    color: #0f172a;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .modal-close-btn {
    background: #f1f5f9;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .modal-close-btn:hover {
    background: #e2e8f0;
    color: #475569;
    transform: rotate(90deg);
  }

  .modal-tabs {
    display: flex;
    background: #f8fafc;
    margin: 0;
    border-bottom: 2px solid #e2e8f0;
  }

  .tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.25rem;
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    position: relative;
  }

  .tab-btn:hover {
    background: #f1f5f9;
    color: #475569;
  }

  .tab-btn.active {
    color: #0ea5e9;
    background: white;
  }

  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
    border-radius: 3px 3px 0 0;
  }

  .modal-body {
    padding: 2rem;
    background: white;
  }

  .tab-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .form-input,
  .form-textarea {
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    background: #fafbfc;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #0ea5e9;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
    background: white;
  }

  .form-input.error,
  .form-textarea.error {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .error-text {
    font-size: 0.75rem;
    color: #ef4444;
    font-weight: 500;
  }

  .general-error {
    background: linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%);
    color: #dc2626;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    border: 1px solid #fecaca;
    font-weight: 500;
  }

  .image-upload-section {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 16px;
    border: 2px dashed #cbd5e1;
  }

  .current-image {
    flex-shrink: 0;
  }

  .image-preview {
    width: 100px;
    height: 100px;
    border-radius: 16px;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .image-placeholder {
    width: 100px;
    height: 100px;
    border: 2px dashed #94a3b8;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 0.75rem;
    gap: 0.5rem;
    background: white;
  }

  .upload-controls {
    flex: 1;
  }

  .file-input {
    display: none;
  }

  .upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
    color: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
  }

  .upload-btn:hover {
    background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
  }

  .upload-hint {
    margin: 0.75rem 0 0 0;
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
  }

  .security-notice {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
    border-radius: 16px;
    margin-bottom: 1.5rem;
    border: 1px solid #bfdbfe;
  }

  .security-notice svg {
    color: #0ea5e9;
    background: white;
    padding: 0.5rem;
    border-radius: 10px;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  .security-notice h4 {
    margin: 0 0 0.5rem 0;
    color: #0f172a;
    font-weight: 600;
  }

  .security-notice p {
    margin: 0;
    color: #475569;
    font-size: 0.875rem;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem 2rem 2rem;
    background: #f8fafc;
    border-radius: 0 0 20px 20px;
  }

  .cancel-btn {
    padding: 0.875rem 1.5rem;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 600;
  }

  .cancel-btn:hover:not(:disabled) {
    background: #e2e8f0;
    color: #475569;
  }

  .save-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .save-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
  }

  .save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .loading-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .loading-text::after {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      gap: 1.5rem;
      align-items: center;
      text-align: center;
      padding: 2rem 1.5rem 1.5rem;
    }

    .profile-avatar-section {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .profile-details-grid {
      grid-template-columns: 1fr;
      padding: 1.5rem;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .image-upload-section {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .modal-footer {
      flex-direction: column-reverse;
    }

    .modal-container {
      margin: 1rem;
      max-width: calc(100% - 2rem);
    }

    .modal-header,
    .modal-body {
      padding: 1.5rem;
    }

    .danger-zone {
      margin: 1.5rem;
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .profile-avatar {
      width: 100px;
      height: 100px;
    }

    .avatar-initials {
      font-size: 2rem;
    }

    .profile-info h3 {
      font-size: 1.5rem;
    }

    .detail-card {
      padding: 1.5rem;
    }
  }
    
    .delete-modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(239, 68, 68, 0.3);
  animation: slideUp 0.3s ease;
}

.delete-modal-header {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%);
  border-bottom: 1px solid #fecaca;
}

.delete-warning-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.delete-modal-header h3 {
  margin: 0 0 0.5rem 0;
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 700;
}

.delete-modal-header p {
  margin: 0;
  color: #7f1d1d;
  font-weight: 500;
}

.delete-modal-body {
  padding: 2rem;
}

.delete-warning {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.delete-warning h4 {
  margin: 0 0 1rem 0;
  color: #dc2626;
  font-weight: 600;
}

.delete-warning ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #7f1d1d;
}

.delete-warning li {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.delete-confirm-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.delete-confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
`;
