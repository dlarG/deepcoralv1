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
        width: 60px;
        height: 60px;
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
    }
  
  .admin-top-nav {
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
  font-size: 1.125rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  color: ${darkMode ? "#f1f5f9" : "#0f172a"};
}

.profile-details p {
  font-size: 0.875rem;
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
  font-size: 0.75rem;
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
  padding-top: 60px;
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

@media(max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }
}

/* Tooltip for Collapsed State */
.sidebar-nav li:not(.active) .nav-item-content:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 1rem);
  top: 50%;
  transform: translateY(-50%);
  background: ${darkMode ? "#f" : "#334155"};
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

.file-upload-area:hover {
  border-color: #0ea5e9;
  background: ${
    darkMode ? "rgba(14, 165, 233, 0.1)" : "rgba(14, 165, 233, 0.05)"
  };
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(14, 165, 233, 0.15);
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

.up-button {
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

.up-button.pri:hover {
  background: ${darkMode ? "#ff4c4c" : "#013a63"};
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.up-button.pri{
  background: ${darkMode ? "#ff6b6b" : " #012a4a"};
  color: white;
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
  background: ${darkMode ? "#ff6b6b" : "#012a4a"};
  // background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
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

/* Results Tabs */
.results-tabs {
  display: flex;
  border-bottom: 1px solid #e1e5e9;
  margin-bottom: 20px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tab-button:hover:not(.active) {
  color: #495057;
}

/* Analysis Results */
.analysis-results {
  padding: 20px 0;
}

.quadrat-analysis-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.quadrat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.quadrat-visuals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.analysis-image {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.visual-label {
  display: block;
  text-align: center;
  margin-top: 8px;
  font-size: 0.875rem;
  color: #6c757d;
}

.coverage-analysis {
  border-top: 1px solid #e1e5e9;
  padding-top: 15px;
}

.coral-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.coral-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.coral-info {
  flex: 1;
}

.coral-name {
  font-weight: 600;
  display: block;
}

.coral-category {
  font-size: 0.75rem;
  color: #6c757d;
  display: block;
}

.coral-coverage {
  text-align: right;
}

.coverage-percent {
  font-weight: 600;
  color: #28a745;
  display: block;
}

.pixel-count {
  font-size: 0.75rem;
  color: #6c757d;
  display: block;
}

.total-coverage {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e1e5e9;
  text-align: center;
  font-size: 1.1rem;
  color: #495057;
}

.quadrat-actions {
  display: flex;
  gap: 8px;
}

.download-btn.small {
  padding: 6px 12px;
  font-size: 0.75rem;
}

/* Add to your existing AddImage styles */

/* Batch Analysis Styles */
.batch-analysis-results {
  padding: 1.5rem;
}

.batch-header {
  margin-bottom: 2rem;
}

.batch-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
}

.batch-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
  text-align: center;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.coverage-details {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.coverage-details h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
}

.coverage-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  align-items: center;
  transition: all 0.2s ease;
}

.table-row:hover {
  background: #f7fafc;
  transform: translateY(-1px);
}

.coral-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.color-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.category {
  color: #718096;
  text-transform: capitalize;
}

.percentage {
  font-weight: 600;
  color: #2b6cb0;
}

.pixels {
  color: #4a5568;
  font-size: 0.875rem;
}

.process-button.analysis {
  background: ${darkMode ? "#ff6b6b" : "#012a4a"};
  color: white;
}

.process-button.analysis:hover {
  background: ${darkMode ? "#e85c5c" : "#014f86"};
  transform: translateY(-1px);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #718096;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .batch-stats {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .chart-wrapper {
    height: 250px;
  }
}

































.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: linear-gradient(180deg, #3ddad7 0%, #1e3c72 100%);
  position: relative;
  overflow: hidden;
}

.coral-loader {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
}

.coral-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 60px;
  height: 40px;
  background: #ff7e5f;
  border-radius: 30px 30px 60px 60px / 20px 20px 40px 40px;
  transform: translateX(-50%);
  box-shadow: 0 4px 16px rgba(255,126,95,0.3);
}

.coral-branch {
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: 12px;
  height: 50px;
  background: #feb47b;
  border-radius: 6px;
  transform: translateX(-50%) rotate(-15deg);
  animation: coralWave 2s infinite ease-in-out;
}

.coral-branch.right {
  left: 70%;
  height: 40px;
  transform: rotate(20deg);
  background: #ffb88c;
  animation-delay: 0.5s;
}

.coral-branch.left {
  left: 30%;
  height: 35px;
  transform: rotate(-30deg);
  background: #ff9a8b;
  animation-delay: 1s;
}

@keyframes coralWave {
  0%, 100% { transform: scaleY(1) rotate(var(--angle, -15deg)); }
  50% { transform: scaleY(1.15) rotate(calc(var(--angle, -15deg) + 8deg)); }
}

/* Bubbles */
.coral-bubble {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 16px;
  height: 16px;
  background: rgba(61,218,215,0.7);
  border-radius: 50%;
  transform: translateX(-50%);
  animation: bubbleUp 2.5s infinite;
  opacity: 0.7;
}

.coral-bubble:nth-child(4) {
  left: 40%;
  width: 10px;
  height: 10px;
  animation-delay: 0.7s;
}
.coral-bubble:nth-child(5) {
  left: 60%;
  width: 12px;
  height: 12px;
  animation-delay: 1.2s;
}
.coral-bubble:nth-child(6) {
  left: 55%;
  width: 8px;
  height: 8px;
  animation-delay: 1.7s;
}

@keyframes bubbleUp {
  0% { bottom: 10px; opacity: 0.7; }
  60% { opacity: 1; }
  100% { bottom: 90px; opacity: 0; }
}

/* Loading text */
.loading-screen span {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(30,60,114,0.2);
}


/* Enhanced AddImage Styles */
.main-content-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

/* Image Status Summary */
.image-status-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.status-count {
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0.5rem;
  border-radius: 50%;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.status-count.valid {
  background: linear-gradient(135deg, #10b981, #059669);
}

.status-count.invalid {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.status-count.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.status-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

/* Validation Controls */
.validation-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}


/* Enhanced Gallery Items */
.gallery-item {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gallery-item.pending {
  border-color: #f59e0b;
  background: #fef3c7;
}

.gallery-item.valid {
  border-color: #10b981;
  background: #d1fae5;
}

.gallery-item.invalid {
  border-color: #ef4444;
  background: #fee2e2;
}

.gallery-item.processed {
  border-color: #8b5cf6;
  background: #ede9fe;
}

.gallery-item.active {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* Status Indicators */
.status-indicator {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  z-index: 2;
}

.status-indicator.pending {
  background: #f59e0b;
}

.status-indicator.valid {
  background: #10b981;
}

.status-indicator.invalid {
  background: #ef4444;
}

.status-indicator.processed {
  background: #8b5cf6;
}

.status-indicator.validating {
  background: #3b82f6;
}

/* Rejected Images Panel */
.rejected-images-panel {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
}

.rejected-images-panel h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  color: #dc2626;
  font-size: 1rem;
  font-weight: 600;
}

.rejected-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rejected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
}

.rejected-item .filename {
  font-weight: 600;
  color: #374151;
}

.rejected-item .rejection-reason {
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

/* Save to Database Button */
.save-section {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.save-to-db-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.save-to-db-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.saved-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  font-weight: 600;
}

/* Enhanced Item Info */
.item-info {
  padding: 0.75rem;
}

.item-status {
  margin-top: 0.5rem;
}

.quadrat-count,
.crop-count {
  font-size: 0.75rem;
  color: #059669;
  font-weight: 600;
}

.error-text {
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 600;
}

.validating-text {
  font-size: 0.75rem;
  color: #3b82f6;
  font-weight: 600;
}


/* Loading States */
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Location Selector Styles */
.location-selector-overlay {
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

.location-selector-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.header-left p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.close-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  transform: scale(1.1);
}

.location-content {
  padding: 0;
}

.map-controls {
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-bar {
  flex: 1;
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.search-bar input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  outline: none;
  font-size: 0.875rem;
}

.search-btn,
.location-btn {
  padding: 0.75rem 1rem;
  border: none;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.search-btn {
  border-radius: 0;
}

.location-btn {
  border-radius: 8px;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled),
.location-btn:hover:not(:disabled) {
  background: #2563eb;
}

.search-btn:disabled,
.location-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.mode-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--color-dark);
}

.mode-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.mode-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.selected-location-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  color: white;
}

.location-stats {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.map-container {
  position: relative;
  height: 400px;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.existing-locations-panel {
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.existing-locations-panel h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.locations-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.no-locations {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

.location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.location-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.location-item.selected {
  border-color: #3b82f6;
  background: #dbeafe;
}

.location-info strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #374151;
}

.location-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.coordinates {
  font-family: 'Courier New', monospace;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.25rem !important;
}

.last-update {
  font-size: 0.75rem !important;
  color: #9ca3af !important;
}

.location-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.footer-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
}

.save-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
}

.save-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* Location Popup Styles */
.location-popup {
  min-width: 200px;
}

.location-popup strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
}

.location-popup p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.select-location-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s ease;
}

.select-location-btn:hover {
  background: #2563eb;
}

/* Custom Leaflet Marker Styles */
.custom-marker {
  background: transparent !important;
  border: none !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .location-selector-overlay {
    padding: 1rem;
  }
  
  .location-selector-modal {
    max-height: 95vh;
  }
  
  .location-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .header-left {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .mode-selector {
    flex-direction: column;
  }
  
  .locations-list {
    max-height: 150px;
  }
  
  .location-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .footer-actions {
    justify-content: stretch;
  }
  
  .cancel-btn,
  .save-btn {
    flex: 1;
    justify-content: center;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .location-selector-modal {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .location-header {
    background: linear-gradient(135deg, #374151, #4b5563);
    border-color: #4b5563;
  }
  
  .map-controls,
  .existing-locations-panel,
  .location-footer {
    background: #374151;
    border-color: #4b5563;
  }
  
  .location-item {
    background: #1f2937;
    border-color: #4b5563;
  }
  
  .location-item.selected {
    background: #1e40af;
  }
  
  .search-bar input {
    background: #374151;
    color: #f9fafb;
  }
  
  .selected-location-info {
    background: #1e40af;
    border-color: #3b82f6;
  }
}
  
.gallery-item {
  position: relative;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
}

.gallery-item.valid {
  border-color: #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.gallery-item.invalid {
  border-color: #ef4444;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.gallery-item.processed {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Enhanced Remove Button */
.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.remove-btn:hover {
  background: #ef4444;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.remove-btn.invalid:hover {
  background: #dc2626;
}

.remove-btn.valid:hover {
  background: #f59e0b;
}

.remove-btn.processed:hover {
  background: #8b5cf6;
}

/* Batch Indicator */
.batch-indicator {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  z-index: 2;
}

/* Enhanced Status Summary */
.image-status-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  align-items: center;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  min-width: 70px;
}

.status-item.valid {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
}

.status-item.invalid {
  background: linear-gradient(135deg, #fee2e2, #fca5a5);
  color: #991b1b;
}

.status-item.pending {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
}

.status-count {
  font-size: 1.5rem;
  font-weight: 700;
}

.status-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.analysis-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d97706;
  font-size: 0.875rem;
  font-weight: 500;
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: #fef3c7;
  border-radius: 6px;
}

/* Gallery Filter Actions */
.gallery-filter-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.filter-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-button.danger-outline {
  background: white;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.action-button.danger-outline:hover {
  background: #ef4444;
  color: white;
}

/* Enhanced Item Status */
.item-status .quadrat-count.valid {
  color: #10b981;
  font-weight: 600;
}

.item-status .crop-count.processed {
  color: #3b82f6;
  font-weight: 600;
}

.item-status .error-text {
  color: #ef4444;
  font-weight: 600;
}

.item-status .validating-text {
  color: #d97706;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Analysis Readiness Indicator */
.analysis-readiness {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #d1fae5, #ecfdf5);
  border: 1px solid #10b981;
  border-radius: 8px;
}

.readiness-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ready-icon {
  color: #10b981;
}

.ready-text {
  color: #065f46;
  font-weight: 600;
}

.skip-text {
  color: #d97706;
  font-size: 0.875rem;
  font-style: italic;
}

/* Confirmation Modal */
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.confirmation-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.confirmation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.confirmation-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 700;
}

.confirmation-content {
  padding: 1.5rem 2rem;
}

.confirmation-image {
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  max-height: 200px;
}

.confirmation-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.confirmation-details p {
  margin: 0.5rem 0;
  color: #374151;
}

.warning-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d97706 !important;
  background: #fef3c7;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
}

.confirmation-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-confirm {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .image-status-summary {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .gallery-filter-actions {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
  
  .filter-btn,
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .confirmation-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .confirmation-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

`;
