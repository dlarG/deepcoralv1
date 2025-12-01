import React, { useEffect, useRef } from 'react';
import { FiX, FiMaximize, FiMinimize } from 'react-icons/fi';
import '../styles/videomodal.css';

function VideoModal({ isOpen, onClose, videoUrl }) {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Auto-play prevented:", err);
      });
    }
    
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen().catch(err => {
        console.log("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay" onClick={handleClose}>
      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-header">
          <h3>DeepCoral Platform Demo</h3>
          <div className="video-modal-controls">
            <button 
              className="video-control-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <FiMinimize /> : <FiMaximize />}
            </button>
            <button 
              className="video-control-btn close-btn"
              onClick={handleClose}
              title="Close"
            >
              <FiX />
            </button>
          </div>
        </div>
        
        <div className="video-modal-content">
          <video
            ref={videoRef}
            controls
            controlsList="nodownload"
            className="demo-video"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="video-modal-footer">
          <p>Learn how DeepCoral analyzes coral reef images with AI precision</p>
        </div>
      </div>
    </div>
  );
}

export default VideoModal;
