import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card, Button } from '../components/common';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-container">
        <div className="profile-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">View and manage your personal information</p>
        </div>

        <Card glass padding="large" className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <h2 className="profile-name">{user?.firstName} {user?.lastName}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>

          <div className="profile-info-section">
            <h3 className="section-title">Personal Information</h3>
            
            <div className="info-grid">
              <div className="info-item">
                <label>First Name</label>
                <p>{user?.firstName}</p>
              </div>

              <div className="info-item">
                <label>Last Name</label>
                <p>{user?.lastName}</p>
              </div>

              <div className="info-item">
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>

              <div className="info-item">
                <label>Phone Number</label>
                <p>{user?.phone || 'Not provided'}</p>
              </div>

              <div className="info-item">
                <label>Account Status</label>
                <p className="status-badge active">Active</p>
              </div>

              <div className="info-item">
                <label>Member Since</label>
                <p>{new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <Button variant="primary" size="medium" onClick={() => navigate('/account-settings')}>
              Edit Profile
            </Button>
            <Button variant="secondary" size="medium" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
