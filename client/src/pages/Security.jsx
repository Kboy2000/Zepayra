import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card, Button, PinInput } from '../components/common';
import './Security.css';

const Security = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    biometric: false,
    loginAlerts: true,
    transactionAlerts: true,
  });

  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPin, setNewPin] = useState('');

  // Mock active sessions
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'Lagos, Nigeria', ip: '197.210.xxx.xxx', lastActive: '2024-01-12T10:30:00', isCurrent: true },
    { id: 2, device: 'Safari on iPhone', location: 'Abuja, Nigeria', ip: '197.211.xxx.xxx', lastActive: '2024-01-11T18:45:00', isCurrent: false },
  ]);

  // Mock login history
  const loginHistory = [
    { id: 1, device: 'Chrome on Windows', location: 'Lagos, Nigeria', time: '2024-01-12T10:30:00', status: 'successful' },
    { id: 2, device: 'Safari on iPhone', location: 'Abuja, Nigeria', time: '2024-01-11T18:45:00', status: 'successful' },
    { id: 3, device: 'Firefox on Mac', location: 'Port Harcourt, Nigeria', time: '2024-01-10T14:20:00', status: 'failed' },
  ];

  const handleToggleSetting = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleRevokeSession = (id) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const handleChangePin = () => {
    if (newPin.length === 4) {
      alert('PIN changed successfully!');
      setShowChangePinModal(false);
      setNewPin('');
    }
  };

  const getSecurityLevel = () => {
    const enabledCount = Object.values(settings).filter(Boolean).length;
    if (enabledCount >= 3) return { level: 'Strong', color: '#10B981', percentage: 100 };
    if (enabledCount === 2) return { level: 'Medium', color: '#F59E0B', percentage: 66 };
    return { level: 'Weak', color: '#EF4444', percentage: 33 };
  };

  const securityLevel = getSecurityLevel();

  return (
    <div className="security-page">
      <Header />

      <div className="security-container">
        <div className="security-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="security-title">Security Center</h1>
          <p className="security-subtitle">Protect your account and transactions</p>
        </div>

        {/* Security Level */}
        <Card glass padding="large" className="security-level-card">
          <div className="security-level-header">
            <div>
              <h3>Security Level</h3>
              <p className="security-level-label" style={{ color: securityLevel.color }}>
                {securityLevel.level}
              </p>
            </div>
            <div className="security-icon">🛡️</div>
          </div>
          <div className="security-progress">
            <div 
              className="security-progress-bar" 
              style={{ width: `${securityLevel.percentage}%`, backgroundColor: securityLevel.color }}
            ></div>
          </div>
          <p className="security-tip">Enable more security features to strengthen your account</p>
        </Card>

        {/* Security Settings */}
        <Card glass padding="large" className="security-settings-card">
          <h3 className="section-title">Security Settings</h3>

          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">🔐</span>
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.twoFactorAuth}
                  onChange={() => handleToggleSetting('twoFactorAuth')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">👆</span>
                <div>
                  <h4>Biometric Authentication</h4>
                  <p>Use fingerprint or face ID to login</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.biometric}
                  onChange={() => handleToggleSetting('biometric')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">🔔</span>
                <div>
                  <h4>Login Alerts</h4>
                  <p>Get notified of new login attempts</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.loginAlerts}
                  onChange={() => handleToggleSetting('loginAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">💳</span>
                <div>
                  <h4>Transaction Alerts</h4>
                  <p>Receive alerts for all transactions</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.transactionAlerts}
                  onChange={() => handleToggleSetting('transactionAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="security-actions">
          <Button variant="primary" size="medium" fullWidth onClick={() => setShowChangePinModal(true)}>
            🔑 Change Transaction PIN
          </Button>
          <Button variant="secondary" size="medium" fullWidth>
            🔒 Change Password
          </Button>
        </div>

        {/* Active Sessions */}
        <Card glass padding="large" className="sessions-card">
          <h3 className="section-title">Active Sessions</h3>
          <p className="section-subtitle">Manage devices with access to your account</p>

          <div className="sessions-list">
            {sessions.map(session => (
              <div key={session.id} className="session-item">
                <div className="session-icon">
                  {session.device.includes('iPhone') ? '📱' : '💻'}
                </div>
                <div className="session-info">
                  <h4>{session.device}</h4>
                  <p>{session.location}</p>
                  <span className="session-time">Last active: {new Date(session.lastActive).toLocaleString()}</span>
                </div>
                {session.isCurrent ? (
                  <span className="current-badge">Current</span>
                ) : (
                  <button className="revoke-button" onClick={() => handleRevokeSession(session.id)}>
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Login History */}
        <Card glass padding="large" className="history-card">
          <h3 className="section-title">Login History</h3>

          <div className="history-list">
            {loginHistory.map(login => (
              <div key={login.id} className="history-item">
                <div className="history-icon">
                  {login.status === 'successful' ? '✅' : '❌'}
                </div>
                <div className="history-info">
                  <h4>{login.device}</h4>
                  <p>{login.location}</p>
                  <span className="history-time">{new Date(login.time).toLocaleString()}</span>
                </div>
                <span className={`status-badge ${login.status}`}>
                  {login.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Change PIN Modal */}
        {showChangePinModal && (
          <div className="pin-modal-overlay" onClick={() => setShowChangePinModal(false)}>
            <Card glass padding="large" className="pin-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Change Transaction PIN</h3>
              <p className="modal-subtitle">Enter your new 4-digit PIN</p>

              <PinInput
                length={4}
                onComplete={(pin) => setNewPin(pin)}
                onChange={(pin) => setNewPin(pin)}
              />

              <div className="modal-actions">
                <Button variant="primary" size="medium" fullWidth onClick={handleChangePin} disabled={newPin.length !== 4}>
                  Change PIN
                </Button>
                <button className="cancel-button" onClick={() => setShowChangePinModal(false)}>
                  Cancel
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;
