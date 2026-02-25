import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  PiggyBank, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Card, Button } from '../components/common';
import { formatCurrency } from '../utils/formatters';
import './Vaults.css';

const Vaults = () => {
  const navigate = useNavigate();
  const [vaults, setVaults] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      target: 500000,
      current: 125000,
      category: "Security",
      deadline: "2026-12-31",
      icon: ShieldCheck,
      color: "#6366F1"
    },
    {
      id: 2,
      name: "New Laptop",
      target: 750000,
      current: 450000,
      category: "Gadgets",
      deadline: "2026-06-15",
      icon: Target,
      color: "#8B5CF6"
    }
  ]);

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <motion.div 
      className="vaults-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <header className="vaults-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1>Savings Vaults</h1>
      </header>

      <div className="vaults-content">
        <section className="vaults-hero">
          <Card glass className="total-savings-card">
            <div className="hero-info">
              <span className="label">Total Saved</span>
              <h2 className="value">{formatCurrency(575000)}</h2>
              <div className="savings-stats">
                <span className="stat"><TrendingUp size={14} /> +₦12,500 today</span>
              </div>
            </div>
            <div className="hero-illustration">
              <PiggyBank size={64} strokeWidth={1} />
            </div>
          </Card>
        </section>

        <section className="vaults-list-section">
          <div className="section-header">
            <h2 className="section-title">Your Vaults</h2>
            <Button size="sm" onClick={() => {/* Handle Create Vault */}}>
              <Plus size={18} /> New Vault
            </Button>
          </div>

          <div className="vaults-grid">
            {vaults.map((vault) => (
              <Card 
                key={vault.id} 
                className="vault-card"
                hover
                onClick={() => {/* Handle Vault Details */}}
              >
                <div className="vault-card-header">
                  <div className="vault-icon-box" style={{ backgroundColor: `${vault.color}15`, color: vault.color }}>
                    <vault.icon size={24} />
                  </div>
                  <div className="vault-info">
                    <h3>{vault.name}</h3>
                    <span className="category">{vault.category}</span>
                  </div>
                </div>

                <div className="vault-progress-section">
                  <div className="progress-labels">
                    <span>{calculateProgress(vault.current, vault.target)}% Complete</span>
                    <span>Target: {formatCurrency(vault.target)}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <motion.div 
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateProgress(vault.current, vault.target)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      style={{ backgroundColor: vault.color }}
                    />
                  </div>
                  <div className="current-balance">
                    <span>Current</span>
                    <strong>{formatCurrency(vault.current)}</strong>
                  </div>
                </div>

                <div className="vault-footer">
                  <div className="deadline">
                    <Calendar size={14} />
                    <span>Ends: {vault.deadline}</span>
                  </div>
                  <ChevronRight size={18} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="vault-tips">
          <Card className="tip-card dark">
            <div className="tip-content">
              <h3>Boost Your Savings</h3>
              <p>Set up automatic daily savings and reach your goals 2x faster.</p>
              <Button variant="secondary" size="sm">Enable Auto-Save</Button>
            </div>
          </Card>
        </section>
      </div>
    </motion.div>
  );
};

export default Vaults;
