import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  PiggyBank, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  X,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, Button, Input, Modal } from '../components/common';
import { formatCurrency } from '../utils/formatters';
import './Vaults.css';

const Vaults = () => {
  const navigate = useNavigate();
  
  // State for vaults
  const [vaults, setVaults] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      target: 500000,
      current: 125000,
      category: "Security",
      deadline: "2026-12-31",
      icon: ShieldCheck,
      color: "#6366F1",
      autoSave: true
    },
    {
      id: 2,
      name: "New Laptop",
      target: 750000,
      current: 450000,
      category: "Gadgets",
      deadline: "2026-06-15",
      icon: Target,
      color: "#8B5CF6",
      autoSave: false
    }
  ]);

  // Create Vault State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVault, setNewVault] = useState({
    name: '',
    target: '',
    category: 'General',
    deadline: ''
  });

  // Vault Detail State
  const [selectedVault, setSelectedVault] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Auto-save toggle
  const [globalAutoSave, setGlobalAutoSave] = useState(false);

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const handleCreateVault = (e) => {
    e.preventDefault();
    const vault = {
      ...newVault,
      id: Date.now(),
      current: 0,
      icon: Target,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      autoSave: false
    };
    setVaults([...vaults, vault]);
    setShowCreateModal(false);
    setNewVault({ name: '', target: '', category: 'General', deadline: '' });
  };

  const toggleVaultAutoSave = (id) => {
    setVaults(vaults.map(v => v.id === id ? { ...v, autoSave: !v.autoSave } : v));
  };

  const handleVaultClick = (vault) => {
    setSelectedVault(vault);
    setShowDetailModal(true);
  };

  return (
    <motion.div 
      className="vaults-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="vaults-container">
        <header className="vaults-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="vaults-title">Savings Vaults</h1>
          <p className="vaults-subtitle">Organize and reach your saving goals faster</p>
        </header>

        <section className="vaults-hero">
          <Card glass className="total-savings-summary">
            <div className="summary-main">
              <div className="summary-info">
                <span className="summary-label">Total Amount Saved</span>
                <h2 className="summary-value">
                  {formatCurrency(vaults.reduce((acc, v) => acc + v.current, 0))}
                </h2>
                <div className="summary-trend">
                  <TrendingUp size={14} />
                  <span>Stay consistent to reach your goals</span>
                </div>
              </div>
              <div className="hero-icon">
                <PiggyBank size={48} />
              </div>
            </div>
          </Card>
        </section>

        <section className="vaults-list-section">
          <div className="section-header">
            <h3 className="section-title">Active Vaults</h3>
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus size={18} /> New Vault
            </Button>
          </div>

          <div className="vaults-grid">
            {vaults.map((vault) => (
              <Card 
                key={vault.id} 
                className="vault-item-card" 
                hover 
                onClick={() => handleVaultClick(vault)}
              >
                <div className="vault-item-header">
                  <div className="vault-icon-box" style={{ color: vault.color, backgroundColor: `${vault.color}15` }}>
                    {(() => {
                      const Icon = vault.icon;
                      return <Icon size={22} />;
                    })()}
                  </div>
                  <div className="vault-item-meta">
                    <h4>{vault.name}</h4>
                    <span className="vault-category">{vault.category}</span>
                  </div>
                  <ChevronRight size={16} className="arrow-icon" />
                </div>

                <div className="vault-progress-block">
                  <div className="progress-text">
                    <span>{calculateProgress(vault.current, vault.target)}% Complete</span>
                    <span>Target: {formatCurrency(vault.target)}</span>
                  </div>
                  <div className="progress-bar-container">
                    <motion.div 
                      className="progress-bar-active" 
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateProgress(vault.current, vault.target)}%` }}
                      style={{ backgroundColor: vault.color }}
                    />
                  </div>
                </div>

                <div className="vault-item-footer">
                  <div className="saved-amount">
                    <span>Current</span>
                    <strong>{formatCurrency(vault.current)}</strong>
                  </div>
                  {vault.autoSave && (
                    <div className="auto-save-badge">
                      <Zap size={12} /> Auto
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="vault-promos">
          <Card className="promo-card auto-save-promo" glass>
             <div className="promo-content">
                <div className="promo-text">
                  <h3>Master Your Savings</h3>
                  <p>Enable automatic daily transfers to reach your goal {globalAutoSave ? 'faster than ever' : 'with ease'}.</p>
                </div>
                <label className="premium-toggle">
                  <input 
                    type="checkbox" 
                    checked={globalAutoSave} 
                    onChange={() => setGlobalAutoSave(!globalAutoSave)} 
                  />
                  <span className="toggle-track"></span>
                </label>
             </div>
          </Card>
        </section>
      </div>

      {/* Create Vault Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
            <motion.div 
              className="vault-modal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Create New Vault</h3>
                <button onClick={() => setShowCreateModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateVault} className="vault-form">
                <Input 
                  label="Goal Name" 
                  placeholder="e.g. Wedding, Travel" 
                  value={newVault.name}
                  onChange={(e) => setNewVault({...newVault, name: e.target.value})}
                  required 
                />
                <Input 
                  label="Target Amount (₦)" 
                  type="number" 
                  placeholder="0.00" 
                  value={newVault.target}
                  onChange={(e) => setNewVault({...newVault, target: e.target.value})}
                  required 
                />
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={newVault.category} 
                    onChange={(e) => setNewVault({...newVault, category: e.target.value})}
                  >
                    <option>General</option>
                    <option>Security</option>
                    <option>Gadgets</option>
                    <option>Travel</option>
                    <option>Education</option>
                  </select>
                </div>
                <Input 
                  label="Target Date" 
                  type="date"
                  value={newVault.deadline}
                  onChange={(e) => setNewVault({...newVault, deadline: e.target.value})}
                  required 
                />
                <Button fullWidth type="submit">Create Vault</Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vault Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedVault && (
          <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}>
            <motion.div 
              className="detail-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="detail-header" style={{ backgroundColor: selectedVault.color }}>
                 <button className="close-btn" onClick={() => setShowDetailModal(false)}><X size={20} /></button>
                 <div className="header-content">
                    {(() => {
                      const Icon = selectedVault.icon;
                      return <Icon size={48} color="white" />;
                    })()}
                    <h2>{selectedVault.name}</h2>
                    <span className="badge">{selectedVault.category}</span>
                 </div>
              </div>
              <div className="detail-body">
                <div className="stats-grid">
                  <div className="stat-card">
                    <span>Target</span>
                    <strong>{formatCurrency(selectedVault.target)}</strong>
                  </div>
                  <div className="stat-card">
                    <span>Current</span>
                    <strong>{formatCurrency(selectedVault.current)}</strong>
                  </div>
                </div>
                
                <div className="progress-insight">
                   <div className="insight-label">
                      <span>Progress</span>
                      <span>{calculateProgress(selectedVault.current, selectedVault.target)}%</span>
                   </div>
                   <div className="large-progress">
                      <div 
                        className="fill" 
                        style={{ width: `${calculateProgress(selectedVault.current, selectedVault.target)}%`, backgroundColor: selectedVault.color }}
                      ></div>
                   </div>
                </div>

                <div className="settings-section">
                   <div className="setting-item">
                      <div className="setting-info">
                         <Zap size={18} />
                         <div>
                            <strong>Auto-Save</strong>
                            <p>Daily automatic funding</p>
                         </div>
                      </div>
                      <label className="premium-toggle">
                        <input 
                          type="checkbox" 
                          checked={selectedVault.autoSave} 
                          onChange={() => {
                            toggleVaultAutoSave(selectedVault.id);
                            setSelectedVault({...selectedVault, autoSave: !selectedVault.autoSave});
                          }} 
                        />
                        <span className="toggle-track"></span>
                      </label>
                   </div>
                </div>

                <div className="action-buttons">
                   <Button variant="secondary" fullWidth onClick={() => alert('Funding feature coming soon!')}>Deposit</Button>
                   <Button variant="ghost" fullWidth onClick={() => {
                     setVaults(vaults.filter(v => v.id !== selectedVault.id));
                     setShowDetailModal(false);
                   }}>Delete Vault</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Vaults;
