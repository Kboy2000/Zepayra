import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card, Button } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, copyToClipboard } from '../utils/formatters';
import './Referrals.css';

const Referrals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [copySuccess, setCopySuccess] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  // Generate referral code from user email/ID
  const referralCode = user?.email ? user.email.substring(0, 6).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase() : 'ZEPAYRA2024';
  const referralLink = `https://zepayra.com/register?ref=${referralCode}`;

  // Mock referral stats (in production, fetch from backend)
  const [stats, setStats] = useState({
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingReferrals: 4,
    totalEarnings: 4000,
    availableBalance: 3500,
    withdrawnAmount: 500,
  });

  // Mock referral history
  const [referrals, setReferrals] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'successful', reward: 500, date: '2024-01-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'successful', reward: 500, date: '2024-01-09' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'pending', reward: 500, date: '2024-01-08' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', status: 'successful', reward: 500, date: '2024-01-07' },
  ]);

  // Mock leaderboard
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Ahmed K.', referrals: 156, earnings: 78000 },
    { rank: 2, name: 'Fatima A.', referrals: 142, earnings: 71000 },
    { rank: 3, name: 'Chidi O.', referrals: 128, earnings: 64000 },
    { rank: 4, name: 'Amina B.', referrals: 115, earnings: 57500 },
    { rank: 5, name: 'Tunde E.', referrals: 98, earnings: 49000 },
    { rank: 6, name: 'Ngozi M.', referrals: 87, earnings: 43500 },
    { rank: 7, name: 'Yusuf H.', referrals: 76, earnings: 38000 },
    { rank: 8, name: 'Blessing C.', referrals: 65, earnings: 32500 },
    { rank: 9, name: 'Ibrahim S.', referrals: 54, earnings: 27000 },
    { rank: 10, name: 'Grace N.', referrals: 43, earnings: 21500 },
  ]);

  // Bonus tiers
  const bonusTiers = [
    { referrals: 5, bonus: 1000, unlocked: stats.successfulReferrals >= 5 },
    { referrals: 10, bonus: 2500, unlocked: stats.successfulReferrals >= 10 },
    { referrals: 50, bonus: 15000, unlocked: stats.successfulReferrals >= 50 },
    { referrals: 100, bonus: 35000, unlocked: stats.successfulReferrals >= 100 },
  ];

  const handleCopy = async (text, label) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleShare = (platform) => {
    const text = `Join me on ZEPAYRA and get ₦500 bonus! Use my referral code: ${referralCode}`;
    const encodedText = encodeURIComponent(text);
    const encodedLink = encodeURIComponent(referralLink);

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedLink}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedText}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  const handleWithdrawEarnings = () => {
    // TODO: Implement withdrawal to main wallet
    alert('Withdraw earnings feature coming soon!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'expired':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  return (
    <div className="referrals-page">
      <Header />

      <div className="referrals-container">
        <div className="referrals-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="referrals-title">Referral Program</h1>
          <p className="referrals-subtitle">Invite friends and earn rewards together!</p>
        </div>

        {/* Referral Stats */}
        <div className="referral-stats">
          <Card glass className="stat-card primary">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-label">Total Earnings</span>
              <span className="stat-value">{formatCurrency(stats.totalEarnings)}</span>
            </div>
          </Card>
          <Card glass className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-label">Successful</span>
              <span className="stat-value">{stats.successfulReferrals}</span>
            </div>
          </Card>
          <Card glass className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{stats.pendingReferrals}</span>
            </div>
          </Card>
          <Card glass className="stat-card">
            <div className="stat-icon">💵</div>
            <div className="stat-content">
              <span className="stat-label">Available</span>
              <span className="stat-value">{formatCurrency(stats.availableBalance)}</span>
            </div>
          </Card>
        </div>

        {/* Referral Code & Share */}
        <Card glass padding="large" className="referral-code-card">
          <h3 className="section-title">Your Referral Code</h3>
          
          <div className="referral-code-display">
            <div className="code-box">
              <span className="code">{referralCode}</span>
              <button 
                className="copy-icon-button"
                onClick={() => handleCopy(referralCode, 'code')}
              >
                {copySuccess === 'code' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="referral-link-display">
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className="link-input"
            />
            <button 
              className="copy-button"
              onClick={() => handleCopy(referralLink, 'link')}
            >
              {copySuccess === 'link' ? '✓ Copied' : 'Copy Link'}
            </button>
          </div>

          <div className="share-buttons">
            <button className="share-button whatsapp" onClick={() => handleShare('whatsapp')}>
              <span className="share-icon">💬</span>
              WhatsApp
            </button>
            <button className="share-button twitter" onClick={() => handleShare('twitter')}>
              <span className="share-icon">🐦</span>
              Twitter
            </button>
            <button className="share-button facebook" onClick={() => handleShare('facebook')}>
              <span className="share-icon">📘</span>
              Facebook
            </button>
            <button className="share-button qr" onClick={() => setShowQRCode(!showQRCode)}>
              <span className="share-icon">📱</span>
              QR Code
            </button>
          </div>

          {showQRCode && (
            <div className="qr-code-container">
              <div className="qr-placeholder">
                <p>QR Code for: {referralLink}</p>
                <p className="qr-note">Scan to register with your referral code</p>
              </div>
            </div>
          )}
        </Card>

        {/* Bonus Tiers */}
        <Card glass padding="large" className="bonus-tiers-card">
          <h3 className="section-title">Bonus Tiers</h3>
          <p className="section-subtitle">Unlock bigger rewards as you refer more friends!</p>

          <div className="bonus-tiers">
            {bonusTiers.map((tier, index) => (
              <div key={index} className={`tier-card ${tier.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="tier-icon">
                  {tier.unlocked ? '🎉' : '🔒'}
                </div>
                <div className="tier-info">
                  <h4>{tier.referrals} Referrals</h4>
                  <p className="tier-bonus">{formatCurrency(tier.bonus)} Bonus</p>
                </div>
                {tier.unlocked && <span className="unlocked-badge">Unlocked!</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* Leaderboard */}
        <Card glass padding="large" className="leaderboard-card">
          <h3 className="section-title">Top Referrers</h3>
          <p className="section-subtitle">See how you rank against other users</p>

          <div className="leaderboard">
            {leaderboard.map((entry) => (
              <div key={entry.rank} className={`leaderboard-entry ${entry.rank <= 3 ? 'top-three' : ''}`}>
                <div className="rank-badge">
                  {entry.rank === 1 && '🥇'}
                  {entry.rank === 2 && '🥈'}
                  {entry.rank === 3 && '🥉'}
                  {entry.rank > 3 && `#${entry.rank}`}
                </div>
                <div className="entry-info">
                  <h4>{entry.name}</h4>
                  <p>{entry.referrals} referrals</p>
                </div>
                <div className="entry-earnings">
                  {formatCurrency(entry.earnings)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Referral History */}
        <Card glass padding="large" className="referral-history-card">
          <h3 className="section-title">Referral History</h3>

          <div className="referral-history">
            {referrals.map((referral) => (
              <div key={referral.id} className="referral-item">
                <div className="referral-avatar">
                  {referral.name.charAt(0)}
                </div>
                <div className="referral-info">
                  <h4>{referral.name}</h4>
                  <p>{referral.email}</p>
                  <span className="referral-date">{new Date(referral.date).toLocaleDateString()}</span>
                </div>
                <div className="referral-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(referral.status) }}
                  >
                    {referral.status}
                  </span>
                  <span className="referral-reward">{formatCurrency(referral.reward)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Withdraw Earnings */}
        {stats.availableBalance > 0 && (
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={handleWithdrawEarnings}
          >
            Withdraw {formatCurrency(stats.availableBalance)} to Wallet
          </Button>
        )}

        {/* How It Works */}
        <Card glass padding="large" className="how-it-works-card">
          <h3 className="section-title">How It Works</h3>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Share Your Code</h4>
                <p>Share your unique referral code with friends and family</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>They Sign Up</h4>
                <p>Your friend registers using your referral code</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Both Get Rewarded</h4>
                <p>You earn ₦500 and they get ₦500 welcome bonus!</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Referrals;
