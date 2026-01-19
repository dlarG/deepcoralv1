import React, { useEffect, useRef } from "react";
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";
import "../styles/videomodal.css";

const VideoModal = ({ isOpen, onClose, videoSrc, title }) => {
  const modalRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case " ":
        case "k":
          event.preventDefault();
          togglePlay();
          break;
        case "m":
          toggleMute();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, onClose]);

  // Reset video when modal opens/closes
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }

    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay">
      <div className="video-modal-container" ref={modalRef}>
        <div className="video-modal-header">
          <button
            className="video-modal-close"
            onClick={onClose}
            aria-label="Close video"
          >
            <FiX />
          </button>
        </div>

        <div className="video-container">
          <video
            ref={videoRef}
            className="demo-video"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Custom Video Controls */}
          <div className="video-controls">
            <button
              className="control-btn play-pause"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>

            <div className="progress-container">
              <div className="progress-bar" onClick={handleSeek}>
                <div
                  className="progress-fill"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              className="control-btn mute"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <FiVolumeX /> : <FiVolume2 />}
            </button>
          </div>
        </div>

        <div className="video-modal-footer">
          <p className="video-description">
            Watch how DeepCoral AI analyzes coral reef images with precision and
            speed.
          </p>
          <div className="keyboard-shortcuts">
            <span>
              <kbd>Space</kbd> Play/Pause
            </span>
            <span>
              <kbd>M</kbd> Mute/Unmute
            </span>
            <span>
              <kbd>Esc</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
