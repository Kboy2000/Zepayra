import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  let nextId = 0;

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++nextId;
    const newToast = { id, message, type, duration };

    setToasts((prevToasts) => {
      // Limit to 5 toasts
      const updatedToasts = [...prevToasts, newToast];
      return updatedToasts.slice(-5);
    });

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearAll }}>
      {children}
    </ToastContext.Provider>
  );
};
