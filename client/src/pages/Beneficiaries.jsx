import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card, Button } from '../components/common';
import './Beneficiaries.css';

const Beneficiaries = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock beneficiaries data
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: 'Mom', phone: '08012345678', serviceType: 'airtime', group: 'family', isFavorite: true, lastUsed: '2024-01-10', transactionCount: 45 },
    { id: 2, name: 'Dad', phone: '08087654321', serviceType: 'data', group: 'family', isFavorite: true, lastUsed: '2024-01-09', transactionCount: 38 },
    { id: 3, name: 'John (Work)', meterNumber: '1234567890', serviceType: 'electricity', group: 'work', isFavorite: false, lastUsed: '2024-01-08', transactionCount: 12 },
    { id: 4, name: 'Sarah', smartCardNumber: '9876543210', serviceType: 'tv', group: 'friends', isFavorite: false, lastUsed: '2024-01-07', transactionCount: 8 },
    { id: 5, name: 'Brother', phone: '08098765432', serviceType: 'airtime', group: 'family', isFavorite: true, lastUsed: '2024-01-06', transactionCount: 25 },
  ]);

  const serviceTypes = [
    { id: 'all', name: 'All', icon: '📱', count: beneficiaries.length },
    { id: 'airtime', name: 'Airtime', icon: '📞', count: beneficiaries.filter(b => b.serviceType === 'airtime').length },
    { id: 'data', name: 'Data', icon: '📡', count: beneficiaries.filter(b => b.serviceType === 'data').length },
    { id: 'electricity', name: 'Electricity', icon: '⚡', count: beneficiaries.filter(b => b.serviceType === 'electricity').length },
    { id: 'tv', name: 'Cable TV', icon: '📺', count: beneficiaries.filter(b => b.serviceType === 'tv').length },
  ];

  const groups = [
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: '#10B981' },
    { id: 'friends', name: 'Friends', icon: '👥', color: '#6366F1' },
    { id: 'work', name: 'Work', icon: '💼', color: '#F59E0B' },
  ];

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesTab = activeTab === 'all' || b.serviceType === activeTab;
    const matchesSearch = !searchQuery || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone?.includes(searchQuery) ||
      b.meterNumber?.includes(searchQuery) ||
      b.smartCardNumber?.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const favoriteBeneficiaries = beneficiaries.filter(b => b.isFavorite);

  const handleQuickSend = (beneficiary) => {
    // Navigate to appropriate service page with pre-filled data
    switch (beneficiary.serviceType) {
      case 'airtime':
        navigate('/airtime', { state: { phone: beneficiary.phone } });
        break;
      case 'data':
        navigate('/data', { state: { phone: beneficiary.phone } });
        break;
      case 'electricity':
        navigate('/electricity', { state: { meterNumber: beneficiary.meterNumber } });
        break;
      case 'tv':
        navigate('/tv', { state: { smartCardNumber: beneficiary.smartCardNumber } });
        break;
      default:
        break;
    }
  };

  const toggleFavorite = (id) => {
    setBeneficiaries(beneficiaries.map(b => 
      b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
    ));
  };

  const deleteBeneficiary = (id) => {
    if (confirm('Are you sure you want to remove this beneficiary?')) {
      setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    }
  };

  const getServiceIcon = (serviceType) => {
    const service = serviceTypes.find(s => s.id === serviceType);
    return service?.icon || '📱';
  };

  const getGroupColor = (group) => {
    const groupData = groups.find(g => g.id === group);
    return groupData?.color || '#6366F1';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="beneficiaries-page">
      <Header />

      <div className="beneficiaries-container">
        <div className="beneficiaries-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="beneficiaries-title">Beneficiaries</h1>
          <p className="beneficiaries-subtitle">Quick access to your frequent recipients</p>
        </div>

        {/* Search and Add */}
        <Card glass padding="medium" className="search-card">
          <div className="search-row">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search beneficiaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="add-button" onClick={() => setShowAddModal(true)}>
              + Add Beneficiary
            </button>
          </div>
        </Card>

        {/* Service Type Tabs */}
        <div className="service-tabs">
          {serviceTypes.map(service => (
            <button
              key={service.id}
              className={`service-tab ${activeTab === service.id ? 'active' : ''}`}
              onClick={() => setActiveTab(service.id)}
            >
              <span className="tab-icon">{service.icon}</span>
              <span className="tab-name">{service.name}</span>
              <span className="tab-count">{service.count}</span>
            </button>
          ))}
        </div>

        {/* Favorites */}
        {favoriteBeneficiaries.length > 0 && (
          <div className="favorites-section">
            <h3 className="section-title">⭐ Favorites</h3>
            <div className="beneficiaries-grid">
              {favoriteBeneficiaries.map(beneficiary => (
                <Card key={beneficiary.id} glass className="beneficiary-card favorite">
                  <div className="beneficiary-header">
                    <div className="beneficiary-avatar" style={{ background: getGroupColor(beneficiary.group) }}>
                      {getInitials(beneficiary.name)}
                    </div>
                    <button 
                      className="favorite-button active"
                      onClick={() => toggleFavorite(beneficiary.id)}
                    >
                      ⭐
                    </button>
                  </div>
                  <div className="beneficiary-info">
                    <h4>{beneficiary.name}</h4>
                    <p className="beneficiary-detail">
                      {beneficiary.phone || beneficiary.meterNumber || beneficiary.smartCardNumber}
                    </p>
                    <div className="beneficiary-meta">
                      <span className="service-badge">
                        {getServiceIcon(beneficiary.serviceType)} {beneficiary.serviceType}
                      </span>
                      <span className="transaction-count">{beneficiary.transactionCount} txns</span>
                    </div>
                  </div>
                  <div className="beneficiary-actions">
                    <button className="quick-send-button" onClick={() => handleQuickSend(beneficiary)}>
                      Quick Send
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Beneficiaries */}
        <div className="all-beneficiaries-section">
          <h3 className="section-title">All Beneficiaries</h3>
          
          {filteredBeneficiaries.length > 0 ? (
            <div className="beneficiaries-grid">
              {filteredBeneficiaries.map(beneficiary => (
                <Card key={beneficiary.id} glass className="beneficiary-card">
                  <div className="beneficiary-header">
                    <div className="beneficiary-avatar" style={{ background: getGroupColor(beneficiary.group) }}>
                      {getInitials(beneficiary.name)}
                    </div>
                    <button 
                      className={`favorite-button ${beneficiary.isFavorite ? 'active' : ''}`}
                      onClick={() => toggleFavorite(beneficiary.id)}
                    >
                      {beneficiary.isFavorite ? '⭐' : '☆'}
                    </button>
                  </div>
                  <div className="beneficiary-info">
                    <h4>{beneficiary.name}</h4>
                    <p className="beneficiary-detail">
                      {beneficiary.phone || beneficiary.meterNumber || beneficiary.smartCardNumber}
                    </p>
                    <div className="beneficiary-meta">
                      <span className="service-badge">
                        {getServiceIcon(beneficiary.serviceType)} {beneficiary.serviceType}
                      </span>
                      <span className="transaction-count">{beneficiary.transactionCount} txns</span>
                    </div>
                  </div>
                  <div className="beneficiary-actions">
                    <button className="quick-send-button" onClick={() => handleQuickSend(beneficiary)}>
                      Quick Send
                    </button>
                    <button className="delete-button" onClick={() => deleteBeneficiary(beneficiary.id)}>
                      🗑️
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card glass padding="large" className="empty-state">
              <span className="empty-icon">👥</span>
              <h3>No beneficiaries found</h3>
              <p>
                {searchQuery 
                  ? 'Try adjusting your search' 
                  : 'Add beneficiaries to send money quickly'}
              </p>
              <button className="add-beneficiary-button" onClick={() => setShowAddModal(true)}>
                + Add Your First Beneficiary
              </button>
            </Card>
          )}
        </div>

        {/* Groups Section */}
        <Card glass padding="large" className="groups-card">
          <h3 className="section-title">Groups</h3>
          <div className="groups-grid">
            {groups.map(group => {
              const count = beneficiaries.filter(b => b.group === group.id).length;
              return (
                <div key={group.id} className="group-item" style={{ borderColor: group.color }}>
                  <span className="group-icon">{group.icon}</span>
                  <div className="group-info">
                    <h4>{group.name}</h4>
                    <p>{count} beneficiaries</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Beneficiaries;
