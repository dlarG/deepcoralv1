export const getAdminStyles = (sidebarOpen, darkMode = false) => `
     @media (max-width: 390px) {
      .admin-dashboard {
        font-size: 14px;
      }
      
      /* Navigation Adjustments */
      .nav-container {
        padding: 0 0.75rem;
        height: 60px;
      }
      
      .menu-toggle {
        width: 36px;
        height: 36px;
      }
      
      .nav-title {
        font-size: 1rem;
      }
      
      .portal-tag {
        display: none;
      }
      
      /* Sidebar Adjustments */
      .sidebar {
        width: ${sidebarOpen ? "100%" : "0"};
        transform: translateX(${sidebarOpen ? "0" : "-100%"});
        top: 60px;
        height: calc(100vh - 60px);
        z-index: 100;
      }
      
      .main-content {
        margin-left: 0;
        padding: 0.75rem;
        height: calc(100vh - 60px);
      }
      
      /* User Management Mobile Styles */
      .user-management-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
      }
      
      .header-left h2 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
      
      .content-subtitle {
        font-size: 0.8rem;
      }
      
      .header-actions {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .export-btn,
      .add-user-btn {
        padding: 0.875rem 1rem;
        font-size: 0.875rem;
        justify-content: center;
        width: 100%;
      }
      
      .user-controls {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .search-input-container {
        max-width: 100%;
      }
      
      .search-input {
        padding: 0.75rem 1rem 0.75rem 2.25rem;
        font-size: 0.875rem;
      }
      
      .search-icon {
        left: 0.75rem;
        font-size: 0.875rem;
      }
      
      .filter-section {
        flex-direction: column;
        gap: 1rem;
      }
      
      .filter-group {
        width: 100%;
      }
      
      .filter-selects {
        padding: 0.75rem;
        font-size: 0.875rem;
        width: 100%;
      }
      
      .user-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      
      .stat-item {
        padding: 1rem;
      }
      
      .stat-number {
        font-size: 1.25rem;
      }
      
      .stat-label {
        font-size: 0.7rem;
      }
      
      /* Table Mobile Responsive */
      .users-table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .users-table {
        min-width: 650px;
        font-size: 0.8rem;
      }
      
      .users-table th,
      .users-table td {
        padding: 0.5rem 0.375rem;
        white-space: nowrap;
      }
      
      .user-avatar-small {
        width: 32px;
        height: 32px;
      }
      
      .avatar-initials {
        font-size: 0.75rem;
      }
      
      .user-full-name {
        font-size: 0.8rem;
      }
      
      .user-id {
        font-size: 0.65rem;
      }
      
      .username-cell {
        font-size: 0.75rem;
      }
      
      .role-badge-new {
        padding: 0.25rem 0.5rem;
        font-size: 0.65rem;
      }
      
      .action-buttons-new {
        gap: 0.25rem;
      }
      
      .action-btn-new {
        width: 28px;
        height: 28px;
      }
      
      /* Pagination Mobile */
      .pagination-container {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
        padding: 0.75rem 0;
      }
      
      .pagination-info {
        font-size: 0.8rem;
      }
      
      .pagination-controls {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem;
      }
      
      .pagination-btn {
        padding: 0.5rem 0.625rem;
        font-size: 0.8rem;
        min-width: 36px;
      }
      
      /* Modal Mobile Styles */
      .modal-overlay-new {
        padding: 0.5rem;
        align-items: flex-start;
        padding-top: 1rem;
      }
      
      .user-modal-new {
        max-height: calc(100vh - 5rem);
        margin: 0;
        border-radius: 12px;
        width: 100%;
        max-width: 100%;
      }
      
      .modal-header-new {
        padding: 1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      
      .modal-title-section h3 {
        font-size: 1.25rem;
      }
      
      .modal-title-section p {
        font-size: 0.8rem;
      }
      
      .close-btn-new {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.375rem;
      }
      
      .form-body-new {
        padding: 1rem;
        max-height: calc(100vh - 180px);
      }
      
      .form-section h4 {
        font-size: 1rem;
      }
      
      .form-row-new {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      
      .form-group-new {
        margin-bottom: 1rem;
      }
      
      .form-group-new label {
        font-size: 0.8rem;
      }
      
      .form-group-new input,
      .form-group-new select {
        padding: 0.75rem;
        font-size: 0.875rem;
      }
      
      .error-text {
        font-size: 0.7rem;
      }
      
      .password-requirements {
        padding: 0.75rem;
        margin-top: 0.5rem;
      }
      
      .password-requirements p {
        font-size: 0.7rem;
      }
      
      .password-requirements li {
        font-size: 0.65rem;
      }
      
      .modal-actions-new {
        padding: 1rem;
        gap: 0.75rem;
      }
      
      .cancel-btn-new,
      .submit-btn-new {
        padding: 0.875rem 1.5rem;
        font-size: 0.875rem;
        flex: 1;
      }
      
      /* Coral Management Mobile */
      .coral-management-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .add-coral-btn {
        width: 100%;
        padding: 0.875rem 1.5rem;
        font-size: 0.875rem;
        justify-content: center;
      }
      
      .coral-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .coral-management-card {
        margin: 0;
      }
      
      .coral-card-image {
        height: 180px;
      }
      
      .coral-card-content {
        padding: 1rem;
      }
      
      .coral-card-title {
        font-size: 1rem;
      }
      
      .coral-card-scientific {
        font-size: 0.8rem;
      }
      
      .info-item {
        font-size: 0.8rem;
      }
      
      .coral-card-description {
        font-size: 0.8rem;
      }
      
      .classification-badge {
        padding: 0.25rem 0.5rem;
        font-size: 0.65rem;
      }
      
      /* Coral Modal Mobile */
      .coral-modal {
        width: 100%;
        max-width: 100%;
        max-height: calc(100vh - 2rem);
        margin: 0;
        border-radius: 12px;
      }
      
      .coral-modal-header {
        padding: 1rem;
      }
      
      .coral-modal-header h3 {
        font-size: 1.25rem;
      }
      
      .coral-modal-body {
        padding: 1rem;
        max-height: calc(100vh - 200px);
        overflow-y: auto;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      
      .form-group {
        margin-bottom: 1rem;
      }
      
      .form-group label {
        font-size: 0.8rem;
      }
      
      .form-group input,
      .form-group select,
      .form-group textarea {
        padding: 0.75rem;
        font-size: 0.875rem;
      }
      
      .coral-modal-actions {
        padding: 1rem;
        gap: 0.75rem;
      }
      
      .cancel-btn,
      .submit-btn {
        padding: 0.875rem 1.5rem;
        font-size: 0.875rem;
        flex: 1;
      }
      
      .coral-view {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .coral-view-image {
        height: 250px;
      }
      
      /* Report Generation Mobile */
      .report-generation-container {
        padding: 0.75rem;
      }
      
      .report-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
        margin-bottom: 1.5rem;
      }
      
      .report-title {
        font-size: 1.5rem;
      }
      
      .report-subtitle {
        font-size: 0.8rem;
      }
      
      .report-header-actions {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .report-action-btn {
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
        justify-content: center;
      }
      
      .report-tabs {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .report-tab-btn {
        padding: 0.875rem 1rem;
        font-size: 0.8rem;
        white-space: nowrap;
        min-width: 120px;
      }
      
      .report-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .report-sidebar {
        width: 100%;
        order: 1;
      }
      
      .report-main {
        order: 2;
      }
      
      .report-filters {
        padding: 1rem;
        margin-bottom: 1rem;
      }
      
      .report-filters h3 {
        font-size: 1rem;
      }
      
      .filter-grid {
        gap: 0.75rem;
      }
      
      .filter-group label {
        font-size: 0.8rem;
      }
      
      .filter-input,
      .filter-select {
        padding: 0.75rem;
        font-size: 0.875rem;
      }
      
      .generate-btn {
        padding: 0.875rem 1rem;
        font-size: 0.875rem;
      }
      
      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
      
      .summary-card {
        padding: 0.75rem;
      }
      
      .summary-value {
        font-size: 1.5rem;
      }
      
      .summary-label {
        font-size: 0.7rem;
      }
      
      .report-table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .report-table {
        min-width: 700px;
        font-size: 0.8rem;
      }
      
      .report-table th,
      .report-table td {
        padding: 0.5rem 0.375rem;
        white-space: nowrap;
      }
      
      .role-badge,
      .status-badge,
      .activity-badge {
        padding: 0.25rem 0.5rem;
        font-size: 0.7rem;
      }
      
      /* Image Upload Mobile */
      .add-image-container {
        padding: 0.75rem;
      }
      
      .header-section h1 {
        font-size: 2rem;
      }
      
      .header-section p {
        font-size: 1rem;
        padding: 0 1rem;
      }
      
      .upload-section {
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
      
      .file-upload-area {
        padding: 2rem 1rem;
      }
      
      .upload-icon {
        width: 60px;
        height: 60px;
        margin-bottom: 1rem;
      }
      
      .upload-text h3 {
        font-size: 1.25rem;
      }
      
      .upload-text p {
        font-size: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .upload-buttons {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .upload-button {
        padding: 0.875rem 1.5rem;
        font-size: 0.875rem;
        width: 100%;
        justify-content: center;
      }
      
      .controls-section {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        margin-top: 1.5rem;
      }
      
      .intensity-control {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
      }
      
      .intensity-label {
        font-size: 1rem;
      }
      
      .intensity-select {
        padding: 0.875rem 1rem;
        font-size: 0.875rem;
        min-width: auto;
        width: 100%;
      }
      
      .process-buttons {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .process-button {
        padding: 1rem 1.5rem;
        font-size: 0.875rem;
        min-width: auto;
        width: 100%;
      }
      
      .gallery-controls {
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
      
      .gallery-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .gallery-title {
        font-size: 1.25rem;
        justify-content: center;
      }
      
      .gallery-actions {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .action-button {
        padding: 0.875rem 1rem;
        font-size: 0.875rem;
        width: 100%;
        justify-content: center;
      }
      
      .image-gallery.grid {
        grid-template-columns: 1fr;
      }
      
      .gallery-item {
        padding: 1rem;
      }
      
      .filename {
        font-size: 0.8rem;
      }
      
      .crop-count {
        font-size: 0.7rem;
      }
      
      .crops-section {
        padding: 1.5rem;
      }
      
      .crops-title {
        font-size: 1.25rem;
      }
      
      .method-tag {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
      }
      
      .crops-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .crop-card {
        width: 100%;
      }
      
      .crop-label {
        font-size: 0.875rem;
      }
      
      .download-btn {
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
      }
      
      .batch-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .stat-card {
        padding: 1.5rem;
      }
      
      .stat-number {
        font-size: 2rem;
      }
      
      .stat-label {
        font-size: 0.75rem;
      }
      
      .loading-content {
        padding: 2rem;
        width: 95%;
      }
      
      .loading-text {
        font-size: 1.125rem;
      }
      
      .loading-subtext {
        font-size: 0.8rem;
      }
      
      /* Validation Center Mobile */
      .validation-filters {
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        padding: 0.75rem;
      }
      
      .filter-btn {
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
        justify-content: center;
      }
      
      .validation-content {
        padding: 1.5rem;
      }
      
      .pending-users-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .pending-user-card {
        padding: 1rem;
      }
      
      .user-card-header {
        gap: 0.75rem;
      }
      
      .user-avatars {
        width: 50px;
        height: 50px;
      }
      
      .avatar-initials {
        font-size: 1rem;
      }
      
      .user-info h3 {
        font-size: 1rem;
      }
      
      .user-username {
        font-size: 0.8rem;
      }
      
      .user-details {
        gap: 0.5rem;
        padding: 0.75rem;
      }
      
      .detail-row {
        font-size: 0.8rem;
      }
      
      .detail-label {
        min-width: 50px;
        font-size: 0.75rem;
      }
      
      .detail-value {
        font-size: 0.8rem;
      }
      
      .user-actions {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .action-btn {
        padding: 0.75rem;
        font-size: 0.8rem;
      }
      
      /* Profile Management Mobile */
      .profile-management-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .edit-profile-btn {
        padding: 0.875rem 1.5rem;
        font-size: 0.875rem;
        justify-content: center;
        width: 100%;
      }
      
      .profile-card-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
        padding: 1.5rem;
      }
      
      .profile-avatar-large {
        width: 40px;
        height: 40px;
      }
      
      .avatar-fallback {
        font-size: 2rem;
      }
      
      .profile-username {
        font-size: 1rem;
      }
      
      .profile-bio {
        font-size: 0.9rem;
      }
      
      .profile-details-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1.5rem;
      }
      
      .detail-card {
        padding: 1rem;
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
      }
      
      .detail-icon {
        width: 40px;
        height: 40px;
      }
      
      .detail-content h4 {
        font-size: 0.75rem;
      }
      
      .detail-content p {
        font-size: 0.875rem;
      }
      
      .profile-actions-section {
        padding: 1.5rem;
      }
      
      .action-buttons {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .action-btn {
        padding: 0.875rem 1.5rem;
        font-size: 0.875rem;
      }
      
      /* Profile Modal Mobile */
      .profile-modal {
        width: 100%;
        max-width: 100%;
        max-height: calc(100vh - 2rem);
        border-radius: 12px;
      }
      
      .profile-modal-header {
        padding: 1rem 1.5rem;
      }
      
      .profile-modal-header h3 {
        font-size: 1.25rem;
      }
      
      .profile-modal-tabs {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .tab-btn {
        padding: 0.875rem 1rem;
        white-space: nowrap;
        min-width: 120px;
        font-size: 0.8rem;
      }
      
      .profile-modal-body {
        padding: 1.5rem;
        max-height: calc(100vh - 240px);
        overflow-y: auto;
      }
      
      .image-container {
        width: 120px;
        height: 120px;
        margin-bottom: 1rem;
      }
      
      .upload-button {
        padding: 0.75rem 1.25rem;
        font-size: 0.875rem;
      }
      
      .upload-hint {
        font-size: 0.8rem;
      }
      
      .security-info {
        padding: 0.875rem;
      }
      
      .security-info h4 {
        font-size: 0.875rem;
      }
      
      .security-info p {
        font-size: 0.75rem;
      }
      
      .profile-modal-actions {
        padding: 1rem 1.5rem;
        gap: 0.75rem;
      }
      
      .save-btn {
        padding: 0.875rem 1.5rem;
        font-size: 0.875rem;
        flex: 1;
      }
      
      /* Delete Modal Mobile */
      .delete-modal {
        max-width: 95%;
        margin: 1rem;
      }
      
      .delete-modal-header {
        padding: 1.5rem;
      }
      
      .delete-warning-icon {
        width: 60px;
        height: 60px;
        margin-bottom: 0.75rem;
      }
      
      .delete-modal-header h3 {
        font-size: 1.25rem;
      }
      
      .delete-modal-header p {
        font-size: 0.875rem;
      }
      
      .delete-modal-body {
        padding: 1.5rem;
      }
      
      .delete-warning {
        padding: 1rem;
      }
      
      .delete-warning h4 {
        font-size: 0.875rem;
      }
      
      .delete-warning li {
        font-size: 0.8rem;
      }
      
      .delete-confirm-btn,
      .cancels-btn {
        padding: 0.875rem 1.25rem;
        font-size: 0.875rem;
        margin-left: 0;
        margin-bottom: 0.75rem;
        width: 100%;
      }
    }
    
    /* Extra Small Devices - Below 375px */
    @media (max-width: 375px) {
      .header-left h2 {
        font-size: 1.25rem;
      }
      
      .user-stats {
        grid-template-columns: 1fr;
      }
      
      .summary-grid {
        grid-template-columns: 1fr;
      }
      
      .batch-stats {
        grid-template-columns: 1fr;
      }
      
      .upload-icon {
        width: 50px;
        height: 50px;
      }
      
      .upload-text h3 {
        font-size: 1.125rem;
      }
      
      .profile-avatar-large {
        width: 60px;
        height: 60px;
      }
      
      .avatar-fallback {
        font-size: 1.5rem;
      }
      
      
    }
    
    /* Landscape Mobile Adjustments */
    @media (max-height: 500px) and (orientation: landscape) {
      .modal-overlay-new {
        padding: 0.25rem;
      }
      
      .coral-modal,
      .profile-modal {
        max-height: 95vh;
      }
      
      .form-body-new,
      .coral-modal-body,
      .profile-modal-body {
        max-height: calc(95vh - 140px);
      }
    }
    
    /* Touch-friendly adjustments */
    @media (pointer: coarse) {
      .action-btn-new,
      .nav-button,
      .pagination-btn,
      .filter-btn,
      .tab-btn {
        min-height: 44px;
        min-width: 44px;
      }
      
      .clickable-name {
        padding: 0.25rem 0;
        margin: -0.25rem 0;
      }
      
      .overlay-btn {
        min-width: 44px;
        min-height: 44px;
      }
    }.admin-top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)"
  };
  border-bottom: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, ${darkMode ? "0.25" : "0.08"});
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(241, 245, 249, 0.8)"
  };
  color: ${darkMode ? "#e2e8f0" : "#475569"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.sidebar-toggle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-toggle:hover::before {
  opacity: 1;
}

.sidebar-toggle:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.15"});
}

.sidebar-toggle:active {
  transform: translateY(0);
}

.logo-container {
  display: flex;
  align-items: center;
}

.navbar-logo {
  height: 32px;
  width: auto;
  transition: all 0.3s ease;
  filter: ${darkMode ? "brightness(1)" : "brightness(1)"};
}

.navbar-logo:hover {
  transform: scale(1.02);
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
  transition: color 0.3s ease;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 1rem 0 3rem;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 22px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  background: ${darkMode ? "rgba(15, 23, 42, 0.95)" : "white"};
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
  transform: translateY(-1px);
}

.search-input:focus + .search-icon {
  color: #0ea5e9;
}

.search-input::placeholder {
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  font-weight: 400;
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
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(241, 245, 249, 0.8)"
  };
  color: ${darkMode ? "#e2e8f0" : "#475569"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-action-btn:hover::before {
  opacity: 1;
}

.nav-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.15"});
}

.nav-action-btn:active {
  transform: translateY(-1px);
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${darkMode ? "#0f172a" : "white"};
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
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
  width: 380px;
  background: ${
    darkMode ? "rgba(30, 41, 59, 0.98)" : "rgba(255, 255, 255, 0.98)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(226, 232, 240, 0.8)"
  };
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, ${darkMode ? "0.4" : "0.15"}), 
              0 0 0 1px ${
                darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)"
              };
  z-index: 100;
  animation: dropdownSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow: hidden;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-15px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(241, 245, 249, 0.8)"
  };
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.2)" : "rgba(248, 250, 252, 0.5)"
  };
}

.dropdown-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
}

.mark-all-read {
  color: #0ea5e9;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mark-all-read:hover {
  background: rgba(14, 165, 233, 0.1);
  color: #0284c7;
}

.notification-list {
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${darkMode ? "#475569 #1e293b" : "#cbd5e1 #f8fafc"};
}

.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: ${darkMode ? "#1e293b" : "#f8fafc"};
}

.notification-list::-webkit-scrollbar-thumb {
  background: ${darkMode ? "#475569" : "#cbd5e1"};
  border-radius: 3px;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(248, 250, 252, 0.8)"
  };
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.notification-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.3)" : "rgba(248, 250, 252, 0.8)"
  };
  opacity: 0;
  transition: opacity 0.3s ease;
}

.notification-item:hover::before {
  opacity: 1;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.unread {
  background: ${
    darkMode ? "rgba(14, 165, 233, 0.08)" : "rgba(14, 165, 233, 0.03)"
  };
  border-left: 4px solid #0ea5e9;
}

.notification-item.unread::after {
  content: '';
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 8px;
  height: 8px;
  background: #0ea5e9;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}

.notification-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.notification-icon.discovery {
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
  color: #7c3aed;
}

.notification-icon.analysis {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #059669;
}

.notification-icon.system {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-content h4 {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 0.375rem 0;
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
  line-height: 1.3;
}

.notification-content p {
  font-size: 0.8rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  font-size: 0.75rem;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  font-weight: 500;
}

.dropdown-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(241, 245, 249, 0.8)"
  };
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.2)" : "rgba(248, 250, 252, 0.5)"
  };
}

.view-all-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.view-all-btn:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  background: none;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.profile-trigger::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(241, 245, 249, 0.5)"
  };
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-trigger:hover::before {
  opacity: 1;
}

.profile-trigger:hover {
  transform: translateY(-1px);
}

.profile-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(226, 232, 240, 0.8)"
  };
  box-shadow: 0 4px 15px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.1"});
  position: relative;
}

.profile-avatar img,
.avatar-initials {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.875rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.profile-name {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.2;
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.profile-role {
  font-size: 0.75rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  line-height: 1.2;
  font-weight: 500;
}

.dropdown-arrow {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 0.25rem;
}

.profile-container[data-open="true"] .dropdown-arrow {
  transform: rotate(180deg);
}

.profile-dropdown {
  width: 320px;
}

.profile-summary {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.profile-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(226, 232, 240, 0.8)"
  };
  box-shadow: 0 8px 25px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.15"});
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
  font-weight: 800;
  font-size: 1.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.profile-details h3 {
  font-size: 1rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
}

.profile-details p {
  font-size: 0.75rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.role-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 1rem;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  border-radius: 20px;
  font-size: 0.50rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(22, 101, 52, 0.2);
}

.dropdown-menu {
  padding: 1rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  border-radius: 12px;
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(241, 245, 249, 0.8)"
  };
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dropdown-item:hover::before {
  opacity: 1;
}

.dropdown-item:hover {
  transform: translateX(4px);
}

.dropdown-item.logout {
  color: #ef4444;
  font-weight: 700;
}

.dropdown-item.logout:hover {
  color: #dc2626;
}

.dropdown-item.logout::before {
  background: rgba(239, 68, 68, 0.1);
}

.dropdown-divider {
  height: 1px;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.8)"
  };
  margin: 1rem 0;
  border-radius: 1px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .admin-top-nav {
    padding: 0 1rem;
    height: 60px;
  }
  
  .nav-center {
    margin: 0 1rem;
    max-width: none;
    flex: 1;
  }
  
  .search-input {
    font-size: 0.8rem;
    height: 40px;
  }
  
  .search-input::placeholder {
    font-size: 0.8rem;
  }
  
  .nav-action-btn,
  .sidebar-toggle {
    width: 40px;
    height: 40px;
  }
  
  .profile-info {
    display: none;
  }
  
  .dropdown-arrow {
    display: none;
  }
  
  .notification-dropdown,
  .profile-dropdown {
    width: 95vw;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
}

@media (max-width: 480px) {
  .nav-center {
    display: none;
  }
  
  .nav-right {
    gap: 0.5rem;
  }
}

.admin-dashboard {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: ${darkMode ? "#0f172a" : "#f8fafc"};
  position: relative;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  padding-top: 70px;
}
























/* Sidebar Base Styles */
.sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  height: calc(100vh - 70px);
  width: ${sidebarOpen ? "280px" : "80px"};
  background: ${
    darkMode
      ? `linear-gradient(180deg, #1e293b 0%, #0f172a 100%)`
      : `linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)`
  };
  border-right: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(226, 232, 240, 0.8)"
  };
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  box-shadow: ${
    sidebarOpen
      ? `4px 0 20px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.1"})`
      : `2px 0 10px rgba(0, 0, 0, ${darkMode ? "0.2" : "0.05"})`
  };
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
}

/* Sidebar Header */
.sidebar-header {
  padding: ${sidebarOpen ? "2rem 1.5rem 1.5rem" : "2rem 0 1.5rem"};
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  text-align: ${sidebarOpen ? "left" : "center"};
  transition: all 0.3s ease;
  position: relative;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.2)" : "rgba(248, 250, 252, 0.5)"
  };
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

/* Navigation Styles */
.sidebar-nav {
  padding: 1.5rem 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: ${darkMode ? "#475569 #1e293b" : "#cbd5e1 #f8fafc"};
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: ${darkMode ? "#475569" : "#cbd5e1"};
  border-radius: 2px;
}

.sidebar-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.sidebar-nav li {
  position: relative;
  margin: 0 ${sidebarOpen ? "1rem" : "0.75rem"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-radius: 12px;
  overflow: visible; /* Changed from hidden to visible for tooltips */
}
.nav-item-content {
  display: flex;
  align-items: center;
  gap: ${sidebarOpen ? "1rem" : "0"};
  padding: ${sidebarOpen ? "1rem 1.25rem" : "1rem 0"};
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  text-decoration: none;
  min-height: 48px;
  width: 100%;
  justify-content: ${
    sidebarOpen ? "flex-start" : "center"
  }; /* Conditional centering */
}

.nav-item-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.3)" : "rgba(241, 245, 249, 0.8)"
  };
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.nav-item-content:hover::before {
  opacity: 1;
}

.nav-item-content:hover {
  transform: translateX(${sidebarOpen ? "4px" : "0"});
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
}
  

/* Active State - Fixed for collapsed */
.sidebar-nav li.active .nav-item-content {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)"
  };
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
  font-weight: 600;
  
  box-shadow: ${
    darkMode
      ? "0 4px 15px rgba(14, 165, 233, 0.2)"
      : "0 4px 15px rgba(14, 165, 233, 0.1)"
  };
  border: 1px solid ${
    darkMode ? "rgba(14, 165, 233, 0.3)" : "rgba(14, 165, 233, 0.2)"
  };
}

.sidebar-nav li.active .nav-item-content::before {
  opacity: 0;
}

.sidebar-nav li.active .nav-item-content:hover {
  transform: translateX(${sidebarOpen ? "2px" : "0"});
  box-shadow: ${
    darkMode
      ? "0 8px 25px rgba(14, 165, 233, 0.3)"
      : "0 8px 25px rgba(14, 165, 233, 0.15)"
  };
}

/* Icons - Always visible */
.nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  position: relative;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* Fixed width for consistent centering */
  height: 24px; /* Fixed height for consistent centering */
}

.sidebar-nav li.active .nav-icon {
  color: #0ea5e9;
  transform: scale(1.1);
}

/* Text Labels - Hide when collapsed */
.nav-text {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: ${sidebarOpen ? "1" : "0"};
  visibility: ${sidebarOpen ? "visible" : "hidden"};
  transform: ${sidebarOpen ? "translateX(0)" : "translateX(-10px)"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  position: relative;
  letter-spacing: 0.25px;
  width: ${sidebarOpen ? "auto" : "0"};
  overflow: hidden;
  margin-left: ${
    sidebarOpen ? "0" : "0"
  }; /* Remove any margin when collapsed */
}

.sidebar-nav li.active .nav-text {
  font-weight: 700;
}

/* Enhanced Tooltip for Collapsed State */
.nav-item-content {
  position: relative;
}

.nav-item-content::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 1rem);
  top: 50%;
  transform: translateY(-50%);
  background: ${darkMode ? "#1e293b" : "#334155"};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  border: 1px solid ${
    darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
  };
}

/* Show tooltip only when sidebar is collapsed and item is hovered */
.nav-item-content:hover::after {
  opacity: ${sidebarOpen ? "0" : "1"};
  visibility: ${sidebarOpen ? "hidden" : "visible"};
  transform: translateY(-50%) translateX(0);
}

/* Hide tooltip triangle when sidebar is open */
.nav-item-content::before {
  content: '';
  position: absolute;
  left: calc(100% + 0.5rem);
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 8px solid ${darkMode ? "#1e293b" : "#334155"};
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.nav-item-content:hover::before {
  opacity: ${sidebarOpen ? "0" : "1"};
  visibility: ${sidebarOpen ? "hidden" : "visible"};
}

/* Sidebar adjustments for collapsed state */
.sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  height: calc(100vh - 70px);
  width: ${sidebarOpen ? "280px" : "80px"};
  background: ${
    darkMode
      ? `linear-gradient(180deg, #1e293b 0%, #0f172a 100%)`
      : `linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)`
  };
  border-right: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(226, 232, 240, 0.8)"
  };
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  box-shadow: ${
    sidebarOpen
      ? `4px 0 20px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.1"})`
      : `2px 0 10px rgba(0, 0, 0, ${darkMode ? "0.2" : "0.05"})`
  };
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: visible; /* Changed to visible for tooltips */
}

/* Sidebar Header - Adjusted for collapsed state */
.sidebar-header {
  padding: ${sidebarOpen ? "2rem 1.5rem 1.5rem" : "2rem 0.75rem 1.5rem"};
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.2)" : "rgba(248, 250, 252, 0.5)"
  };
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${sidebarOpen ? "auto" : "80px"};
}

/* Active Indicator - Adjusted for collapsed */
.active-indicator {
  position: absolute;
  left: -0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  border-radius: 0 4px 4px 0;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 8px rgba(14, 165, 233, 0.4);
}

.sidebar-nav li.active .active-indicator {
  height: 32px;
}

/* Footer adjustments */
.sidebar-footer {
  padding: ${sidebarOpen ? "1.5rem" : "1rem 0.75rem"};
  border-top: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  text-align: center;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.2)" : "rgba(248, 250, 252, 0.5)"
  };
  backdrop-filter: blur(10px);
}

.app-version {
  font-size: ${sidebarOpen ? "0.75rem" : "0.6rem"};
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  font-weight: 600;
  opacity: ${sidebarOpen ? "1" : "0.8"};
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: ${sidebarOpen ? "1px" : "0.5px"};
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  padding: ${sidebarOpen ? "0.5rem 1rem" : "0.375rem 0.5rem"};
  border-radius: 20px;
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  display: inline-block;
  transform: ${sidebarOpen ? "scale(1)" : "scale(0.9)"};
}

/* Your existing mobile styles and other CSS... */

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .sidebar {
    width: ${sidebarOpen ? "100%" : "0"};
    transform: translateX(${sidebarOpen ? "0" : "-100%"});
    z-index: 100;
    box-shadow: ${sidebarOpen ? "0 0 50px rgba(0, 0, 0, 0.5)" : "none"};
    overflow: hidden; /* On mobile, hide overflow */
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .sidebar-header {
    padding: 1.5rem;
    text-align: left;
  }

  .sidebar-header::before {
    display: none;
  }

  .sidebar-title {
    font-size: 1.125rem;
    opacity: 1;
    transform: translateX(0);
  }

  .sidebar-nav li {
    margin: 0 1rem;
  }

  .nav-item-content {
    padding: 1rem 1.25rem;
    justify-content: flex-start; /* Always left-aligned on mobile */
    gap: 1rem;
  }

  .nav-text {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
    width: auto;
  }

  .nav-icon {
    width: auto;
    height: auto;
  }

  /* Hide tooltips on mobile */
  .nav-item-content::after,
  .nav-item-content::before {
    display: none;
  }

  .sidebar-footer {
    padding: 1.5rem;
    text-align: left;
  }

  .app-version {
    font-size: 0.75rem;
    opacity: 1;
    padding: 0.5rem 1rem;
    transform: scale(1);
  }
}

.app-version {
  font-size: ${sidebarOpen ? "0.75rem" : "0.65rem"};
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  font-weight: 600;
  opacity: ${sidebarOpen ? "1" : "0.7"};
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  padding: ${sidebarOpen ? "0.5rem 1rem" : "0.375rem"};
  border-radius: 20px;
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  display: inline-block;
}

/* Main Content Adjustment */
.main-content {
  flex: 1;
  margin-left: ${sidebarOpen ? "280px" : "80px"};
  padding: 2rem;
  background: ${darkMode ? "#0f172a" : "#f8fafc"};
  min-height: calc(100vh - 70px);
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: auto;
  position: relative;
}

/* Tooltip for Collapsed State */
.sidebar-nav li:not(.active) .nav-item-content:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 1rem);
  top: 50%;
  transform: translateY(-50%);
  background: ${darkMode ? "#1e293b" : "#334155"};
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${sidebarOpen ? "0" : "1"};
  visibility: ${sidebarOpen ? "hidden" : "visible"};
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .sidebar {
    width: ${sidebarOpen ? "100%" : "0"};
    transform: translateX(${sidebarOpen ? "0" : "-100%"});
    z-index: 100;
    box-shadow: ${sidebarOpen ? "0 0 50px rgba(0, 0, 0, 0.5)" : "none"};
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .sidebar-header {
    padding: 1.5rem;
    text-align: left;
  }

  .sidebar-title {
    font-size: 1.125rem;
    opacity: 1;
    transform: translateX(0);
  }

  .sidebar-nav li {
    margin: 0 1rem;
  }

  .nav-item-content {
    padding: 1rem 1.25rem;
    justify-content: flex-start;
  }

  .nav-text {
    opacity: 1;
    transform: translateX(0);
  }

  .sidebar-footer {
    padding: 1.5rem;
    text-align: left;
  }

  .app-version {
    font-size: 0.75rem;
    opacity: 1;
    padding: 0.5rem 1rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 480px) {
  .admin-top-nav {
    height: 60px;
  }

  .dashboard-container {
    padding-top: 60px;
  }

  .sidebar {
    top: 60px;
    height: calc(100vh - 60px);
  }

  .sidebar-header {
    padding: 1rem;
  }

  .sidebar-title {
    font-size: 1rem;
  }

  .nav-item-content {
    padding: 0.875rem 1rem;
  }

  .nav-icon {
    font-size: 1.125rem;
  }

  .nav-text {
    font-size: 0.8rem;
  }

  .sidebar-footer {
    padding: 1rem;
  }

  .app-version {
    font-size: 0.7rem;
    padding: 0.375rem 0.75rem;
  }
}

/* Overlay for Mobile */
@media (max-width: 768px) {
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 90;
    opacity: ${sidebarOpen ? "1" : "0"};
    visibility: ${sidebarOpen ? "visible" : "hidden"};
    transition: all 0.3s ease;
    backdrop-filter: blur(2px);
  }
}

/* Smooth Animations */
@keyframes slideInFromLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sidebar-nav li {
  animation: fadeIn 0.5s ease forwards;
}

.sidebar-nav li:nth-child(1) { animation-delay: 0.1s; }
.sidebar-nav li:nth-child(2) { animation-delay: 0.15s; }
.sidebar-nav li:nth-child(3) { animation-delay: 0.2s; }
.sidebar-nav li:nth-child(4) { animation-delay: 0.25s; }
.sidebar-nav li:nth-child(5) { animation-delay: 0.3s; }
.sidebar-nav li:nth-child(6) { animation-delay: 0.35s; }
.sidebar-nav li:nth-child(7) { animation-delay: 0.4s; }
.sidebar-nav li:nth-child(8) { animation-delay: 0.45s; }










/* Dashboard Content Styles */
.content-section {
  padding: 1.5rem;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background: ${darkMode ? "#0f172a" : "#f8fafc"};
  flex-direction: column;
  display: flex;
  min-height: calc(100vh - 70px);
  gap: 1.5rem;
}


.content-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(14, 165, 233, 0.3);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stat Card */
.stat-card {
  background: ${
    darkMode
      ? `linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)`
      : `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: ${
    darkMode
      ? `0 8px 32px rgba(0, 0, 0, 0.3), 
         0 1px 0 rgba(255, 255, 255, 0.05) inset,
         0 0 0 1px rgba(255, 255, 255, 0.05) inset`
      : `0 8px 32px rgba(0, 0, 0, 0.08), 
         0 1px 0 rgba(255, 255, 255, 0.8) inset,
         0 0 0 1px rgba(255, 255, 255, 0.2) inset`
  };
  cursor: pointer;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${
    darkMode
      ? `linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)`
      : `linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(16, 185, 129, 0.03) 100%)`
  };
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 20px;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: ${
    darkMode ? "rgba(14, 165, 233, 0.4)" : "rgba(14, 165, 233, 0.2)"
  };
  box-shadow: ${
    darkMode
      ? `0 20px 60px rgba(0, 0, 0, 0.4), 
         0 0 0 1px rgba(14, 165, 233, 0.2),
         0 8px 32px rgba(14, 165, 233, 0.15)`
      : `0 20px 60px rgba(0, 0, 0, 0.15), 
         0 0 0 1px rgba(14, 165, 233, 0.1),
         0 8px 32px rgba(14, 165, 233, 0.1)`
  };
}

.stat-card:active {
  transform: translateY(-6px) scale(1.01);
}

/* Stat Icon Styles */
.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 20px;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  z-index: -1;
}

/* Individual Icon Colors */
.stat-icon.users {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
}

.stat-icon.images {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(52, 211, 153, 0.4);
}

.stat-icon.reports {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
}

.stat-icon.species {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(167, 139, 250, 0.4);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-card:hover .stat-icon.users {
  box-shadow: 0 12px 35px rgba(96, 165, 250, 0.6);
}

.stat-card:hover .stat-icon.images {
  box-shadow: 0 12px 35px rgba(52, 211, 153, 0.6);
}

.stat-card:hover .stat-icon.reports {
  box-shadow: 0 12px 35px rgba(251, 191, 36, 0.6);
}

.stat-card:hover .stat-icon.species {
  box-shadow: 0 12px 35px rgba(167, 139, 250, 0.6);
}

/* Stat Info */
.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 2;
  position: relative;
}

.stat-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.stat-card:hover .stat-info h3 {
  color: ${darkMode ? "#cbd5e1" : "#475569"};
}

.stat-info p {
  font-size: 2.5rem;
  font-weight: 800;
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
  margin: 0;
  line-height: 1;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-card:hover .stat-info p {
  transform: scale(1.05);
}

/* Dashboard Welcome Section (if you decide to uncomment it) */
.dashboard-welcome {
  background: ${
    darkMode
      ? `linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)`
      : `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: ${
    darkMode
      ? `0 8px 32px rgba(0, 0, 0, 0.3)`
      : `0 8px 32px rgba(0, 0, 0, 0.08)`
  };
  position: relative;
  overflow: hidden;
}

.dashboard-welcome::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border-radius: 24px;
}

.dashboard-welcome h2 {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;
}

.dashboard-welcome p {
  font-size: 1.25rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  font-weight: 500;
  position: relative;
  z-index: 2;
}

/* Mobile Responsive Styles */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  .stat-card {
    padding: 1.5rem;
    gap: 1.25rem;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
  }
  
  .stat-info p {
    font-size: 2.25rem;
  }
}

@media (max-width: 768px) {
  .content-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.5rem;
    gap: 1rem;
    flex-direction: row;
    align-items: center;
    border-radius: 16px;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 14px;
  }
  
  .stat-info h3 {
    font-size: 0.9rem;
  }
  
  .stat-info p {
    font-size: 2rem;
  }
  
  .dashboard-welcome {
    padding: 2rem;
    border-radius: 20px;
  }
  
  .dashboard-welcome h2 {
    font-size: 1.875rem;
  }
  
  .dashboard-welcome p {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .content-title {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
  }
  
  .stats-grid {
    gap: 0.875rem;
  }
  
  .stat-card {
    padding: 1.25rem;
    gap: 0.875rem;
    border-radius: 14px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
  }
  
  .stat-info h3 {
    font-size: 0.8rem;
    letter-spacing: 0.25px;
  }
  
  .stat-info p {
    font-size: 1.75rem;
  }
  
  .dashboard-welcome {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .dashboard-welcome h2 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .dashboard-welcome p {
    font-size: 1rem;
  }
}

@media (max-width: 375px) {
  .content-title {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .stat-icon {
    width: 45px;
    height: 45px;
  }
  
  .stat-info h3 {
    font-size: 0.75rem;
  }
  
  .stat-info p {
    font-size: 1.5rem;
  }
}

/* Staggered Animation for Cards */
.stat-card:nth-child(1) {
  animation-delay: 0.1s;
}

.stat-card:nth-child(2) {
  animation-delay: 0.2s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.3s;
}

.stat-card:nth-child(4) {
  animation-delay: 0.4s;
}

/* Loading Animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.stat-card.loading {
  background: linear-gradient(90deg, 
    ${darkMode ? "#1e293b" : "#f1f5f9"} 0px, 
    ${darkMode ? "#334155" : "#e2e8f0"} 40px, 
    ${darkMode ? "#1e293b" : "#f1f5f9"} 80px
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .stat-card,
  .stat-icon,
  .stat-info p {
    transition: none;
    animation: none;
  }
  
  .stat-card:hover {
    transform: none;
  }
  
  .stat-card:hover .stat-icon {
    transform: none;
  }
  
  .stat-card:hover .stat-info p {
    transform: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .stat-card {
    border-width: 2px;
    border-color: ${darkMode ? "#ffffff" : "#000000"};
  }
  
  .stat-info h3 {
    color: ${darkMode ? "#ffffff" : "#000000"};
  }
}














//User Management Styles

.user-management-header {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: ${
    darkMode
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.08)"
  };
  animation: slideInDown 0.6s ease-out;
  position: relative;
  overflow: hidden;
}

.header-left {
  max-width: 600px;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-actions-fixed {
  position: absolute;
  top: 35px;
  right: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  z-index: 40; 
  animation: fadeInRight 0.6s ease-out 0.2s both;
}


.content-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.content-subtitle {
  font-size: 1.125rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  font-weight: 500;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Action Buttons */
.export-btn, .add-user-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  border: none;
  min-height: 48px;
}

.export-btn {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(241, 245, 249, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#475569"};
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.8)"
  };
}

.export-btn:hover {
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.9)" : "rgba(226, 232, 240, 0.9)"
  };
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.15"});
}

.add-user-btn.primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.add-user-btn.primary:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

/* Controls Section */
.user-controls {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: ${
    darkMode
      ? "0 4px 20px rgba(0, 0, 0, 0.2)"
      : "0 4px 20px rgba(0, 0, 0, 0.05)"
  };
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.user-search-section {
  margin-bottom: 1.5rem;
}

.search-input-container {
  position: relative;
  max-width: 400px;
}

.user-search-icon {
  position: absolute;
  left: 3rem;
  top: 24%;
  transform: translateY(-50%);
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  z-index: 2;
  transition: color 0.3s ease;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 1rem 0 3rem;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 12px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.search-input:focus {
  border-color: #0ea5e9;
  background: ${darkMode ? "rgba(15, 23, 42, 0.95)" : "white"};
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
  transform: translateY(-1px);
}

.search-input:focus + .user-search-icon {
  color: #0ea5e9;
}

.search-input::placeholder {
  color: ${darkMode ? "#64748b" : "#94a3b8"};
}

/* Filter Section */
.filter-section {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 160px;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-selects {
  height: 48px;
  padding: 0 1rem;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 12px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.filter-selects:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
}

/* User Stats */
.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.stat-item {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 14px;
  padding: 1.5rem;
  text-align: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.1"});
  border-color: rgba(14, 165, 233, 0.3);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Table Styles */
.users-table-container {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: ${
    darkMode
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.05)"
  };
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(241, 245, 249, 0.8)"
  };
}

.users-table th {
  padding: 1.25rem 1rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.875rem;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(241, 245, 249, 0.8)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
}

.user-row {
  transition: all 0.3s ease;
}

.user-row:hover {
  background: ${
    darkMode ? "rgba(14, 165, 233, 0.05)" : "rgba(14, 165, 233, 0.02)"
  };
  transform: scale(1.01);
}

/* Avatar Styles */
.user-avatar-small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  box-shadow: 0 4px 12px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.1"});
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Name Cell */
.user-name-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-full-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
  cursor: pointer;
  transition: color 0.3s ease;
}

.user-full-name:hover {
  color: #0ea5e9;
}

.user-id {
  font-size: 0.75rem;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  font-weight: 500;
}

.username-cell {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 0.875rem;
}

/* Badge Styles */
.role-badge-new {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.role-badge-new.admin {
  background: linear-gradient(135deg,rgb(42, 65, 179) 0%, rgb(85, 104, 200) 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(68, 128, 239, 0.3);
}

.role-badge-new.biologist {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.role-badge-new.guest {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

/* Action Buttons */
.action-buttons-new {
  display: flex;
  gap: 0.5rem;
}

.action-btn-new {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-btn-new.edit {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.action-btn-new.edit:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.action-btn-new.delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.action-btn-new.delete:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* No Users Found */
.no-users-found {
  text-align: center;
  padding: 4rem 2rem;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
}

.no-users-found svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-users-found h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
}

.no-users-found p {
  font-size: 0.875rem;
  margin: 0;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  animation: fadeInUp 0.6s ease-out 0.8s both;
}

.pagination-info {
  font-size: 0.875rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.pagination-btn {
  padding: 0.75rem 1rem;
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 8px;
  background: ${
    darkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(241, 245, 249, 0.9)"
  };
  border-color: rgba(14, 165, 233, 0.3);
  transform: translateY(-1px);
}

.pagination-btn.active {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  padding: 0.75rem 0.5rem;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  font-weight: 600;
}

/* Modal Styles */
.modal-overlay-new {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.user-modal-new {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(226, 232, 240, 0.8)"
  };
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: ${
    darkMode
      ? "0 25px 60px rgba(0, 0, 0, 0.5)"
      : "0 25px 60px rgba(0, 0, 0, 0.15)"
  };
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header-new {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  position: relative;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.2)" : "rgba(248, 250, 252, 0.5)"
  };
}

.modal-title-section h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-title-section p {
  font-size: 0.875rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  font-weight: 500;
}

.close-btn-new {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(241, 245, 249, 0.8)"
  };
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn-new:hover {
  background: ${darkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)"};
  color: #ef4444;
  transform: scale(1.05);
}

/* Form Styles */
.form-body-new {
  padding: 2rem;
  max-height: calc(90vh - 220px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${darkMode ? "#475569 #1e293b" : "#cbd5e1 #f8fafc"};
}

.form-body-new::-webkit-scrollbar {
  width: 6px;
}

.form-body-new::-webkit-scrollbar-track {
  background: ${darkMode ? "#1e293b" : "#f8fafc"};
}

.form-body-new::-webkit-scrollbar-thumb {
  background: ${darkMode ? "#475569" : "#cbd5e1"};
  border-radius: 3px;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${
    darkMode ? "rgba(14, 165, 233, 0.3)" : "rgba(14, 165, 233, 0.2)"
  };
}

.form-row-new {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group-new {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group-new label {
  font-size: 0.875rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.optional {
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  font-weight: 400;
  font-size: 0.8rem;
}

.form-group-new input,
.form-group-new select {
  height: 48px;
  padding: 0 1rem;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 12px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#0f172a"};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;
}

.form-group-new input:focus,
.form-group-new select:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
  transform: translateY(-1px);
}

.form-group-new input.error,
.form-group-new select.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

.error-text {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Password Requirements */
.password-requirements {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(241, 245, 249, 0.8)"
  };
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.5)" : "rgba(203, 213, 225, 0.8)"
  };
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.75rem;
}

.password-requirements p {
  font-size: 0.8rem;
  font-weight: 600;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0 0 0.5rem 0;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-requirements li {
  font-size: 0.75rem;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  padding: 0.25rem 0;
  padding-left: 1rem;
  position: relative;
}

.password-requirements li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #0ea5e9;
  font-weight: bold;
}

/* Modal Actions */
.modal-actions-new {
  padding: 1.5rem 2rem 2rem;
  border-top: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
  postion: sticky;
  bottom: 0;
  z-index: 10;
  justify-content: flex-end;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.2)" : "rgba(248, 250, 252, 0.5)"
  };
}

.cancel-btn-new,
.submit-btn-new {
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 48px;
}

.cancel-btn-new {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(241, 245, 249, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#475569"};
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.8)"
  };
}

.cancel-btn-new:hover {
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.9)" : "rgba(226, 232, 240, 0.9)"
  };
  transform: translateY(-1px);
}

.submit-btn-new {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.submit-btn-new:hover:not(:disabled) {
  background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

.submit-btn-new:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Spinner */
.spinner-small {
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

/* Loading States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  border-top: 4px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-container p {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 0.875rem;
  font-weight: 500;
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  background: ${
    darkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)"
  };
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* ===== MOBILE RESPONSIVE STYLES ===== */

/* Tablet - 1024px and below */
@media (max-width: 1024px) {
  .user-management-header {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: stretch;
    gap: 1rem;
  }
  
  .export-btn, .add-user-btn {
    flex: 1;
    justify-content: center;
  }
  
  .user-stats {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .filter-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
}

/* Mobile Large - 768px and below */
@media (max-width: 768px) {
  .header-actions-fixed {
    position: relative;
    top: auto;
    right: auto;
    justify-content: stretch;
    margin: 1rem 0;
    animation: fadeInDown 0.6s ease-out 0.2s both;
  }
  
  .export-btn,
  .add-user-btn {
    flex: 1;
    justify-content: center;
  }

  .content-title {
    font-size: 2rem;
  }
  
  .content-subtitle {
    font-size: 1rem;
  }
  
  .user-controls {
    padding: 1rem;
  }
  
  .search-input-container {
    max-width: 100%;
  }
  
  .user-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .stat-item {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .users-table-container {
    border-radius: 12px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .users-table {
    min-width: 700px;
    font-size: 0.875rem;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .user-avatar-small {
    width: 40px;
    height: 40px;
  }
  
  .modal-overlay-new {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
  
  .user-modal-new {
    max-height: calc(100vh - 4rem);
    border-radius: 16px;
  }
  
  .modal-header-new {
    padding: 1.5rem;
  }
  
  .form-body-new {
    padding: 1.5rem;
    max-height: calc(100vh - 220px);
  }
  
  .form-row-new {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .modal-actions-new {
    padding: 1rem 1.5rem;
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .cancel-btn-new,
  .submit-btn-new {
    width: 100%;
    justify-content: center;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Mobile Medium - 480px and below */
@media (max-width: 480px) {
  .header-actions-fixed {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .export-btn,
  .add-user-btn {
    width: 100%;
  }

  .user-management-header {
    padding: 1.5rem 0 1rem;
  }
  
  .content-title {
    font-size: 1.75rem;
  }
  
  .content-subtitle {
    font-size: 0.9rem;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .export-btn, .add-user-btn {
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
  }
  
  // .user-stats {
  //   grid-template-columns: 1fr;
  //   gap: 0.5rem;
  // }
  
  // .stat-item {
  //   padding: 0.875rem;
  //   flex-direction: row;
  //   text-align: left;
  //   align-items: center;
  //   gap: 1rem;
  // }
  
  // .stat-number {
  //   font-size: 1.5rem;
  //   margin-bottom: 0;
  // }
  
  // .stat-label {
  //   font-size: 0.8rem;
  // }
  
  // .users-table {
  //   min-width: 600px;
  //   font-size: 0.8rem;
  // }
  
  .users-table th,
  .users-table td {
    padding: 0.625rem 0.375rem;
  }
  
  .user-avatar-small {
    width: 36px;
    height: 36px;
  }
  
  .avatar-initials {
    font-size: 0.75rem;
  }
  
  .user-full-name {
    font-size: 0.85rem;
  }
  
  .user-id {
    font-size: 0.7rem;
  }
  
  .username-cell {
    font-size: 0.8rem;
  }
  
  .role-badge-new,
  .status-badge {
    padding: 0.25rem 0.625rem;
    font-size: 0.7rem;
  }
  
  .action-buttons-new {
    gap: 0.375rem;
  }
  
  .action-btn-new {
    width: 32px;
    height: 32px;
  }
  
  .user-modal-new {
    border-radius: 12px;
  }
  
  .modal-header-new {
    padding: 1rem;
  }
  
  .modal-title-section h3 {
    font-size: 1.25rem;
  }
  
  .modal-title-section p {
    font-size: 0.8rem;
  }
  
  .form-body-new {
    padding: 1rem;
  }
  
  .form-group-new input,
  .form-group-new select {
    height: 44px;
    padding: 0 0.875rem;
    font-size: 0.875rem;
  }
  
  .form-group-new label {
    font-size: 0.8rem;
  }
  
  .password-requirements {
    padding: 0.75rem;
  }
  
  .password-requirements p {
    font-size: 0.75rem;
  }
  
  .password-requirements li {
    font-size: 0.7rem;
  }
  
  .modal-actions-new {
    padding: 1rem;
  }
  
  .cancel-btn-new,
  .submit-btn-new {
    padding: 1rem;
    font-size: 0.875rem;
  }
  
  .pagination-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    min-width: 36px;
  }
}

/* Mobile Small - 375px and below */
@media (max-width: 375px) {
  .content-title {
    font-size: 1.5rem;
  }
  
  .user-controls {
    padding: 0.75rem;
  }
  
  .search-input {
    height: 44px;
    padding: 0 0.875rem 0 2.75rem;
    font-size: 0.875rem;
  }
  
  .user-search-icon {
    left: 0.5rem;

  }
  
  .filter-selects {
    height: 44px;
    padding: 0 0.875rem;
    font-size: 0.875rem;
  }
  
  .users-table {
    min-width: 550px;
  }
  
  .no-users-found {
    padding: 3rem 1rem;
  }
  
  .no-users-found svg {
    width: 40px;
    height: 40px;
  }
  
  .no-users-found h3 {
    font-size: 1.125rem;
  }
  
  .no-users-found p {
    font-size: 0.8rem;
  }
}

/* Extra Mobile Adjustments */
@media (max-width: 320px) {
  .user-management-header {
    padding: 1rem 0 0.75rem;
  }
  
  .content-title {
    font-size: 1.375rem;
  }
  
  .content-subtitle {
    font-size: 0.85rem;
  }
  
  .user-stats {
    gap: 0.375rem;
  }
  
  .stat-item {
    padding: 0.75rem;
  }
  
  .users-table {
    min-width: 500px;
    font-size: 0.75rem;
  }
  
  .modal-title-section h3 {
    font-size: 1.125rem;
  }
  
  .form-group-new input,
  .form-group-new select {
    height: 42px;
    font-size: 0.8rem;
  }
}

/* Landscape Mobile Adjustments */
@media (max-height: 500px) and (orientation: landscape) {
  .modal-overlay-new {
    padding: 0.25rem;
    align-items: center;
  }
  
  .user-modal-new {
    max-height: 95vh;
  }
  
  .form-body-new {
    max-height: calc(95vh - 140px);
  }
  
  .user-management-header {
    padding: 1rem 0 0.75rem;
  }
}

/* Touch-friendly adjustments */
@media (pointer: coarse) {
  .action-btn-new,
  .pagination-btn,
  .export-btn,
  .add-user-btn {
    min-height: 44px;
    min-width: 44px;
  }
  
  .user-full-name {
    padding: 0.25rem 0;
    margin: -0.25rem 0;
  }
  
  .close-btn-new {
    min-width: 44px;
    min-height: 44px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .user-management-header,
  .user-controls,
  .users-table-container,
  .user-modal-new {
    border-width: 2px;
  }
  
  .role-badge-new,
  .status-badge {
    border: 1px solid currentColor;
  }
}

@media (max-width: 1200px) {
  .header-actions-fixed {
    right: 1.5rem;
  }
}


/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .stat-item:hover,
  .user-row:hover,
  .action-btn-new:hover {
    transform: none;
  }
}

@media (min-width: 769px) {
  .header-actions-fixed {
    margin-left: 40px;
    right: ${sidebarOpen ? "2rem" : "2rem"}; /* Keep consistent positioning */
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@media (min-width: 769px) {
  margin-left: 40px;
  .user-controls {
    margin-top: 0.5rem; /* Add small margin to account for fixed buttons */
  }
}





















// Add these responsive styles for AddImage component:

/* ================================
   ADD IMAGE COMPONENT - RESPONSIVE
   ================================ */

.add-image-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)"
  };
}

/* Empty State - Initial Upload Section */
.upload-section-empty {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 2rem auto;
}

.file-upload-area {
  border: 3px dashed ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
  };
  backdrop-filter: blur(10px);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.file-upload-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(14, 165, 233, 0.05) 50%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.file-upload-area:hover::before,
.file-upload-area.drag-active::before {
  opacity: 1;
}

.file-upload-area.drag-active {
  border-color: #0ea5e9;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(14, 165, 233, 0.1) 0%, rgba(30, 41, 59, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(14, 165, 233, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)"
  };
  transform: scale(1.02);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  z-index: 2;
  position: relative;
}

.upload-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.upload-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 0.5rem;
}

.upload-text p {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
}

.upload-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.upload-button.primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
}

.upload-button.primary:hover {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.upload-button.secondary {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
}

.upload-button.secondary:hover {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(71, 85, 105, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)"
  };
  transform: translateY(-2px);
}

.controls-section-empty {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.intensity-control {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.intensity-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
}

.intensity-select {
  padding: 0.875rem 1rem;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 10px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.intensity-select:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
}

/* Content Section - When Images Are Loaded */
.add-image-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Top Controls Bar */
.top-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.controls-left {
  flex: 1;
  min-width: 0;
}

.intensity-control-compact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.intensity-label-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
  flex-shrink: 0;
}

.label-text {
  white-space: nowrap;
}

.intensity-select-compact {
  padding: 0.625rem 0.875rem;
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 8px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  min-width: 140px;
}

.intensity-select-compact:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.controls-right {
  flex-shrink: 0;
}

.process-buttons-compact {
  display: flex;
  gap: 0.75rem;
}

.process-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  white-space: nowrap;
}

.process-button.primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.2);
}

.process-button.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
}

.process-button.secondary {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
}

.process-button.secondary:hover:not(:disabled) {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(71, 85, 105, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)"
  };
  transform: translateY(-1px);
}

.process-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Gallery Section */
.gallery-section {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.gallery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.gallery-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
}

.gallery-header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(241, 245, 249, 0.8)"
  };
  border-radius: 8px;
  padding: 0.25rem;
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
}

.view-toggle-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-toggle-btn.active {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.gallery-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 36px;
}

.action-button.download-all {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.action-button.download-all:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.action-button.clear {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)"
      : "linear-gradient(135deg, rgba(248, 113, 113, 0.9) 0%, rgba(239, 68, 68, 0.9) 100%)"
  };
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.action-button.clear:hover {
  background: linear-gradient(135deg, rgba(220, 38, 38, 1) 0%, rgba(185, 28, 28, 1) 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Image Gallery Grid/List */
.image-gallery {
  display: grid;
  gap: 1.25rem;
}

.image-gallery.grid {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.image-gallery.list {
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.gallery-item {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 100%)"
  };
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.5)"
  };
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(14, 165, 233, 0.5);
}

.gallery-item.active {
  border-color: #0ea5e9;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(14, 165, 233, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)"
      : "linear-gradient(145deg, rgba(14, 165, 233, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%)"
  };
  box-shadow: 0 0 0 1px rgba(14, 165, 233, 0.3), 0 8px 25px rgba(14, 165, 233, 0.2);
}

.gallery-item.processed {
  border-color: rgba(16, 185, 129, 0.6);
}

.gallery-item.error {
  border-color: rgba(239, 68, 68, 0.6);
}

.item-thumbnail {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.list .item-thumbnail {
  aspect-ratio: 16/9;
  max-height: 120px;
}

.item-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover .item-thumbnail img {
  transform: scale(1.05);
}

.thumbnail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.5rem;
}

.gallery-item:hover .thumbnail-overlay {
  opacity: 1;
}

.statuss-badge {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.statuss-badge.processed {
  background: #10b981;
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

.statuss-badge.error {
  background: #ef4444;
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.remove-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.item-info {
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filename {
  font-size: 0.8rem;
  font-weight: 600;
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.crop-count {
  font-size: 0.7rem;
  color: #10b981;
  font-weight: 500;
}

.error-text {
  font-size: 0.7rem;
  color: #ef4444;
  font-weight: 500;
}

/* List View Specific Styles */
.image-gallery.list .gallery-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
}

.image-gallery.list .item-thumbnail {
  width: 120px;
  height: 80px;
  flex-shrink: 0;
}

.image-gallery.list .item-info {
  padding: 0;
  flex: 1;
}

/* Crops Section */
.crops-section {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.crops-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.crops-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
}

.method-tag {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.crops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}

.crop-card {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.5)"
  };
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}

.crop-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(14, 165, 233, 0.5);
}

.crop-image-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.crop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.crop-card:hover .crop-image {
  transform: scale(1.05);
}

.crop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.crop-card:hover .crop-overlay {
  opacity: 1;
}

.download-crop-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.download-crop-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.crop-info {
  padding: 0.875rem;
  text-align: center;
}

.crop-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#475569"};
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.loading-content {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid ${
    darkMode ? "rgba(71, 85, 105, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  border-top: 4px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin-bottom: 0.5rem;
}

.loading-subtext {
  font-size: 0.85rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin-bottom: 1.5rem;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.3)" : "rgba(226, 232, 240, 0.5)"
  };
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}

.hidden-input {
  display: none;
}

/* ================================
   RESPONSIVE DESIGN BREAKPOINTS
   ================================ */

/* Tablet Landscape */
@media (max-width: 1024px) {
  .add-image-container {
    padding: 1.25rem;
  }
  
  .top-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .controls-left,
  .controls-right {
    flex: none;
  }
  
  .process-buttons-compact {
    justify-content: center;
  }
  
  .intensity-control-compact {
    justify-content: center;
  }
  
  .gallery-header {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .gallery-header-actions {
    flex-wrap: wrap;
  }
  
  .crops-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

/* Tablet Portrait */
@media (max-width: 768px) {
  .add-image-container {
    padding: 1rem;
  }
  
  .file-upload-area {
    padding: 2rem 1.5rem;
  }
  
  .upload-icon {
    width: 60px;
    height: 60px;
  }
  
  .upload-text h3 {
    font-size: 1.25rem;
  }
  
  .upload-text p {
    font-size: 0.875rem;
  }
  
  .upload-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .upload-button {
    justify-content: center;
    width: 100%;
  }
  
  .top-controls {
    padding: 1rem;
  }
  
  .intensity-control-compact {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .intensity-label-compact {
    justify-content: center;
  }
  
  .intensity-select-compact {
    min-width: auto;
  }
  
  .process-buttons-compact {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .process-button {
    justify-content: center;
    width: 100%;
  }
  
  .btn-text {
    display: none;
  }
  
  .gallery-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .gallery-header-actions {
    justify-content: space-between;
    align-items: center;
  }
  
  .action-text {
    display: none;
  }
  
  .image-gallery.grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .image-gallery.list .gallery-item {
    flex-direction: column;
    text-align: center;
  }
  
  .image-gallery.list .item-thumbnail {
    width: 100%;
    max-height: 120px;
  }
  
  .crops-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  .crops-header {
    flex-direction: column;
    text-align: center;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .add-image-container {
    padding: 0.75rem;
  }
  
  .upload-section-empty {
    gap: 1.5rem;
    margin: 1rem auto;
  }
  
  .file-upload-area {
    padding: 1.5rem 1rem;
  }
  
  .upload-icon {
    width: 50px;
    height: 50px;
  }
  
  .upload-text h3 {
    font-size: 1.1rem;
  }
  
  .upload-text p {
    font-size: 0.8rem;
  }
  
  .upload-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    gap: 0.5rem;
  }
  
  .controls-section-empty,
  .gallery-section,
  .crops-section {
    padding: 1rem;
  }
  
  .top-controls {
    padding: 0.875rem;
  }
  
  .intensity-select-compact {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
  
  .process-button {
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
    min-height: 40px;
  }
  
  .process-button .btn-text {
    display: inline;
  }
  
  .gallery-title,
  .crops-title {
    font-size: 1rem;
  }
  
  .view-toggle-btn {
    padding: 0.375rem;
  }
  
  .action-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 32px;
  }
  
  .action-button .action-text {
    display: inline;
  }
  
  .image-gallery.grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .crops-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
  
  .loading-content {
    padding: 2rem 1.5rem;
  }
  
  .loading-text {
    font-size: 1rem;
  }
  
  .loading-subtext {
    font-size: 0.8rem;
  }
}

/* Small Mobile */
@media (max-width: 375px) {
  .add-image-container {
    padding: 0.5rem;
  }
  
  .file-upload-area {
    padding: 1.25rem 0.75rem;
  }
  
  .upload-text h3 {
    font-size: 1rem;
  }
  
  .upload-text p {
    font-size: 0.75rem;
  }
  
  .upload-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }
  
  .image-gallery.grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .crops-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .process-button {
    font-size: 0.75rem;
    padding: 0.5rem 0.875rem;
  }
  
  .action-button {
    font-size: 0.7rem;
    padding: 0.375rem 0.625rem;
  }
}

/* Landscape Mobile Orientation */
@media (max-height: 500px) and (orientation: landscape) {
  .file-upload-area {
    padding: 1rem;
  }
  
  .upload-content {
    gap: 1rem;
  }
  
  .upload-icon {
    width: 40px;
    height: 40px;
  }
  
  .upload-text h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  .upload-text p {
    font-size: 0.8rem;
  }
  
  .upload-buttons {
    flex-direction: row;
    margin-top: 0.5rem;
  }
  
  .loading-content {
    padding: 1.5rem;
  }
  
  .loading-spinner {
    width: 36px;
    height: 36px;
    margin-bottom: 1rem;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .file-upload-area,
  .gallery-item,
  .crop-card {
    border-width: 3px;
  }
  
  .process-button,
  .action-button,
  .upload-button {
    border: 2px solid currentColor;
  }
}

/* Reduced Motion Preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .upload-icon {
    animation: none;
  }
  
  .spinning {
    animation: none;
  }
  
  .loading-spinner {
    animation: none;
    border-top-color: transparent;
  }
}

/* Print Styles */
@media print {
  .add-image-container {
    background: white;
    box-shadow: none;
  }
  
  .top-controls,
  .gallery-actions,
  .loading-overlay {
    display: none;
  }
  
  .image-gallery.grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
































// Add these responsive styles for GenerateReport component:

/* ================================
   GENERATE REPORT COMPONENT - RESPONSIVE
   ================================ */

.report-generation-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)"
  };
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header Section */
.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: ${
    darkMode
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.08)"
  };
  animation: slideInDown 0.6s ease-out;
}

.report-header-text {
  flex: 1;
  min-width: 0;
}

.report-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
  margin: 0;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.report-subtitle {
  font-size: 0.95rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  line-height: 1.5;
}

.report-header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-shrink: 0;
}

.report-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 44px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.report-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.report-action-btn:hover:not(.disabled)::before {
  left: 100%;
}

.report-action-btn.primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
}

.report-action-btn.primary:hover:not(.disabled) {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

.report-action-btn.secondary {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.report-action-btn.secondary:hover:not(.disabled) {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(71, 85, 105, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)"
  };
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.report-action-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.report-action-btn.disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Report Type Tabs */
.report-tabs {
  display: flex;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  border-radius: 16px;
  padding: 0.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: slideInUp 0.6s ease-out 0.1s both;
}

.report-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  justify-content: center;
  min-height: 48px;
  position: relative;
  overflow: hidden;
}

.report-tab-btn::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.report-tab-btn:hover {
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(241, 245, 249, 0.8)"
  };
}

.report-tab-btn.active {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
  transform: translateY(-2px);
}

.report-tab-btn.active::before {
  width: 80%;
}

/* Main Content Layout */
.report-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  flex: 1;
  min-height: 0;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* Sidebar - Filters */
.report-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.report-filters {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.report-filters h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
  margin-bottom: 0.25rem;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 10px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;
}

.filter-input:focus,
.filter-select:focus {
  border-color: #0ea5e9;
  background: ${darkMode ? "rgba(15, 23, 42, 0.95)" : "white"};
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
  transform: translateY(-1px);
}

.filter-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${
    darkMode ? "%236b7280" : "%239ca3af"
  }' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem;
  padding-right: 3rem;
}

.filter-actions {
  margin-top: 1rem;
}

.generate-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
  min-height: 48px;
}

.generate-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Main Report Display */
.report-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 0;
  overflow: auto;
}

/* Report Summary */
.report-summary {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.report-summary h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.25rem;
}

.summary-card {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.4)"
  };
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.summary-card:hover::before {
  transform: scaleX(1);
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(14, 165, 233, 0.3);
}

.summary-value {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Report Table */
.report-table-container {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: auto;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.report-table th {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  font-weight: 600;
  text-align: left;
  padding: 1rem 0.75rem;
  border-bottom: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)"
  };
  position: sticky;
  top: 0;
  z-index: 1;
}

.report-table td {
  padding: 0.875rem 0.75rem;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  vertical-align: middle;
}

.report-table tr:hover {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.2)" : "rgba(248, 250, 252, 0.5)"
  };
}

/* Badge Styles */
.role-badge,
.status-badge,
.activity-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.admin {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.role-badge.guest {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-badge.approved {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.activity-badge {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

/* Empty States */
.report-empty-state,
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
  animation: pulse 2s infinite;
}

.report-empty-state h3,
.no-data h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 0.75rem;
}

.report-empty-state p,
.no-data p {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 0.95rem;
  margin: 0;
  max-width: 400px;
  line-height: 1.6;
}

/* Animations */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ================================
   RESPONSIVE DESIGN BREAKPOINTS
   ================================ */

/* Large Desktop */
@media (max-width: 1200px) {
  .report-generation-container {
    padding: 1.25rem;
  }
  
  .report-content {
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }
  
  .summary-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

/* Tablet Landscape */
@media (max-width: 1024px) {
  .report-generation-container {
    padding: 1rem;
  }
  
  .report-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    text-align: center;
    padding: 1.5rem;
  }
  
  .report-header-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .report-title {
    font-size: 1.5rem;
  }
  
  .report-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .report-sidebar {
    order: 2;
  }
  
  .report-main {
    order: 1;
  }
  
  .filter-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .summary-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
  }
  
  .summary-card {
    padding: 1.25rem;
  }
  
  .summary-value {
    font-size: 1.75rem;
  }
}

/* Tablet Portrait */
@media (max-width: 768px) {
  .report-generation-container {
    padding: 0.875rem;
    gap: 1.25rem;
  }
  
  .report-header {
    padding: 1.25rem;
  }
  
  .report-title {
    font-size: 1.35rem;
  }
  
  .report-subtitle {
    font-size: 0.875rem;
  }
  
  .report-action-btn {
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
  }
  
  .btn-text {
    display: none;
  }
  
  .report-tabs {
    padding: 0.375rem;
  }
  
  .report-tab-btn {
    padding: 0.875rem 1rem;
    font-size: 0.8rem;
    gap: 0.5rem;
  }
  
  .tab-text {
    display: none;
  }
  
  .report-filters,
  .report-summary,
  .report-table-container {
    padding: 1.25rem;
  }
  
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  }
  
  .summary-card {
    padding: 1rem;
  }
  
  .summary-value {
    font-size: 1.5rem;
  }
  
  .summary-label {
    font-size: 0.7rem;
  }
  
  .report-table-container {
    overflow-x: auto;
  }
  
  .report-table {
    min-width: 600px;
    font-size: 0.8rem;
  }
  
  .report-table th,
  .report-table td {
    padding: 0.75rem 0.5rem;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .report-generation-container {
    padding: 0.75rem;
    gap: 1rem;
  }
  
  .report-header {
    padding: 1rem;
  }
  
  .report-title {
    font-size: 1.2rem;
  }
  
  .report-subtitle {
    font-size: 0.8rem;
  }
  
  .report-action-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
    min-height: 40px;
  }
  
  .report-tabs {
    padding: 0.25rem;
  }
  
  .report-tab-btn {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
    min-height: 44px;
  }
  
  .report-filters,
  .report-summary,
  .report-table-container {
    padding: 1rem;
  }
  
  .report-filters h3,
  .report-summary h3 {
    font-size: 1rem;
  }
  
  .generate-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.85rem;
  }
  
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }
  
  .summary-card {
    padding: 0.875rem;
  }
  
  .summary-value {
    font-size: 1.25rem;
  }
  
  .summary-label {
    font-size: 0.65rem;
  }
  
  .report-table {
    font-size: 0.75rem;
  }
  
  .report-table th,
  .report-table td {
    padding: 0.625rem 0.375rem;
  }
  
  .role-badge,
  .status-badge,
  .activity-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
}

/* Small Mobile */
@media (max-width: 375px) {
  .report-generation-container {
    padding: 0.5rem;
  }
  
  .report-header {
    padding: 0.875rem;
  }
  
  .report-title {
    font-size: 1.1rem;
  }
  
  .report-action-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.7rem;
  }
  
  .report-tab-btn {
    padding: 0.625rem 0.375rem;
  }
  
  .filter-input,
  .filter-select {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }
  
  .generate-btn {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .report-table {
    min-width: 500px;
    font-size: 0.7rem;
  }
}

/* Landscape Mobile Orientation */
@media (max-height: 500px) and (orientation: landscape) {
  .report-header {
    padding: 1rem;
  }
  
  .report-title {
    font-size: 1.25rem;
  }
  
  .report-empty-state,
  .no-data {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .report-action-btn,
  .report-tab-btn,
  .filter-input,
  .filter-select,
  .generate-btn {
    border-width: 2px;
  }
  
  .report-table th,
  .report-table td {
    border-width: 2px;
  }
}

/* Reduced Motion Preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .spinner-small {
    animation: none;
    border-top-color: transparent;
  }
  
  .empty-icon {
    animation: none;
  }
}

/* Print Styles */
@media print {
  .report-generation-container {
    background: white;
    box-shadow: none;
  }
  
  .report-header-actions,
  .report-tabs,
  .filter-actions {
    display: none;
  }
  
  .report-content {
    grid-template-columns: 1fr;
  }
  
  .report-sidebar {
    display: none;
  }
  
  .report-table {
    font-size: 0.8rem;
  }
  
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Focus Styles for Accessibility */
.report-action-btn:focus,
.report-tab-btn:focus,
.filter-input:focus,
.filter-select:focus,
.generate-btn:focus {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

/* Touch Targets for Mobile */
@media (max-width: 768px) {
  .report-action-btn,
  .report-tab-btn,
  .generate-btn {
    min-height: 44px;
    min-width: 44px;
  }
}





















/* ================================
   CORAL MANAGEMENT COMPONENT - RESPONSIVE
   ================================ */

.coral-management-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)"
  };
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header Section */
.coral-management-header {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: ${
    darkMode
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.08)"
  };
  animation: slideInDown 0.6s ease-out;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.header-text {
  flex: 1;
  min-width: 0;
}

.coral-management-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  font-weight: 800;
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
  margin: 0;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.coral-management-subtitle {
  font-size: 1rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  line-height: 1.6;
}

.header-actions {
  flex-shrink: 0;
}

.add-coral-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.add-coral-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.add-coral-btn:hover::before {
  left: 100%;
}

.add-coral-btn.primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
}

.add-coral-btn.primary:hover {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

.add-coral-btn.large {
  padding: 1.125rem 2rem;
  font-size: 1rem;
  min-height: 56px;
}

/* Statistics Bar */
.coral-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-item {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.4)"
  };
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-item:hover::before {
  transform: scaleX(1);
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: rgba(14, 165, 233, 0.3);
}

.stat-number {
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Grid Container & Empty State */
.coral-grid-container {
  flex: 1;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.coral-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 2px dashed ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.empty-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.coral-empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 1rem;
}

.coral-empty-state p {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 1rem;
  margin: 0;
  margin-bottom: 2rem;
  max-width: 400px;
  line-height: 1.6;
}

/* Coral Grid */
.coral-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.coral-card {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.coral-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  border-color: rgba(14, 165, 233, 0.4);
}

.coral-card-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.coral-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.coral-card:hover .coral-card-image img {
  transform: scale(1.1);
}

.coral-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.coral-card:hover .coral-card-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 0.75rem;
}

.overlay-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.overlay-btn.view {
  background: rgba(14, 165, 233, 0.9);
  color: white;
}

.overlay-btn.edit {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.overlay-btn.delete {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.overlay-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Card Content */
.coral-card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.coral-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.coral-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.classification-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.classification-badge.hard-coral {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.classification-badge.soft-coral {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.classification-badge.large {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.coral-card-scientific {
  font-style: italic;
  font-size: 0.9rem;
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  margin: 0;
  border-left: 3px solid #0ea5e9;
  padding-left: 0.75rem;
}

.coral-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.info-label {
  font-weight: 600;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  min-width: 60px;
}

.info-value {
  color: ${darkMode ? "#cbd5e1" : "#475569"};
}

.coral-card-description {
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)"
  };
  border-radius: 8px;
  padding: 0.875rem;
  border-left: 3px solid #0ea5e9;
}

.coral-card-description p {
  font-size: 0.85rem;
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  line-height: 1.5;
  margin: 0;
}

.coral-card-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
}

.card-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

.card-action-btn.primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
}

.card-action-btn.secondary {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(248, 250, 252, 0.8)"
  };
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
}

.card-action-btn:hover {
  transform: translateY(-2px);
}

.card-action-btn.primary:hover {
  box-shadow: 0 6px 15px rgba(14, 165, 233, 0.4);
}

.card-action-btn.secondary:hover {
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(241, 245, 249, 0.9)"
  };
}

/* Modal Styles */
.coral-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.coral-modal {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease-out;
}

.coral-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem 2rem 0 2rem;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  margin-bottom: 0;
}

.modal-title-section {
  flex: 1;
  min-width: 0;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  font-size: 0.9rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  margin-bottom: 1.5rem;
}

.modal-close-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: ${
    darkMode ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)"
  };
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
}

.coral-modal-body {
  padding: 2rem;
  max-height: calc(90vh - 160px);
  overflow-y: auto;
}

/* Modal View Mode */
.coral-view {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.coral-view-image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 1;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(248, 250, 252, 0.8)"
  };
}

.coral-view-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.coral-view-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  flex: 1;
}

.scientific-name {
  font-style: italic;
  font-size: 1.1rem;
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  margin: 0;
  padding-left: 1rem;
  border-left: 3px solid #0ea5e9;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)"
  };
  border-radius: 10px;
  padding: 1rem;
  border-left: 3px solid #0ea5e9;
}

.detail-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
}

.identification-section {
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)"
  };
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
  margin: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border-radius: 2px;
}

.identification-content p {
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  line-height: 1.7;
  margin: 0;
}

/* Form Styles */
.coral-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.5)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  border-radius: 16px;
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.optional {
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  font-weight: 400;
  font-size: 0.8rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 10px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #0ea5e9;
  background: ${darkMode ? "rgba(15, 23, 42, 0.95)" : "white"};
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
  transform: translateY(-1px);
}

.form-input.scientific {
  font-style: italic;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${
    darkMode ? "%236b7280" : "%239ca3af"
  }' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem;
  padding-right: 3rem;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.6;
}

.character-count {
  font-size: 0.75rem;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
  text-align: right;
  margin-top: 0.25rem;
}

/* Image Upload */
.image-upload-area {
  position: relative;
}

.file-input {
  display: none;
}

.file-upload-label {
  display: block;
  border: 2px dashed ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.5)"
  };
}

.file-upload-label:hover {
  border-color: #0ea5e9;
  background: ${
    darkMode ? "rgba(14, 165, 233, 0.05)" : "rgba(14, 165, 233, 0.02)"
  };
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.upload-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
}

.upload-hint {
  font-size: 0.75rem;
  color: ${darkMode ? "#64748b" : "#94a3b8"};
}

.image-preview {
  margin-top: 1rem;
  position: relative;
  max-width: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

/* Modal Actions */
.coral-modal-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  justify-content: flex-end;
}

.modal-action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;
  min-width: 120px;
  justify-content: center;
}

.modal-action-btn.cancel {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(248, 250, 252, 0.9)"
  };
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
}

.modal-action-btn.cancel:hover {
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.7)" : "rgba(241, 245, 249, 0.95)"
  };
  transform: translateY(-2px);
}

.modal-action-btn.submit {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.modal-action-btn.submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.modal-action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animations */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ================================
   RESPONSIVE DESIGN BREAKPOINTS
   ================================ */

/* Large Desktop */
@media (max-width: 1200px) {
  .coral-management-container {
    padding: 1.5rem;
  }
  
  .coral-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
  
  .coral-modal {
    max-width: 800px;
  }
}

/* Tablet Landscape */
@media (max-width: 1024px) {
  .coral-management-container {
    padding: 1.25rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    text-align: center;
  }
  
  .coral-management-title {
    font-size: 1.75rem;
    justify-content: center;
  }
  
  .coral-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  .coral-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
  }
  
  .coral-view {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .coral-view-image {
    max-width: 300px;
    margin: 0 auto;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}

/* Tablet Portrait */
@media (max-width: 768px) {
  .coral-management-container {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .coral-management-header {
    padding: 1.5rem;
  }
  
  .coral-management-title {
    font-size: 1.5rem;
    gap: 0.75rem;
  }
  
  .coral-management-subtitle {
    font-size: 0.9rem;
  }
  
  .btn-text {
    display: none;
  }
  
  .add-coral-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
  }
  
  .coral-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-item {
    padding: 1.25rem 1rem;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .coral-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  .coral-card-image {
    height: 200px;
  }
  
  .coral-card-content {
    padding: 1.25rem;
  }
  
  .coral-card-title {
    font-size: 1rem;
  }
  
  .overlay-actions {
    gap: 0.5rem;
  }
  
  .overlay-btn {
    width: 40px;
    height: 40px;
  }
  
  .coral-modal {
    max-width: 95vw;
    margin: 1rem;
  }
  
  .coral-modal-header {
    padding: 1.5rem 1.5rem 0 1.5rem;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .coral-modal-body {
    padding: 1.5rem;
  }
  
  .form-section {
    padding: 1.25rem;
  }
  
  .file-upload-label {
    padding: 1.5rem;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .coral-management-container {
    padding: 0.875rem;
    gap: 1.25rem;
  }
  
  .coral-management-header {
    padding: 1.25rem;
  }
  
  .coral-management-title {
    font-size: 1.35rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .coral-management-subtitle {
    font-size: 0.85rem;
  }
  
  .add-coral-btn {
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
  }
  
  .coral-stats {
    grid-template-columns: 1fr 1fr;
    gap: 0.875rem;
  }
  
  .stat-item {
    padding: 1rem 0.875rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
  
  .coral-empty-state {
    padding: 3rem 1.5rem;
  }
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 1.5rem;
  }
  
  .coral-empty-state h3 {
    font-size: 1.25rem;
  }
  
  .coral-empty-state p {
    font-size: 0.9rem;
  }
  
  .coral-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .coral-card-image {
    height: 180px;
  }
  
  .coral-card-content {
    padding: 1rem;
  }
  
  .coral-card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .classification-badge {
    align-self: flex-start;
  }
  
  .coral-card-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .card-action-btn {
    width: 100%;
  }
  
  .coral-modal {
    max-height: 95vh;
    border-radius: 16px;
  }
  
  .coral-modal-header {
    padding: 1.25rem;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    text-align: center;
  }
  
  .modal-close-btn {
    align-self: center;
  }
  
  .modal-title {
    font-size: 1.1rem;
    justify-content: center;
  }
  
  .modal-subtitle {
    font-size: 0.85rem;
  }
  
  .coral-modal-body {
    padding: 1.25rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 0.9rem;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.75rem 0.875rem;
    font-size: 0.8rem;
  }
  
  .form-textarea {
    min-height: 100px;
  }
  
  .file-upload-label {
    padding: 1.25rem;
  }
  
  .upload-text {
    font-size: 0.85rem;
  }
  
  .upload-hint {
    font-size: 0.7rem;
  }
  
  .coral-modal-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .modal-action-btn {
    width: 100%;
    padding: 0.875rem 1.25rem;
    font-size: 0.85rem;
  }
}

/* Small Mobile */
@media (max-width: 375px) {
  .coral-management-container {
    padding: 0.75rem;
  }
  
  .coral-management-title {
    font-size: 1.2rem;
  }
  
  .coral-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-number {
    font-size: 1.35rem;
  }
  
  .coral-card-image {
    height: 160px;
  }
  
  .coral-card-content {
    padding: 0.875rem;
  }
  
  .coral-card-title {
    font-size: 0.95rem;
  }
  
  .modal-title {
    font-size: 1rem;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
  }
  .form-textarea {
    min-height: 80px;
  }
  .file-upload-label {
    padding: 1rem;
  }
  .upload-text {
    font-size: 0.8rem;
  }
  .upload-hint {
    font-size: 0.65rem;
  }
  .modal-action-btn {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
    min-height: 40px;
    min-width: 100%;
  }
}









// Add these responsive styles for ProfileManagement component:

/* ================================
   PROFILE MANAGEMENT COMPONENT - RESPONSIVE
   ================================ */

.modern-profile-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)"
  };
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Hero Section */
.profile-hero-section {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: ${
    darkMode
      ? "0 12px 40px rgba(0, 0, 0, 0.4)"
      : "0 12px 40px rgba(0, 0, 0, 0.1)"
  };
  animation: slideInDown 0.8s ease-out;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(14, 165, 233, 0.1) 0%,
    rgba(59, 130, 246, 0.05) 50%,
    rgba(16, 185, 129, 0.1) 100%
  );
  opacity: 0.8;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  bottom: 15%;
  left: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2.5rem;
}

.profile-header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.modern-edit-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
  position: relative;
  overflow: hidden;
}

.modern-edit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.modern-edit-btn:hover::before {
  left: 100%;
}

.modern-edit-btn:hover {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

/* Profile Main Info */
.profile-main-info {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.profile-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
}

.profile-avatar-modern {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  position: relative;
  box-shadow: 0 8px 30px rgba(14, 165, 233, 0.3);
  transition: all 0.3s ease;
}

.profile-avatar-modern:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(14, 165, 233, 0.4);
}

.profile-avatar-modern img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback-modern {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}

.avatar-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${darkMode ? "#1e293b" : "white"};
  border: 2px solid ${darkMode ? "#334155" : "#e2e8f0"};
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
}

.role-indicator {
  display: flex;
  justify-content: center;
}

.modern-role-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-role-badge.admin {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.modern-role-badge.guest {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* Profile Text Info */
.profile-text-info {
  flex: 1;
  min-width: 0;
}

.profile-name-modern {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.profile-username-modern {
  font-size: 1.125rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  margin-bottom: 1rem;
  font-weight: 500;
}

.profile-bio-modern {
  font-size: 1rem;
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  line-height: 1.6;
  margin: 0;
  margin-bottom: 1.5rem;
  max-width: 500px;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.profile-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 0.875rem;
  font-weight: 500;
}

/* Info Grid */
.profile-info-grid {
  display: grid;
  margin-top: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.info-card {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: ${
    darkMode
      ? "0 8px 32px rgba(0, 0, 0, 0.2)"
      : "0 8px 32px rgba(0, 0, 0, 0.08)"
  };
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.info-card:hover::before {
  transform: scaleX(1);
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: ${
    darkMode
      ? "0 16px 40px rgba(0, 0, 0, 0.3)"
      : "0 16px 40px rgba(0, 0, 0, 0.12)"
  };
  border-color: rgba(14, 165, 233, 0.3);
}

/* Card Headers */
.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-icon.personal {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}

.card-icon.security {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.card-icon.membership {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.card-icon.actions {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
}

/* Card Content */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.info-row .label {
  font-size: 0.875rem;
  font-weight: 600;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  flex-shrink: 0;
}

.info-row .value {
  font-size: 0.875rem;
  font-weight: 500;
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  text-align: right;
  word-break: break-word;
}

/* Chips and Badges */
.role-chip,
.status-chip {
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-chip.admin {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.role-chip.guest {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-chip.active {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* Action Buttons */
.action-buttons-modern {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn-modern {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  position: relative;
  overflow: hidden;
}

.action-btn-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.action-btn-modern:hover::before {
  left: 100%;
}

.action-btn-modern.primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.action-btn-modern.primary:hover {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.action-btn-modern.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.action-btn-modern.danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.security-note {
  margin-top: 1rem;
  padding: 1rem;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(248, 250, 252, 0.8)"
  };
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.3)" : "rgba(226, 232, 240, 0.5)"
  };
  border-radius: 8px;
}

.security-note p {
  font-size: 0.8rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  line-height: 1.4;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

/* Delete Modal */
.delete-modal {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  padding: 2rem;
  max-width: 450px;
  width: 90%;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease-out;
}

.delete-modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.delete-warning-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.delete-modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 0.75rem;
}

.delete-modal-header p {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.delete-modal-body {
  margin-bottom: 2rem;
}

.delete-modal-body .form-group {
  margin-bottom: 1.5rem;
}

.delete-modal-body label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
  margin-bottom: 0.5rem;
}

.delete-modal-body input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 10px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  font-size: 0.875rem;
  transition: all 0.3s ease;
  outline: none;
}

.delete-modal-body input:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

.delete-modal-body input.error {
  border-color: #ef4444;
  background: ${
    darkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(254, 226, 226, 0.5)"
  };
}

.error-text {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
  display: block;
}

.delete-warning {
  background: ${
    darkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(254, 226, 226, 0.8)"
  };
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  padding: 1rem;
}

.delete-warning h4 {
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 700;
  margin: 0;
  margin-bottom: 0.75rem;
}

.delete-warning ul {
  margin: 0;
  padding-left: 1.25rem;
}

.delete-warning li {
  color: ${darkMode ? "#fca5a5" : "#dc2626"};
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.delete-modal-actions {
  display: flex;
  gap: 1rem;
}

.cancels-btn,
.delete-confirm-btn {
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;
}

.cancels-btn {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
}

.cancels-btn:hover:not(:disabled) {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(71, 85, 105, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)"
  };
  transform: translateY(-1px);
}

.delete-confirm-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.delete-confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.delete-confirm-btn:disabled,
.cancels-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Profile Edit Modal */
.profile-modal {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  max-width: 600px;
  width: 95%;
  max-height: 90vh;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

.profile-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2rem 0;
  margin-bottom: 1.5rem;
}

.profile-modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(241, 245, 249, 0.8)"
  };
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: ${
    darkMode ? "rgba(71, 85, 105, 0.8)" : "rgba(226, 232, 240, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
}

/* Modal Tabs */
.profile-modal-tabs {
  display: flex;
  padding: 0 2rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(248, 250, 252, 0.8)"
  };
}

.tab-btn.active {
  color: #0ea5e9;
  border-bottom-color: #0ea5e9;
}

/* Modal Body */
.profile-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 2rem;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: ${darkMode ? "#cbd5e1" : "#374151"};
}

.form-group input,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 2px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 10px;
  background: ${
    darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  font-size: 0.875rem;
  transition: all 0.3s ease;
  outline: none;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
}

/* Profile Image Section */
.profile-image-section {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.current-image {
  flex-shrink: 0;
}

.image-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}

.image-upload-section {
  flex: 1;
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: 2px dashed ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
  border-radius: 10px;
  background: ${
    darkMode ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.8)"
  };
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-button:hover {
  border-color: #0ea5e9;
  background: ${
    darkMode ? "rgba(14, 165, 233, 0.1)" : "rgba(14, 165, 233, 0.05)"
  };
  color: #0ea5e9;
}

.upload-hint {
  font-size: 0.8rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  line-height: 1.4;
  margin: 0;
}

/* Security Info */
.security-info {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(248, 250, 252, 0.8)"
  };
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.3)" : "rgba(226, 232, 240, 0.5)"
  };
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.security-info h4 {
  font-size: 1rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 0.5rem;
}

.security-info p {
  font-size: 0.8rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  line-height: 1.4;
}

/* Modal Actions */
.profile-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem 2rem;
  border-top: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  margin-top: 1.5rem;
}

.cancel-btn,
.save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;
  white-space: nowrap;
}

.cancel-btn {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
  };
  color: ${darkMode ? "#e2e8f0" : "#374151"};
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.6)" : "rgba(203, 213, 225, 0.6)"
  };
}

.cancel-btn:hover {
  background: ${
    darkMode
      ? "linear-gradient(135deg, rgba(71, 85, 105, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)"
  };
  transform: translateY(-1px);
}

.save-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.save-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Animations */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ================================
   RESPONSIVE DESIGN BREAKPOINTS
   ================================ */

/* Large Desktop */
@media (max-width: 1200px) {
  .modern-profile-container {
    padding: 1.25rem;
  }
  
  .profile-info-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
  }
}

/* Tablet Landscape */
@media (max-width: 1024px) {
  .modern-profile-container {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .hero-content {
    padding: 2rem;
  }
  
  .profile-main-info {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .profile-text-info {
    order: 1;
  }
  
  .profile-avatar-container {
    order: 2;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .profile-info-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
  
  .info-card {
    padding: 1.5rem;
  }
}

/* Tablet Portrait */
@media (max-width: 768px) {
  .modern-profile-container {
    padding: 0.875rem;
  }
  
  .hero-content {
    padding: 1.5rem;
  }
  
  .profile-header-actions {
    margin-bottom: 1.5rem;
  }
  
  .modern-edit-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.8rem;
    gap: 0.5rem;
  }
  
  .profile-avatar-modern {
    width: 100px;
    height: 100px;
  }
  
  .avatar-fallback-modern {
    font-size: 2rem;
  }
  
  .profile-name-modern {
    font-size: 1.875rem;
  }
  
  .profile-username-modern {
    font-size: 1rem;
  }
  
  .profile-bio-modern {
    font-size: 0.9rem;
  }
  
  .profile-stats {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .profile-info-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .info-card {
    padding: 1.25rem;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
  }
  
  .card-header h3 {
    font-size: 1rem;
  }
  
  .action-buttons-modern {
    flex-direction: row;
  }
  
  .action-btn-modern {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }
  
  .action-btn-modern span {
    display: none;
  }
  
  /* Modal Adjustments */
  .profile-modal {
    width: 98%;
    max-height: 95vh;
  }
  
  .profile-modal-header {
    padding: 1.5rem 1.5rem 0;
  }
  
  .profile-modal-header h3 {
    font-size: 1.25rem;
  }
  
  .profile-modal-tabs {
    padding: 0 1.5rem;
    overflow-x: auto;
  }
  
  .tab-btn {
    padding: 0.875rem 1rem;
    font-size: 0.8rem;
    flex-shrink: 0;
  }
  
  .profile-modal-body {
    padding: 0 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .profile-image-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }
  
  .profile-modal-actions {
    padding: 1.25rem 1.5rem;
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
    justify-content: center;
  }
  
  .delete-modal {
    width: 95%;
    padding: 1.5rem;
  }
  
  .delete-modal-actions {
    flex-direction: column;
  }
  
  .cancels-btn,
  .delete-confirm-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .modern-profile-container {
    padding: 0.75rem;
  }
  
  .hero-content {
    padding: 1.25rem;
  }
  
  .modern-edit-btn {
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
  }
  
  .profile-avatar-modern {
    width: 80px;
    height: 80px;
  }
  
  .avatar-fallback-modern {
    font-size: 1.5rem;
  }
  
  .profile-name-modern {
    font-size: 1.5rem;
  }
  
  .profile-username-modern {
    font-size: 0.9rem;
  }
  
  .profile-bio-modern {
    font-size: 0.85rem;
  }
  
  .modern-role-badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.7rem;
  }
  
  .info-card {
    padding: 1rem;
  }
  
  .card-icon {
    width: 36px;
    height: 36px;
  }
  
  .card-header {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .card-header h3 {
    font-size: 0.95rem;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .info-row .label,
  .info-row .value {
    font-size: 0.8rem;
  }
  
  .action-btn-modern {
    padding: 0.625rem 0.875rem;
    font-size: 0.75rem;
    min-height: 44px;
  }
  
  .security-note p {
    font-size: 0.75rem;
  }
  
  /* Modal Mobile */
  .profile-modal-header {
    padding: 1.25rem 1.25rem 0;
  }
  
  .profile-modal-header h3 {
    font-size: 1.1rem;
  }
  
  .profile-modal-tabs {
    padding: 0 1.25rem;
  }
  
  .tab-btn {
    padding: 0.75rem 0.875rem;
    font-size: 0.75rem;
    gap: 0.375rem;
  }
  
  .profile-modal-body {
    padding: 0 1.25rem;
  }
  
  .image-container {
    width: 100px;
    height: 100px;
  }
  
  .upload-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.8rem;
  }
  
  .form-group input,
  .form-group textarea {
    padding: 0.75rem 0.875rem;
    font-size: 0.8rem;
  }
  
  .profile-modal-actions {
    padding: 1rem 1.25rem;
  }
  
  .cancel-btn,
  .save-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.8rem;
  }
  
  .delete-modal {
    padding: 1.25rem;
  }
  
  .delete-warning-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
  
  .delete-modal-header h3 {
    font-size: 1.25rem;
  }
  
  .delete-modal-body input {
    padding: 0.75rem 0.875rem;
    font-size: 0.8rem;
  }
  
  .delete-warning {
    padding: 0.875rem;
  }
  
  .delete-warning h4 {
    font-size: 0.8rem;
  }
  
  .delete-warning li {
    font-size: 0.75rem;
  }
  
  .cancels-btn,
  .delete-confirm-btn {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }
}

/* Small Mobile */
@media (max-width: 375px) {
  .modern-profile-container {
    padding: 0.5rem;
  }
  
  .hero-content {
    padding: 1rem;
  }
  
  .profile-name-modern {
    font-size: 1.25rem;
  }
  
  .profile-avatar-modern {
    width: 70px;
    height: 70px;
  }
  
  .avatar-fallback-modern {
    font-size: 1.25rem;
  }
  
  .info-card {
    padding: 0.875rem;
  }
  
  .card-icon {
    width: 32px;
    height: 32px;
  }
  
  .action-btn-modern {
    padding: 0.5rem 0.75rem;
    font-size: 0.7rem;
  }
  
  .profile-modal-header {
    padding: 1rem 1rem 0;
  }
  
  .profile-modal-tabs {
    padding: 0 1rem;
  }
  
  .profile-modal-body {
    padding: 0 1rem;
  }
  
  .profile-modal-actions {
    padding: 0.875rem 1rem;
  }
}

/* Landscape Mobile Orientation */
@media (max-height: 500px) and (orientation: landscape) {
  .profile-main-info {
    flex-direction: row;
    gap: 2rem;
  }
  
  .profile-text-info {
    order: 2;
  }
  
  .profile-avatar-container {
    order: 1;
  }
  
  .profile-stats {
    flex-direction: row;
    justify-content: flex-start;
  }
  
  .profile-modal {
    max-height: 98vh;
  }
  
  .delete-modal {
    max-height: 90vh;
    overflow-y: auto;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .info-card,
  .profile-hero-section,
  .profile-modal,
  .delete-modal {
    border-width: 2px;
  }
  
  .action-btn-modern,
  .modern-edit-btn,
  .save-btn,
  .cancel-btn,
  .delete-confirm-btn,
  .cancels-btn {
    border: 2px solid currentColor;
  }
}

/* Reduced Motion Preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .floating-shapes .shape {
    animation: none;
  }
  
  .empty-icon {
    animation: none;
  }
}

/* Print Styles */
@media print {
  .modern-profile-container {
    background: white;
    box-shadow: none;
  }
  
  .profile-header-actions,
  .action-buttons-modern {
    display: none;
  }
  
  .profile-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .floating-shapes {
    display: none;
  }
}

/* Focus Styles for Accessibility */
.modern-edit-btn:focus,
.action-btn-modern:focus,
.tab-btn:focus,
.save-btn:focus,
.cancel-btn:focus,
.delete-confirm-btn:focus,
.cancels-btn:focus,
.close-btn:focus {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

/* Touch Targets for Mobile */
@media (max-width: 768px) {
  .modern-edit-btn,
  .action-btn-modern,
  .tab-btn,
  .save-btn,
  .cancel-btn,
  .delete-confirm-btn,
  .cancels-btn,
  .close-btn {
    min-height: 44px;
    min-width: 44px;
  }
}































// Add these responsive styles for Validate component:

/* ================================
   VALIDATE COMPONENT - RESPONSIVE
   ================================ */

.header-left {
  position: relative;
  z-index: 2;
}

.content-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.content-subtitle {
  font-size: 1rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  line-height: 1.6;
  max-width: 600px;
}

/* Filter Buttons */
.validation-filters {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.4)"
  };
  border-radius: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 48px;
  white-space: nowrap;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.filter-btn:hover::before {
  left: 100%;
}

.filter-btn:hover {
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(248, 250, 252, 0.8)"
  };
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  transform: translateY(-2px);
}

.filter-btn.active {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
}

.filter-btn.active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
}

.notification-badge {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  animation: pulse 2s infinite;
}

.coming-soon-badge {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* Validation Content */
.validation-content {
  flex: 1;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* Pending Users Section */
.pending-users-section {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.3)"
  };
  border-left-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.empty-state svg {
  width: 80px;
  height: 80px;
  color: #10b981;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
  border-radius: 50%;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
  max-width: 400px;
}

/* Pending Users Grid */
.pending-users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  animation: staggeredFadeIn 0.8s ease-out;
}

@keyframes staggeredFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* User Card Styles */
.pending-user-card {
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: ${
    darkMode
      ? "0 8px 32px rgba(0, 0, 0, 0.2)"
      : "0 8px 32px rgba(0, 0, 0, 0.08)"
  };
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.pending-user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.pending-user-card:hover::before {
  transform: scaleX(1);
}

.pending-user-card:hover {
  transform: translateY(-4px);
  box-shadow: ${
    darkMode
      ? "0 16px 40px rgba(0, 0, 0, 0.3)"
      : "0 16px 40px rgba(0, 0, 0, 0.12)"
  };
  border-color: rgba(245, 158, 11, 0.3);
}

/* User Card Header */
.user-card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-avatars-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.user-avatars {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  position: relative;
  transition: all 0.3s ease;
}

.user-avatars:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.user-avatars img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-indicator.pending {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
  animation: pendingPulse 2s ease-in-out infinite;
}

@keyframes pendingPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.user-username {
  font-size: 0.875rem;
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  margin: 0;
  font-weight: 500;
}

/* User Details */
.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  font-size: 0.875rem;
}

.detail-row svg {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  flex-shrink: 0;
}

.detail-label {
  font-weight: 600;
  min-width: 80px;
}

.detail-value {
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  font-weight: 500;
}

.role-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.admin {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.role-badge.guest {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* User Actions */
.user-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn.approve {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
}

.action-btn.approve:hover:not(:disabled) {
  transform: translateY(-2px);
}

.action-btn.reject {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.action-btn.reject:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-loading .spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-left-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Coming Soon Section */
.coming-soon-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.coming-soon-content {
  text-align: center;
  background: ${
    darkMode
      ? "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
  };
  border: 1px solid ${
    darkMode ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.6)"
  };
  border-radius: 24px;
  padding: 3rem 2rem;
  backdrop-filter: blur(15px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  position: relative;
  overflow: hidden;
}

.coming-soon-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(245, 158, 11, 0.02) 50%, transparent 70%);
  pointer-events: none;
}

.coming-soon-content svg {
  width: 80px;
  height: 80px;
  color: #f59e0b;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
  border-radius: 50%;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
  animation: float 3s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.coming-soon-content h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: ${darkMode ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

.coming-soon-content > p {
  color: ${darkMode ? "#94a3b8" : "#64748b"};
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
  position: relative;
  z-index: 2;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${darkMode ? "#cbd5e1" : "#475569"};
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${
    darkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(248, 250, 252, 0.8)"
  };
  border: 1px solid ${
    darkMode ? "rgba(71, 85, 105, 0.3)" : "rgba(226, 232, 240, 0.5)"
  };
}

.feature-item svg {
  color: #10b981;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  background: none;
  box-shadow: none;
  animation: none;
  margin: 0;
  padding: 0;
}

/* ================================
   RESPONSIVE DESIGN BREAKPOINTS
   ================================ */

/* Large Desktop */
@media (max-width: 1200px) {
  .content-section {
    padding: 1.25rem;
  }
  
  .pending-users-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
}

/* Tablet Landscape */
@media (max-width: 1024px) {
  .content-section {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .user-management-header {
    padding: 1.5rem;
  }
  
  .content-title {
    font-size: 1.75rem;
  }
  
  .pending-users-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .pending-user-card {
    padding: 1.25rem;
  }
  
  .validation-filters {
    padding: 0.875rem;
    gap: 0.75rem;
  }
  
  .filter-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.8rem;
  }
}

/* Tablet Portrait */
@media (max-width: 768px) {
  .content-section {
    padding: 0.875rem;
  }
  
  .user-management-header {
    padding: 1.25rem;
  }
  
  .content-title {
    font-size: 1.5rem;
  }
  
  .content-subtitle {
    font-size: 0.9rem;
  }
  
  .validation-filters {
    flex-direction: column;
    padding: 1rem;
  }
  
  .filter-btn {
    justify-content: center;
    padding: 1rem;
    width: 100%;
  }
  
  .pending-users-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .user-card-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  
  .user-avatars-section {
    order: 1;
  }
  
  .user-info {
    order: 2;
  }
  
  .user-avatars {
    width: 80px;
    height: 80px;
  }
  
  .avatar-initials {
    font-size: 1.5rem;
  }
  
  .user-details {
    gap: 1rem;
  }
  
  .detail-row {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .detail-label {
    min-width: auto;
  }
  
  .user-actions {
    flex-direction: column;
    gap: 0.875rem;
  }
  
  .action-btn {
    width: 100%;
    padding: 1rem;
  }
  
  .coming-soon-content {
    padding: 2.5rem 1.5rem;
    margin: 0 1rem;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .content-section {
    padding: 0.75rem;
  }
  
  .user-management-header {
    padding: 1rem;
  }
  
  .content-title {
    font-size: 1.375rem;
  }
  
  .content-subtitle {
    font-size: 0.85rem;
  }
  
  .validation-filters {
    padding: 0.75rem;
  }
  
  .filter-btn {
    padding: 0.875rem 1rem;
    font-size: 0.75rem;
    gap: 0.5rem;
  }
  
  .notification-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
  
  .coming-soon-badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
  
  .pending-user-card {
    padding: 1rem;
  }
  
  .user-avatars {
    width: 70px;
    height: 70px;
  }
  
  .avatar-initials {
    font-size: 1.25rem;
  }
  
  .user-name {
    font-size: 1rem;
  }
  
  .user-username {
    font-size: 0.8rem;
  }
  
  .status-indicator {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
  
  .detail-row {
    font-size: 0.8rem;
    gap: 0.5rem;
  }
  
  .role-badge {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
  
  .action-btn {
    padding: 0.875rem;
    font-size: 0.8rem;
    min-height: 44px;
  }
  
  .empty-state {
    padding: 3rem 1.5rem;
  }
  
  .empty-state svg {
    width: 60px;
    height: 60px;
  }
  
  .empty-state h3 {
    font-size: 1.25rem;
  }
  
  .empty-state p {
    font-size: 0.9rem;
  }
  
  .coming-soon-content {
    padding: 2rem 1.25rem;
  }
  
  .coming-soon-content svg {
    width: 60px;
    height: 60px;
  }
  
  .coming-soon-content h3 {
    font-size: 1.5rem;
  }
  
  .coming-soon-content > p {
    font-size: 0.9rem;
  }
  
  .feature-item {
    font-size: 0.8rem;
    padding: 0.4rem;
  }
}

/* Small Mobile */
@media (max-width: 375px) {
  .content-section {
    padding: 0.5rem;
  }
  
  .user-management-header {
    padding: 0.875rem;
  }
  
  .content-title {
    font-size: 1.25rem;
  }
  
  .validation-filters {
    padding: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.75rem 0.875rem;
    font-size: 0.7rem;
  }
  
  .pending-user-card {
    padding: 0.875rem;
  }
  
  .user-avatars {
    width: 60px;
    height: 60px;
  }
  
  .avatar-initials {
    font-size: 1rem;
  }
  
  .user-name {
    font-size: 0.95rem;
  }
  
  .action-btn {
    padding: 0.75rem;
    font-size: 0.75rem;
  }
  
  .coming-soon-content {
    padding: 1.5rem 1rem;
  }
}

/* Landscape Mobile Orientation */
@media (max-height: 500px) and (orientation: landscape) {
  .user-card-header {
    flex-direction: row;
    text-align: left;
  }
  
  .user-avatars-section {
    order: 1;
  }
  
  .user-info {
    order: 2;
  }
  
  .user-actions {
    flex-direction: row;
  }
  
  .empty-state {
    padding: 2rem 1.5rem;
  }
  
  .coming-soon-content {
    padding: 2rem 1.5rem;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .pending-user-card,
  .user-management-header,
  .validation-filters,
  .coming-soon-content {
    border-width: 2px;
  }
  
  .action-btn,
  .filter-btn {
    border: 2px solid currentColor;
  }
}

/* Reduced Motion Preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .notification-badge,
  .status-indicator.pending,
  .coming-soon-content svg {
    animation: none;
  }
}

/* Print Styles */
@media print {
  .content-section {
    background: white;
    box-shadow: none;
  }
  
  .user-actions,
  .validation-filters {
    display: none;
  }
  
  .pending-users-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Focus Styles for Accessibility */
.filter-btn:focus,
.action-btn:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Touch Targets for Mobile */
@media (max-width: 768px) {
  .filter-btn,
  .action-btn {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Loading States Animation */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



  

`;
