import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card } from '../components/common';
import { formatDateTime } from '../utils/formatters';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'transaction', title: 'Transaction Successful', message: 'Your airtime purchase of ₦500 was successful', isRead: false, createdAt: '2024-01-12T10:30:00', data: { transactionId: '123' } },
    { id: 2, type: 'promotion', title: 'Special Offer!', message: 'Get 10% bonus on all data purchases today only!', isRead: false, createdAt: '2024-01-12T09:00:00' },
    { id: 3, type: 'security', title: 'New Login Detected', message: 'Login from Chrome on Windows in Lagos, Nigeria', isRead: true, createdAt: '2024-01-11T18:45:00' },
    { id: 4, type: 'referral', title: 'Referral Reward Earned', message: 'You earned ₦500 from your referral John Doe', isRead: true, createdAt: '2024-01-11T15:20:00' },
    { id: 5, type: 'bill', title: 'Bill Reminder', message: 'Your electricity bill is due in 2 days', isRead: false, createdAt: '2024-01-11T12:00:00' },
    { id: 6, type: 'system', title: 'App Update Available', message: 'Version 2.0 is now available with new features', isRead: true, createdAt: '2024-01-10T08:00:00' },
    { id: 7, type: 'transaction', title: 'Transaction Failed', message: 'Your cable TV payment failed. Please try again.', isRead: true, createdAt: '2024-01-09T16:30:00' },
  ]);

  const notificationTypes = [
    { id: 'all', name: 'All', icon: '📬', count: notifications.length },
    { id: 'transaction', name: 'Transactions', icon: '💳', count: notifications.filter(n => n.type === 'transaction').length },
    { id: 'promotion', name: 'Promotions', icon: '🎁', count: notifications.filter(n => n.type === 'promotion').length },
    { id: 'security', name: 'Security', icon: '🔒', count: notifications.filter(n => n.type === 'security').length },
    { id: 'referral', name: 'Referrals', icon: '👥', count: notifications.filter(n => n.type === 'referral').length },
    { id: 'bill', name: 'Bills', icon: '📄', count: notifications.filter(n => n.type === 'bill').length },
    { id: 'system', name: 'System', icon: '⚙️', count: notifications.filter(n => n.type === 'system').length },
  ];

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'transaction' && notification.data?.transactionId) {
      navigate(`/transactions/${notification.data.transactionId}`);
    } else if (notification.type === 'referral') {
      navigate('/referrals');
    } else if (notification.type === 'bill') {
      navigate('/bill-reminders');
    } else if (notification.type === 'security') {
      navigate('/security');
    }
  };

  const getNotificationIcon = (type) => {
    const typeData = notificationTypes.find(t => t.id === type);
    return typeData?.icon || '📬';
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'transaction':
        return '#6366F1';
      case 'promotion':
        return '#F59E0B';
      case 'security':
        return '#EF4444';
      case 'referral':
        return '#10B981';
      case 'bill':
        return '#8B5CF6';
      case 'system':
        return '#64748B';
      default:
        return '#6366F1';
    }
  };

  return (
    <div className="notifications-page">
      <Header />

      <div className="notifications-container">
        <div className="notifications-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <div className="header-content">
            <h1 className="notifications-title">Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-read-button" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="notification-filters">
          {notificationTypes.map(type => (
            <button
              key={type.id}
              className={`filter-tab ${activeFilter === type.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(type.id)}
            >
              <span className="filter-icon">{type.icon}</span>
              <span className="filter-name">{type.name}</span>
              {type.count > 0 && (
                <span className="filter-count">{type.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <Card 
                key={notification.id} 
                glass 
                className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-indicator" style={{ backgroundColor: getNotificationColor(notification.type) }}></div>
                <div className="notification-icon" style={{ backgroundColor: `${getNotificationColor(notification.type)}20` }}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h4 className="notification-title">{notification.title}</h4>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{formatDateTime(notification.createdAt)}</span>
                </div>
                <div className="notification-actions">
                  {!notification.isRead && (
                    <button 
                      className="mark-read-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <Card glass padding="large" className="empty-state">
              <span className="empty-icon">🔔</span>
              <h3>No notifications</h3>
              <p>
                {activeFilter === 'all' 
                  ? "You're all caught up!" 
                  : `No ${activeFilter} notifications`}
              </p>
            </Card>
          )}
        </div>

        {/* Notification Preferences */}
        <Card glass padding="large" className="preferences-card">
          <h3 className="section-title">Notification Preferences</h3>
          <p className="section-subtitle">Choose what notifications you want to receive</p>

          <div className="preferences-list">
            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">💳</span>
                <div>
                  <h4>Transaction Notifications</h4>
                  <p>Get notified about all your transactions</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">🎁</span>
                <div>
                  <h4>Promotional Offers</h4>
                  <p>Receive special offers and promotions</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">🔒</span>
                <div>
                  <h4>Security Alerts</h4>
                  <p>Important security notifications</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">📄</span>
                <div>
                  <h4>Bill Reminders</h4>
                  <p>Reminders for upcoming bills</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
