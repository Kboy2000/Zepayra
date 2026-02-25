import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light': return <Sun size={20} />;
      case 'dark': return <Moon size={20} />;
      default: return <Monitor size={20} />;
    }
  };

  return (
    <button 
      className={`theme-toggle ${theme}`} 
      onClick={toggleTheme}
      title={`Current theme: ${theme}. Click to change.`}
    >
      <div className="theme-toggle-content">
        {getIcon()}
        <span className="theme-name">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
      </div>
    </button>
  );
};

export default ThemeToggle;
