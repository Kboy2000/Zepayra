import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        ZEPAYRA
      </div>

      <div className="header-user" ref={dropdownRef}>
        <div className="header-user-trigger" onClick={toggleDropdown}>
          <div className="header-user-info">
            <span className="header-user-name">{user?.firstName} {user?.lastName}</span>
            <span className="header-user-email">{user?.email}</span>
          </div>
          <div className="header-user-avatar">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <svg 
            className={`header-dropdown-icon ${dropdownOpen ? 'open' : ''}`}
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none"
          >
            <path 
              d="M5 7.5L10 12.5L15 7.5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {dropdownOpen && (
          <div className="header-dropdown">
            <div className="dropdown-section">
              <button 
                className="dropdown-item"
                onClick={() => handleNavigation('/dashboard')}
              >
                <span className="dropdown-icon">🏠</span>
                <span>Dashboard</span>
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleNavigation('/profile')}
              >
                <span className="dropdown-icon">👤</span>
                <span>My Profile</span>
              </button>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-section">
              <button 
                className="dropdown-item"
                onClick={() => handleNavigation('/account-settings')}
              >
                <span className="dropdown-icon">⚙️</span>
                <span>Account Settings</span>
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleNavigation('/theme-settings')}
              >
                <span className="dropdown-icon">🎨</span>
                <span>Theme Settings</span>
              </button>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-section">
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <span className="dropdown-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
