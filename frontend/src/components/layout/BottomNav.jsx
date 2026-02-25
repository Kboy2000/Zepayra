import { useNavigate, useLocation } from 'react-router-dom';
import { Home, History, Star, Bell } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'transactions', label: 'Activity', icon: History, path: '/transactions' },
    { id: 'beneficiaries', label: 'Saved', icon: Star, path: '/beneficiaries' },
    { id: 'notifications', label: 'Alerts', icon: Bell, path: '/notifications' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.id}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="bottom-nav-icon-wrapper">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {item.id === 'notifications' && <span className="notification-dot"></span>}
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
