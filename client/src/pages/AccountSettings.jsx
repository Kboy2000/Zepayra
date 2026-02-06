import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card, Button, Input } from '../components/common';
import './AccountSettings.css';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="settings-page">
      <Header />

      <div className="settings-container">
        <div className="settings-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="settings-title">Account Settings</h1>
          <p className="settings-subtitle">Manage your account preferences and security</p>
        </div>

        <div className="settings-layout">
          <div className="settings-sidebar">
            <button 
              className={`sidebar-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <span className="tab-icon">⚙️</span>
              <span>General</span>
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="tab-icon">🔒</span>
              <span>Security</span>
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="tab-icon">🔔</span>
              <span>Notifications</span>
            </button>
          </div>

          <div className="settings-content">
            <Card glass padding="large">
              {activeTab === 'general' && (
                <div className="settings-section">
                  <h2 className="section-title">General Settings</h2>
                  <p className="section-description">Update your personal information</p>
                  
                  <div className="settings-form">
                    <Input label="First Name" placeholder="Enter first name" />
                    <Input label="Last Name" placeholder="Enter last name" />
                    <Input label="Email Address" type="email" placeholder="Enter email" />
                    <Input label="Phone Number" type="tel" placeholder="Enter phone number" />
                    
                    <div className="form-actions">
                      <Button variant="primary">Save Changes</Button>
                      <Button variant="secondary">Cancel</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="settings-section">
                  <h2 className="section-title">Security Settings</h2>
                  <p className="section-description">Manage your password and security preferences</p>
                  
                  <div className="settings-form">
                    <Input label="Current Password" type="password" placeholder="Enter current password" />
                    <Input label="New Password" type="password" placeholder="Enter new password" />
                    <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
                    
                    <div className="form-actions">
                      <Button variant="primary">Update Password</Button>
                      <Button variant="secondary">Cancel</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h2 className="section-title">Notification Preferences</h2>
                  <p className="section-description">Choose how you want to be notified</p>
                  
                  <div className="notification-options">
                    <div className="notification-item">
                      <div>
                        <h4>Email Notifications</h4>
                        <p>Receive updates via email</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-item">
                      <div>
                        <h4>Transaction Alerts</h4>
                        <p>Get notified of all transactions</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-item">
                      <div>
                        <h4>Promotional Emails</h4>
                        <p>Receive offers and promotions</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
