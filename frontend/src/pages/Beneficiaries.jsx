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
  Smartphone,
  ChevronRight,
  Filter,
  MoreVertical,
  History
} from 'lucide-react';
import { Card, Button, Input } from '../components/common';
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
    { id: 3, name: 'Office Meter', meterNumber: '1234567890', serviceType: 'electricity', group: 'work', isFavorite: false, lastUsed: '2024-01-08', transactionCount: 12 },
    { id: 4, name: 'Home Cable', smartCardNumber: '9876543210', serviceType: 'tv', group: 'friends', isFavorite: false, lastUsed: '2024-01-07', transactionCount: 8 },
    { id: 5, name: 'Uncle Segun', phone: '08098765432', serviceType: 'airtime', group: 'family', isFavorite: true, lastUsed: '2024-01-06', transactionCount: 25 },
  ]);

  const serviceTypes = [
    { id: 'all', name: 'All', icon: History },
    { id: 'airtime', name: 'Airtime', icon: Phone },
    { id: 'data', name: 'Data', icon: Wifi },
    { id: 'electricity', name: 'Electricity', icon: Zap },
    { id: 'tv', name: 'Cable TV', icon: Tv },
  ];

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesTab = activeTab === 'all' || b.serviceType === activeTab;
    const matchesSearch = !searchQuery || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone?.includes(searchQuery) ||
      b.meterNumber?.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleQuickPay = (b) => {
    const route = b.serviceType === 'tv' ? '/tv' : `/${b.serviceType}`;
    navigate(route, { state: { beneficiary: b } });
  };

  return (
    <div className="beneficiaries-page">
      <div className="beneficiaries-container">
        <header className="beneficiaries-header">
           <div className="header-top">
             <button className="back-button" onClick={() => navigate(-1)}>
               <ArrowLeft size={20} />
             </button>
             <h1>Beneficiaries</h1>
             <button className="add-btn" onClick={() => setShowAddModal(true)}>
               <Plus size={24} />
             </button>
           </div>
           
           <div className="search-and-filter">
             <div className="premium-search">
               <Search size={18} />
               <input 
                 type="text" 
                 placeholder="Search by name or number..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
             <button className="filter-trigger">
               <Filter size={20} />
             </button>
           </div>

           <div className="tabs-container">
             {serviceTypes.map(type => (
               <button 
                 key={type.id}
                 className={`tab-item ${activeTab === type.id ? 'active' : ''}`}
                 onClick={() => setActiveTab(type.id)}
               >
                 <span>{type.name}</span>
               </button>
             ))}
           </div>
        </header>

        <main className="beneficiaries-content">
          {filteredBeneficiaries.length > 0 ? (
            <div className="beneficiary-list">
              {filteredBeneficiaries.map(b => (
                <div key={b.id} className="beneficiary-item" onClick={() => handleQuickPay(b)}>
                   <div className="beneficiary-main">
                      <div className="avatar-box">
                         {getInitials(b.name)}
                         {b.isFavorite && <span className="fav-star"><Star size={10} fill="#F59E0B" /></span>}
                      </div>
                      <div className="beneficiary-details">
                         <h3>{b.name}</h3>
                         <p>{b.phone || b.meterNumber || b.smartCardNumber}</p>
                      </div>
                   </div>
                   <div className="beneficiary-actions">
                      <div className="service-tag">
                         {b.serviceType}
                      </div>
                      <ChevronRight size={18} color="var(--text-tertiary)" />
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Users size={64} opacity={0.2} />
              <p>No beneficiaries found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Beneficiaries;
