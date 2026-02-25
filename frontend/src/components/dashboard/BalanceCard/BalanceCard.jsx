import { useState } from 'react';
import { Plus, ArrowUpRight, Eye, EyeOff, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import './BalanceCard.css';

const BalanceCard = ({ balance, onAddMoney, onWithdraw }) => {
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem('balanceVisible');
    return saved !== null ? saved === 'true' : true;
  });

  const toggleVisibility = () => {
    const newValue = !isVisible;
    setIsVisible(newValue);
    localStorage.setItem('balanceVisible', newValue.toString());
  };

  return (
    <div className="balance-card">
      <div className="balance-card-header">
        <span className="balance-card-label">Wallet Balance</span>
        <button 
          className="balance-toggle-btn" 
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide balance' : 'Show balance'}
        >
          {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      <div className="balance-card-amount">
        {isVisible ? (
          <span className="balance-visible">{formatCurrency(balance)}</span>
        ) : (
          <>
            <span className="balance-hidden">₦••••••</span>
            <span className="balance-hint">Tap eye icon to show balance</span>
          </>
        )}
      </div>

      <div className="balance-card-actions">
        <button className="balance-action-btn balance-action-primary" onClick={onAddMoney}>
          <span className="balance-action-icon">
            <Plus size={18} strokeWidth={3} />
          </span>
          Add Money
        </button>
        <button className="balance-action-btn balance-action-secondary" onClick={onWithdraw}>
          <span className="balance-action-icon">
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </span>
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
