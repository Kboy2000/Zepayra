import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Toast.css';

const Toast = ({ id, message, type, duration, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close" onClick={handleClose}>
        ×
      </button>
      {duration > 0 && (
        <div className="toast-progress">
          <div 
            className="toast-progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

Toast.defaultProps = {
  type: 'info',
  duration: 3000,
};

export default Toast;
