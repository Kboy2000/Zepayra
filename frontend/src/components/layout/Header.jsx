import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Bell, LogOut, Settings, User, LayoutDashboard, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common';
import logo from '../../assets/images/logo.png';
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
        <img src={logo} alt="ZEPAYRA" style={{ height: '32px', display: 'block' }} />
      </div>

      <div className="header-actions">
        <ThemeToggle />
        <button className="header-action-btn desktop-only" onClick={() => navigate('/beneficiaries')}>
          <Star size={20} />
          <span>Saved</span>
        </button>
        <button className="header-action-btn desktop-only" onClick={() => navigate('/notifications')}>
          <div className="icon-with-badge">
            <Bell size={20} />
            <span className="badge-dot"></span>
          </div>
          <span>Alerts</span>
        </button>

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
                  <LayoutDashboard size={18} className="dropdown-icon" />
                  <span>Dashboard</span>
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => handleNavigation('/profile')}
                >
                  <User size={18} className="dropdown-icon" />
                  <span>My Profile</span>
                </button>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-section">
                <button 
                  className="dropdown-item"
                  onClick={() => handleNavigation('/account-settings')}
                >
                  <Settings size={18} className="dropdown-icon" />
                  <span>Account Settings</span>
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => handleNavigation('/theme-settings')}
                >
                  <Palette size={18} className="dropdown-icon" />
                  <span>Theme Settings</span>
                </button>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-section">
                <button 
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="dropdown-icon text-error" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
