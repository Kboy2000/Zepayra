import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Phone, 
  Wifi, 
  Zap, 
  Tv, 
  Star, 
  Trash2,
  Users,
  Briefcase,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
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
    { id: 'all', name: 'All', icon: Smartphone, count: beneficiaries.length },
    { id: 'airtime', name: 'Airtime', icon: Phone, count: beneficiaries.filter(b => b.serviceType === 'airtime').length },
    { id: 'data', name: 'Data', icon: Wifi, count: beneficiaries.filter(b => b.serviceType === 'data').length },
    { id: 'electricity', name: 'Electricity', icon: Zap, count: beneficiaries.filter(b => b.serviceType === 'electricity').length },
    { id: 'tv', name: 'Cable TV', icon: Tv, count: beneficiaries.filter(b => b.serviceType === 'tv').length },
  ];

  const groups = [
    { id: 'family', name: 'Family', icon: Users, color: '#10B981' },
    { id: 'friends', name: 'Friends', icon: Users, color: '#6366F1' },
    { id: 'work', name: 'Work', icon: Briefcase, color: '#F59E0B' },
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
    const paths = {
      airtime: '/airtime',
      data: '/data',
      electricity: '/electricity',
      tv: '/tv'
    };
    
    const state = {
      airtime: { phone: beneficiary.phone },
      data: { phone: beneficiary.phone },
      electricity: { meterNumber: beneficiary.meterNumber },
      tv: { smartCardNumber: beneficiary.smartCardNumber }
    };

    navigate(paths[beneficiary.serviceType], { state: state[beneficiary.serviceType] });
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

  const ServiceIcon = ({ type, size = 16 }) => {
    const service = serviceTypes.find(s => s.id === type);
    const Icon = service?.icon || Smartphone;
    return <Icon size={size} />;
  };

  const getGroupColor = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    return group?.color || '#6366F1';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="beneficiaries-page">
      <div className="beneficiaries-container">
        <div className="beneficiaries-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <div className="header-text">
            <h1 className="beneficiaries-title">Beneficiaries</h1>
            <p className="beneficiaries-subtitle">Manage your frequent recipients</p>
          </div>
          <Button 
            primary 
            className="add-beneficiary-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            <span>Add New</span>
          </Button>
        </div>

        {/* Search */}
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or number..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Service Type Filters */}
        <div className="service-filters">
          {serviceTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                className={`filter-chip ${activeTab === type.id ? 'active' : ''}`}
                onClick={() => setActiveTab(type.id)}
              >
                <Icon size={16} />
                <span>{type.name}</span>
                <span className="count">{type.count}</span>
              </button>
            );
          })}
        </div>

        {/* Favorites */}
        {favoriteBeneficiaries.length > 0 && searchQuery === '' && (
          <div className="favorites-section">
            <h3 className="section-title">
              <Star size={18} className="text-warning fill-warning" />
              <span>Favorites</span>
            </h3>
            <div className="favorites-scroll">
              {favoriteBeneficiaries.map(beneficiary => (
                <div key={beneficiary.id} className="favorite-item" onClick={() => handleQuickSend(beneficiary)}>
                  <div className="favorite-avatar" style={{ background: getGroupColor(beneficiary.group) }}>
                    {getInitials(beneficiary.name)}
                  </div>
                  <span className="favorite-name">{beneficiary.name}</span>
                </div>
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
                      <Star size={18} fill={beneficiary.isFavorite ? "#F59E0B" : "none"} color={beneficiary.isFavorite ? "#F59E0B" : "currentColor"} />
                    </button>
                  </div>
                  <div className="beneficiary-info">
                    <h4>{beneficiary.name}</h4>
                    <p className="beneficiary-detail">
                      {beneficiary.phone || beneficiary.meterNumber || beneficiary.smartCardNumber}
                    </p>
                    <div className="beneficiary-meta">
                      <span className="service-badge">
                        <ServiceIcon type={beneficiary.serviceType} />
                        <span style={{ textTransform: 'capitalize' }}>{beneficiary.serviceType}</span>
                      </span>
                      <span className="transaction-count">{beneficiary.transactionCount} txns</span>
                    </div>
                  </div>
                  <div className="beneficiary-actions">
                    <button className="quick-send-button" onClick={() => handleQuickSend(beneficiary)}>
                      Quick Send
                    </button>
                    <button className="delete-button" onClick={() => deleteBeneficiary(beneficiary.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card glass padding="large" className="empty-state">
              <span className="empty-icon">
                <Users size={48} strokeWidth={1.5} />
              </span>
              <h3>No beneficiaries found</h3>
              <p>
                {searchQuery 
                  ? 'Try adjusting your search' 
                  : 'Add beneficiaries to send money quickly'}
              </p>
              <Button primary onClick={() => setShowAddModal(true)}>
                <Plus size={20} />
                <span>Add Your First Beneficiary</span>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Beneficiaries;
