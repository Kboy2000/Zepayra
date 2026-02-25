import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
 Broadway
import { 
  ShieldCheck, 
  Smartphone, 
  Bell, 
  CreditCard, 
  Key, 
  Lock, 
  Monitor, 
  MapPin, 
  Check, 
  X, 
  ArrowLeft,
  Fingerprint,
  ChevronRight,
  ShieldAlert,
  History
} from 'lucide-react';
 Broadway
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
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handleChangePin = () => {
    if (newPin.length === 4) {
      setShowChangePinModal(false);
      setNewPin('');
    }
  };

  const getSecurityLevel = () => {
    const enabledCount = Object.values(settings).filter(Boolean).length;
    if (enabledCount >= 3) return { level: 'Excellent', color: 'var(--color-success)', percentage: 100, icon: ShieldCheck };
    if (enabledCount === 2) return { level: 'Good', color: 'var(--color-primary)', percentage: 66, icon: ShieldCheck };
    return { level: 'Action Required', color: 'var(--color-error)', percentage: 33, icon: ShieldAlert };
  };

  const securityLevel = getSecurityLevel();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="security-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="security-container">
        <header className="security-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="security-title">Security Center</h1>
          <p className="security-subtitle">Real-time protection for your Zepayra account</p>
        </header>

        {/* Security Level */}
        <motion.div variants={itemVariants}>
          <Card glass className="security-level-card">
            <div className="security-level-header">
              <div className="level-info">
                <h3>Security Score</h3>
                <div className="level-badge" style={{ backgroundColor: `${securityLevel.color}15`, color: securityLevel.color }}>
                  <securityLevel.icon size={16} />
                  <span>{securityLevel.level}</span>
                </div>
              </div>
              <div className="security-percentage">{securityLevel.percentage}%</div>
            </div>
            <div className="security-progress-track">
              <motion.div 
                className="security-progress-fill" 
                initial={{ width: 0 }}
                animate={{ width: `${securityLevel.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ backgroundColor: securityLevel.color }}
              />
            </div>
            <p className="security-tip">
              {securityLevel.percentage < 100 
                ? "Strengthen your account by enabling more security features below." 
                : "Your account is fully protected. Great job!"}
            </p>
          </Card>
        </motion.div>

        {/* Security Settings Area */}
        <section className="security-section">
          <h3 className="section-title">Protective Measures</h3>
          <div className="settings-grid">
            <motion.div variants={itemVariants}>
              <Card glass className="setting-card">
                <div className="setting-header">
                  <div className="icon-box"><Key size={20} /></div>
                  <label className="premium-toggle">
                    <input 
                      type="checkbox" 
                      checked={settings.twoFactorAuth}
                      onChange={() => handleToggleSetting('twoFactorAuth')}
                    />
                    <span className="toggle-track"></span>
                  </label>
                </div>
                <h4>Two-Factor Auth</h4>
                <p>Verify logins via email or SMS for maximum safety.</p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card glass className="setting-card">
                <div className="setting-header">
                  <div className="icon-box"><Fingerprint size={20} /></div>
                  <label className="premium-toggle">
                    <input 
                      type="checkbox" 
                      checked={settings.biometric}
                      onChange={() => handleToggleSetting('biometric')}
                    />
                    <span className="toggle-track"></span>
                  </label>
                </div>
                <h4>Biometrics</h4>
                <p>Unlock your account instantly using Face ID or Touch ID.</p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Active Sessions */}
        <motion.section variants={itemVariants} className="security-section">
          <div className="section-header-flex">
            <h3 className="section-title">Managed Devices</h3>
            <span className="count-badge">{sessions.length} active</span>
          </div>
          <div className="sessions-list">
            {sessions.map(session => (
              <Card key={session.id} className="session-item-card" glass>
                <div className="session-icon-box">
                  {session.device.includes('iPhone') ? <Smartphone size={20} /> : <Monitor size={20} />}
                </div>
                <div className="session-details">
                  <div className="device-name">
                    {session.device}
                    {session.isCurrent && <span className="current-label">Current</span>}
                  </div>
                  <div className="device-meta">
                    <span>{session.location}</span>
                    <span className="dot"></span>
                    <span>{session.ip}</span>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button className="text-action-btn" onClick={() => handleRevokeSession(session.id)}>
                    Revoke
                  </button>
                )}
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Login History */}
        <motion.section variants={itemVariants} className="security-section">
          <div className="section-header-flex">
            <h3 className="section-title">Login Activity</h3>
            <Button variant="ghost" size="sm">View All <ChevronRight size={14} /></Button>
          </div>
          <Card glass className="history-table-card">
            <div className="history-list">
              {loginHistory.map(login => (
                <div key={login.id} className="history-row">
                  <div className={`status-dot ${login.status}`}></div>
                  <div className="history-main">
                    <span className="history-device">{login.device}</span>
                    <span className="history-time">{new Date(login.time).toLocaleDateString()}</span>
                  </div>
                  <span className="history-loc">{login.location}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>

        <div className="bottom-actions">
           <Button variant="secondary" fullWidth onClick={() => navigate('/support')}>
              <ShieldAlert size={18} /> Report a security concern
           </Button>
        </div>
      </div>

      <AnimatePresence>
        {showChangePinModal && (
          <motion.div 
            className="premium-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowChangePinModal(false)}
          >
             <motion.div 
               className="premium-modal"
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               onClick={(e) => e.stopPropagation()}
             >
                <h3>Update Security PIN</h3>
                <p>Protect your transactions with a new 4-digit code.</p>
                <div className="pin-wrapper">
                  <PinInput length={4} onComplete={setNewPin} />
                </div>
                <div className="modal-footer">
                  <Button variant="ghost" onClick={() => setShowChangePinModal(false)}>Cancel</Button>
                  <Button onClick={handleChangePin} disabled={newPin.length !== 4}>Update PIN</Button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Security;
 Broadway
