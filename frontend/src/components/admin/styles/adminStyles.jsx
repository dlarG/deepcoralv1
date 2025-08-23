export const getAdminStyles = (sidebarOpen) => `
    .user-management-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .header-left h2 {
          margin: 0 0 0.25rem 0;
        }
          .content-subtitle {
          color: #64748b;
          font-size: 0.875rem;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .add-user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-user-btn:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .user-controls {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .search-section {
          flex: 1;
        }

        .search-input-container {
          position: relative;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .filter-section {
          display: flex;
          gap: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .filter-selects {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          font-size: 0.875rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .filter-selects:focus {
          outline: none;
          border-color: #0284c7;
        }

        .user-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          background: white;
          padding: 1.25rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #0284c7;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .users-table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          background: #f8fafc;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e5e7eb;
        }

        .users-table td {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }

        .user-row:hover {
          background: #f9fafb;
        }

        .user-avatar-small {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        }

        .user-avatar-small img {
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
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-name-cell {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .user-full-name {
          font-weight: 500;
          color: #111827;
        }

        .user-id {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .username-cell {
          font-family: 'Monaco', 'Menlo', monospace;
          color: #4b5563;
          font-size: 0.875rem;
        }

        .role-badge-new {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .role-badge-new.admin {
          background: #fef3c7;
          color: #d97706;
        }

        .role-badge-new.biologist {
          background:rgb(97, 162, 236);
          color:rgb(2, 0, 64);
        }

        .role-badge-new.guest {
          background: #f3f4f6;
          color: #374151;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .action-buttons-new {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn-new {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn-new.edit {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .action-btn-new.edit:hover {
          background: #bfdbfe;
        }

        .action-btn-new.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn-new.delete:hover {
          background: #fecaca;
        }

        .no-users-found {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .no-users-found svg {
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .no-users-found h3 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .no-users-found p {
          margin: 0;
        }

        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .pagination-info {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .pagination-controls {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }

        .pagination-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .pagination-btn.active {
          background: #0284c7;
          color: white;
          border-color: #0284c7;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-ellipsis {
          padding: 0.5rem;
          color: #9ca3af;
        }

        /* Enhanced Modal Styles */
        .modal-overlay-new {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          overflow-y: auto; /* Allow overlay to scroll */
        }

        .user-modal-new {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          min-height: 400px; /* Ensure minimum height */
          overflow: visible; /* Change from hidden to visible */
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          margin: auto; /* Center the modal */
        }

                .user-modal-new {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          min-height: 400px; /* Ensure minimum height */
          overflow: visible; /* Change from hidden to visible */
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          margin: auto; /* Center the modal */
        }

        .modal-header-new {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 2rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
          flex-shrink: 0; /* Prevent header from shrinking */
        }

        .modal-title-section h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.5rem;
          color: #111827;
        }

        .modal-title-section p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .close-btn-new {
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s;
          flex-shrink: 0; /* Prevent button from shrinking */
        }

        .close-btn-new:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .user-form-new {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0; /* Allow flex child to shrink */
        }

        .form-body-new {
          padding: 2rem;
          overflow-y: auto; /* Enable scrolling */
          flex: 1;
          min-height: 0; /* Allow flex child to shrink */
          max-height: calc(90vh - 200px); /* Reserve space for header and footer */
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .form-section h4 {
          margin: 0 0 1rem 0;
          font-size: 1.125rem;
          color: #111827;
          font-weight: 600;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .form-row-new {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group-new {
          margin-bottom: 1.5rem;
        }

        .form-group-new label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .required {
          color: #dc2626;
        }

        .optional {
          color: #6b7280;
          font-weight: 400;
        }

        .form-group-new input,
        .form-group-new select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s;
          background: white;
          box-sizing: border-box; /* Ensure proper sizing */
        }

        .form-group-new input:focus,
        .form-group-new select:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .form-group-new input.error,
        .form-group-new select.error {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .error-text {
          display: block;
          color: #dc2626;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .error-list {
          margin-top: 0.5rem;
        }

        .error-list .error-text {
          margin-bottom: 0.25rem;
        }

        .password-requirements {
          margin-top: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 3px solid #0284c7;
        }

        .password-requirements p {
          margin: 0 0 0.5rem 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .password-requirements ul {
          margin: 0;
          padding-left: 1rem;
          list-style-type: disc;
        }

        .password-requirements li {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.125rem;
        }

        .modal-actions-new {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e5e7eb;
          background: #f8fafc;
          flex-shrink: 0; /* Prevent footer from shrinking */
          margin-top: auto; /* Push to bottom */
        }

        .cancel-btn-new {
          padding: 0.75rem 1.5rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn-new:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .submit-btn-new {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn-new:hover:not(:disabled) {
          background: #0369a1;
        }

        .submit-btn-new:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
          @media (max-width: 768px) {
          .modal-overlay-new {
            padding: 0.5rem;
            align-items: flex-start; /* Align to top on mobile */
            padding-top: 2rem; /* Add top padding */
          }
          .add-coral-btn {
            width: 200px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: #0284c7;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }  
          
          .user-modal-new {
            max-height: 95vh; /* Increase max height on mobile */
            margin-top: 0; /* Remove top margin on mobile */
          }
          
          .form-body-new {
            max-height: calc(95vh - 180px); /* Adjust for mobile */
            padding: 1rem;
          }
          
          .modal-header-new,
          .modal-actions-new {
            padding: 1rem;
          }
          
          .form-row-new {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .user-modal-new {
            border-radius: 12px; /* Smaller border radius */
          }
          
          .form-body-new {
            padding: 1rem;
          }
          
          .password-requirements {
            padding: 0.75rem;
          }
        }

        /* Scrollbar styling for better UX */
        .form-body-new::-webkit-scrollbar {
          width: 6px;
        }

        .form-body-new::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .form-body-new::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .form-body-new::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #0284c7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          text-align: center;
          padding: 4rem 2rem;
        }

        .error-message {
          color: #dc2626;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .user-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .filter-section {
            flex-direction: column;
            gap: 1rem;
          }

          .user-management-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .header-actions {
            justify-content: stretch;
          }

          .export-btn,
          .add-user-btn {
            flex: 1;
            justify-content: center;
          }

          .form-row-new {
            grid-template-columns: 1fr;
          }

          .pagination-container {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .users-table {
            font-size: 0.875rem;
          }

          .users-table th,
          .users-table td {
            padding: 0.75rem 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .user-stats {
            grid-template-columns: 1fr 1fr;
          }
          
          .modal-overlay-new {
            padding: 0.5rem;
          }
          
          .modal-header-new,
          .form-body-new,
          .modal-actions-new {
            padding: 1rem;
          }
        }
      /* Coral Management Styles */
        .coral-management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .add-coral-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-coral-btn:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .coral-grid-container {
          width: 100%;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-state svg {
          color: #94a3b8;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #475569;
        }

        .empty-state p {
          margin-bottom: 2rem;
        }

        .coral-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .coral-management-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .coral-management-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .coral-card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .coral-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .coral-management-card:hover .coral-card-image img {
          transform: scale(1.05);
        }

        .coral-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .coral-management-card:hover .coral-card-overlay {
          opacity: 1;
        }

        .overlay-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .overlay-btn.view {
          background: #0284c7;
          color: white;
        }

        .overlay-btn.edit {
          background: #059669;
          color: white;
        }

        .overlay-btn.delete {
          background: #dc2626;
          color: white;
        }

        .overlay-btn:hover {
          transform: scale(1.1);
        }

        .coral-card-content {
          padding: 1.5rem;
        }

        .coral-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .coral-card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          flex: 1;
        }

        .classification-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .classification-badge.hard-coral {
          background: #dbeafe;
          color: #1e40af;
        }

        .classification-badge.soft-coral {
          background: #dcfce7;
          color: #166534;
        }

        .coral-card-scientific {
          font-style: italic;
          color: #0284c7;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .coral-card-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .info-item {
          font-size: 0.875rem;
          color: #475569;
        }

        .coral-card-description {
          color: #64748b;
          line-height: 1.5;
          font-size: 0.875rem;
        }
          /* Modal Styles */
        .coral-modal {
          background: white;
          border-radius: 16px;
          width: 90vw;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .coral-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .coral-modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #1e293b;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .coral-modal-body {
          padding: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .file-input {
          display: none;
        }

        .file-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          justify-content: center;
          color: #64748b;
          font-weight: 500;
        }

        .file-label:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .image-preview {
          width: 100%;
          max-width: 200px;
          height: 150px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .coral-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .cancel-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #f9fafb;
        }

        .submit-btn {
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #0369a1;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* View Mode Styles */
        .coral-view {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }

        .coral-view-image {
          width: 100%;
          height: 300px;
          border-radius: 8px;
          overflow: hidden;
        }

        .coral-view-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .coral-view-info h2 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
        }

        .scientific-name {
          font-style: italic;
          color: #0284c7;
          margin-bottom: 1.5rem;
        }

        .coral-details {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          display: flex;
          gap: 0.5rem;
        }

        .detail-item .label {
          font-weight: 600;
          color: #374151;
          min-width: 100px;
        }

        .detail-item .value {
          color: #64748b;
        }

        .identification h4 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .identification p {
          line-height: 1.6;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .coral-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .coral-view {
            grid-template-columns: 1fr;
          }

          .coral-management-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }

      
      .profile-info .created {
        font-size: 0.8rem;
      }
      
       @media (max-width: 1024px) {
        .coral-grid:not(.sidebar-collapsed),
        .coral-grid.sidebar-collapsed {
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }
      }

      @media (max-width: 768px) {
        
        .info-cards-container {
          grid-template-columns: 1fr;
        }
        .main-content {
          margin-left: 0;
        }
        .coral-grid {
          grid-template-columns: 1fr;
        }
      }
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f8fafc;
        }

        .content-title {
          color: #1e293b;
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
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
          background: #e0f2fe;
          color: #0369a1;
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
        .dashboard-container {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.users {
          background: #e0f2fe;
          color: #0369a1;
        }

        .stat-icon.images {
          background: #ecfdf5;
          color: #059669;
        }

        .stat-icon.reports {
          background: #fef2f2;
          color: #b91c1c;
        }

        .stat-icon.species {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .stat-info h3 {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 0.25rem;
          font-weight: 500;
        }

        .stat-info p {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .sidebar {
          width: ${sidebarOpen ? "280px" : "80px"};
          background: white;
          border-right: 1px solid #e2e8f0;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: calc(100vh - 70px);
          position: fixed;
          top: 90px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #f1f5f9;
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
        .main-content {
          flex: 1;
          padding: 2rem;
          background: #f8fafc;
          overflow-y: auto;
          margin-left: ${sidebarOpen ? "280px" : "80px"};
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: calc(100vh - 100px);
        }
        
        .content-placeholder {
          color: #64748b;
          text-align: center;
          padding: 3rem 0;
          display: flex;
          justify-cotent-center;
          align-items:center;
          height: 300px;
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }

          .sidebar {
            position: fixed;
            z-index: 40;
            height: calc(100vh - 70px);
            box-shadow: ${
              sidebarOpen ? "4px 0 15px rgba(0, 0, 0, 0.1)" : "none"
            };
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
        .add-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #06b6d4;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-button:hover {
          background: #0891b2;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: #f1f5f9;
          padding: 1rem;
          text-align: left;
          color: #64748b;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }

        .data-table tr:hover {
          background: #f8fafc;
        }

        .role-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .role-badge.admin {
          background: #e0f2fe;
          color: #0369a1;
        }

        .role-badge.biologist {
          background: #ecfdf5;
          color: #059669;
        }

        .role-badge.guest {
          background: rgb(202, 204, 206);
          color: rgb(35, 35, 35);
        }

        .action-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          margin-right: 0.5rem;
        }

        .action-button.edit {
          background: #e0f2fe;
          color: #0369a1;
        }

        .action-button.edit:hover {
          background: #bae6fd;
        }

        .action-button.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-button.delete:hover {
          background: #fecaca;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          margin: 0;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .modal-actions button {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .modal-actions button.primary {
          background-color: #4caf50;
          color: white;
          border: none;
        }
        /* Profile Management Styles */
        .profile-management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .edit-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-profile-btn:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .profile-dashboard {
          max-width: 1000px;
          margin: 0 auto;
        }

        .profile-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .profile-card-header {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: white;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .profile-avatar-section {
          position: relative;
        }

        .profile-avatar-large {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          position: relative;
          background: rgba(255, 255, 255, 0.1);
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        .avatar-fallback {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 600;
          color: white;
          position: absolute;
          top: 0;
          left: 0;
        }
        .profile-status {
          position: absolute;
          bottom: -8px;
          right: -8px;
        }

        .status-badge {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.60rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge.admin {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.biologist {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.guest {
          background: #f3f4f6;
          color: #374151;
        }

        .profile-info-section {
          flex: 1;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .profile-username {
          font-size: 1.125rem;
          opacity: 0.8;
          margin: 0 0 1rem 0;
        }

        .profile-bio {
          font-size: 1rem;
          opacity: 0.9;
          line-height: 1.5;
          margin: 0;
        }

        .profile-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
        }

        .detail-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .detail-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .detail-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #e0f2fe;
          color: #0369a1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-content h4 {
          font-size: 0.875rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.25rem 0;
        }

        .detail-content p {
          font-size: 1rem;
          color: #1e293b;
          font-weight: 500;
          margin: 0;
        }

        .profile-actions-section {
          padding: 2rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .action-btn.primary {
          background: #0284c7;
          color: white;
        }

        .action-btn.primary:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .action-btn.danger {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .action-btn.danger:hover {
          background: #fee2e2;
          border-color: #fca5a5;
        }

        /* Profile Modal Styles */
        .profile-modal {
          background: white;
          border-radius: 16px;
          width: 90vw;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .profile-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .profile-modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #1e293b;
        }

        .profile-modal-tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          background: #f8fafc;
          color: #475569;
        }

        .tab-btn.active {
          color: #0284c7;
          border-bottom-color: #0284c7;
          background: #f0f9ff;
        }

        .profile-modal-body {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }

        .tab-content {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-image-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .current-image {
          text-align: center;
        }

        .image-container {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 4px solid #e2e8f0;
          overflow: hidden;
          margin: 0 auto 1rem;
          position: relative;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .image-upload-section {
          text-align: center;
        }

        .upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .upload-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .upload-button:hover {
          background: #0369a1;
        }

        .upload-hint {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }

        .security-info {
          background: #f0f9ff;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #0284c7;
          margin-bottom: 1.5rem;
        }

        .security-info h4 {
          margin: 0 0 0.5rem 0;
          color: #0369a1;
        }

        .security-info p {
          margin: 0;
          color: #64748b;
          font-size: 0.875rem;
        }

        .profile-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(:disabled) {
          background: #0369a1;
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .profile-card-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .profile-details-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .profile-modal-tabs {
            overflow-x: auto;
          }

          .tab-btn {
            white-space: nowrap;
          }
        }
        /* Role badges */
        .role-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .role-badge.admin {
          background-color: #e0e7ff;
          color: #4f46e5;
        }

        .role-badge.biologist {
          background-color: #ecfdf5;
          color: #059669;
        }

        .role-badge.guest {
          background-color: #f5f5f5;
          color: #666;
        }
        .clickable-name {
          cursor: pointer;
          color: #2563eb;
          transition: color 0.2s ease;
        }

        .clickable-name:hover {
          color: #1d4ed8;
          text-decoration: underline;
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
  margin-bottom: 1.5rem;
  margin-left: 5px;
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
  .cancels-btn {
    padding: 0.875rem 1.5rem;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    color: #334155;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 20px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 600;
  }
    .validation-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  position: relative;
}

.filter-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.filter-btn.active {
  background: #0ea5e9;
  color: white;
}

.notification-badge {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.coming-soon-badge {
  background: #f59e0b;
  color: white;
  font-size: 0.6rem;
  padding: 0.125rem 0.375rem;
  border-radius: 8px;
  font-weight: 600;
}

.validation-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* Pending Users */
.pending-users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.pending-user-card {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
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
}

.pending-user-card:hover {
  border-color: #e2e8f0;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.user-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatars-section {
  position: relative;
}

.user-avatars {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 3px solid #f1f5f9;
}

.user-avatars img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
}

.status-indicator {
  position: absolute;
  bottom: -5px;
  right: -5px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 2px solid white;
}

.status-indicator.pending {
  background: #f59e0b;
  color: white;
}

.user-info h3 {
  margin: 0 0 0.25rem 0;
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 600;
}

.user-username {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.detail-row svg {
  color: #64748b;
  flex-shrink: 0;
}

.detail-label {
  color: #64748b;
  font-weight: 500;
  min-width: 60px;
}

.detail-value {
  color: #0f172a;
  font-weight: 500;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-badge.guest {
  background: #ecfccb;
  color: #365314;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

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
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.approve {
  background: #10b981;
  color: white;
}

.action-btn.approve:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.action-btn.reject {
  background: #ef4444;
  color: white;
}

.action-btn.reject:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 1.25rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

/* Coming Soon Section */
.coming-soon-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.coming-soon-content {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
}

.coming-soon-content svg {
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

.coming-soon-content h3 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1.5rem;
}

.coming-soon-content p {
  margin: 0 0 2rem 0;
  color: #64748b;
  line-height: 1.6;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  color: #64748b;
}

.feature-item svg {
  color: #10b981;
  flex-shrink: 0;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .pending-users-grid {
    grid-template-columns: 1fr;
  }
  
  .validation-filters {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .user-actions {
    flex-direction: column;
  }
}

.report-generation-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
  }

  /* Header Section */
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .report-header-text {
    flex: 1;
  }

  .report-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  .report-subtitle {
    font-size: 14px;
    color: #666;
  }

  .report-header-actions {
    display: flex;
    gap: 8px;
  }

  .report-action-btn {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .report-action-btn.secondary {
    background-color: white;
    border: 1px solid #d1d5db;
    color: #374151;
  }

  .report-action-btn.secondary:hover {
    background-color: #f9fafb;
  }

  .report-action-btn.primary {
    background-color: #3b82f6;
    border: 1px solid #3b82f6;
    color: white;
  }

  .report-action-btn.primary:hover {
    background-color: #2563eb;
  }

  .report-action-btn svg {
    margin-right: 6px;
  }

  /* Report Tabs */
  .report-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 20px;
  }

  .report-tab-btn {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }

  .report-tab-btn:hover {
    color: #3b82f6;
  }

  .report-tab-btn.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .report-tab-btn svg {
    margin-right: 8px;
  }

  /* Report Content Layout */
  .report-content {
    display: flex;
    gap: 20px;
  }

  .report-sidebar {
    width: 320px;
    flex-shrink: 0;
  }

  .report-main {
    flex: 1;
  }

  /* Filters Section */
  .report-filters {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 16px;
  }

  .report-filters h3 {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
  }

  .report-filters h3 svg {
    margin-right: 8px;
    color: #3b82f6;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .filter-group {
    margin-bottom: 12px;
  }

  .filter-group label {
    display: block;
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 6px;
  }

  .filter-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s ease;
  }

  .filter-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .filter-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    background-color: white;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
  }

  /* Filter Actions */
  .filter-actions {
    margin-top: 16px;
  }

  .generate-btn {
    width: 100%;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .generate-btn.primary {
    background-color: #3b82f6;
    color: white;
    border: none;
  }

  .generate-btn.primary:hover {
    background-color: #2563eb;
  }

  .generate-btn svg {
    margin-right: 8px;
  }

  .btn-loading {
    display: flex;
    align-items: center;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Summary Section */
  .report-summary {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 20px;
  }

  .report-summary h3 {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
  }

  .report-summary h3 svg {
    margin-right: 8px;
    color: #3b82f6;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .summary-card {
    background-color: #f9fafb;
    border-radius: 6px;
    padding: 12px;
    text-align: center;
  }

  .summary-value {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  .summary-label {
    font-size: 12px;
    color: #6b7280;
  }

  /* Report Data Table */
  .report-table-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .report-table {
    width: 100%;
    border-collapse: collapse;
  }

  .report-table th {
    background-color: #f9fafb;
    padding: 12px 16px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .report-table td {
    padding: 12px 16px;
    font-size: 14px;
    color: #4b5563;
    border-top: 1px solid #e5e7eb;
  }

  .report-table tr:hover {
    background-color: #f9fafb;
  }

  /* Badges */
  .role-badge,
  .status-badge,
  .activity-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .role-badge.admin {
    background-color: #e0e7ff;
    color: #4338ca;
  }

  .role-badge.guest {
    background-color: #e0f2fe;
    color: #0369a1;
  }

  .status-badge.approved {
    background-color: #dcfce7;
    color: #166534;
  }

  .status-badge.pending {
    background-color: #fef3c7;
    color: #92400e;
  }

  .activity-badge.login {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .activity-badge.logout {
    background-color: #e5e7eb;
    color: #4b5563;
  }

  .activity-badge.profile_update {
    background-color: #ede9fe;
    color: #5b21b6;
  }

  /* No Data State */
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .no-data svg {
    color: #9ca3af;
    margin-bottom: 16px;
  }

  .no-data h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .no-data p {
    font-size: 14px;
    color: #6b7280;
    max-width: 300px;
  }
          
  .modern-profile-container {
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Hero Section with Gradient Background */
.profile-hero-section {
  position: relative;
  margin: -2rem -2rem 3rem -2rem;
  padding: 3rem 2rem 4rem;
  border-radius: 0 0 32px 32px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%);
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 70%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

.hero-content {
  position: relative;
  z-index: 2;
  color: white;
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
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.modern-edit-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.profile-main-info {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.profile-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-wrapper {
  position: relative;
}

.profile-avatar-modern {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 6px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.profile-avatar-modern img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback-modern {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.avatar-status {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.status-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.status-dot.online {
  background: #10b981;
}

.role-indicator {
  margin-top: 0.5rem;
}

.modern-role-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.profile-text-info {
  flex: 1;
}

.profile-name-modern {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  line-height: 1.1;
}

.profile-username-modern {
  font-size: 1.5rem;
  opacity: 0.9;
  margin: 0 0 1.5rem 0;
  font-weight: 500;
}

.profile-bio-modern {
  font-size: 1.125rem;
  opacity: 0.95;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  max-width: 600px;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  font-weight: 500;
}

/* Modern Info Grid */
.profile-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.info-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
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
  border-radius: 24px 24px 0 0;
}

.info-card.personal-info::before {
  background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
}

.info-card.security-info::before {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.info-card.membership-info::before {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.info-card.actions-card::before {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.card-icon.personal {
  background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
}

.card-icon.security {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.card-icon.membership {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.card-icon.actions {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-weight: 500;
  color: #64748b;
  font-size: 0.9rem;
}

.info-row .value {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.9rem;
}

.role-chip {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-chip.admin {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.role-chip.guest {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0369a1;
}

.role-chip.biologist {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

.status-chip {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-chip.active {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-indicator.has-image {
  background: #dcfce7;
  color: #166534;
}

.status-indicator.no-image {
  background: #fef3c7;
  color: #92400e;
}

.action-buttons-modern {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn-modern {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  justify-content: center;
}

.action-btn-modern.primary {
  background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
}

.action-btn-modern.primary:hover {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(6, 182, 212, 0.4);
}

.action-btn-modern.danger {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  border: 2px solid #fecaca;
}

.action-btn-modern.danger:hover {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #fca5a5;
  transform: translateY(-2px);
}

.security-note {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #06b6d4;
}

.security-note p {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .profile-info-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}

@media (max-width: 968px) {
  .profile-main-info {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .profile-name-modern {
    font-size: 2.5rem;
  }
  
  .profile-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .profile-hero-section {
    margin: -1rem -1rem 2rem -1rem;
    padding: 2rem 1rem 3rem;
    border-radius: 0 0 24px 24px;
  }
  
  .profile-info-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .profile-name-modern {
    font-size: 2rem;
  }
  
  .profile-stats {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .profile-avatar-modern {
    width: 120px;
    height: 120px;
  }
  
  .avatar-fallback-modern {
    font-size: 2.5rem;
  }
  
  .profile-name-modern {
    font-size: 1.75rem;
  }
  
  .info-card {
    padding: 1.5rem;
  }
}


`;
