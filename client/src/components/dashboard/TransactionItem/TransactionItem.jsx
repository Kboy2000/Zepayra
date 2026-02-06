import { formatCurrency, formatDate } from '../../../utils/formatters';
import './TransactionItem.css';

const TransactionItem = ({ transaction, onClick }) => {
  const isCredit = transaction.type === 'credit';
  const statusColor = {
    success: 'var(--color-success)',
    pending: 'var(--color-warning)',
    failed: 'var(--color-error)',
  }[transaction.status];

  const categoryIcons = {
    airtime: '📞',
    data: '📡',
    electricity: '⚡',
    tv: '📺',
    education: '📚',
    funding: '💰',
  };

  return (
    <div className="transaction-item" onClick={onClick}>
      <div 
        className={`transaction-icon ${isCredit ? 'transaction-icon-credit' : 'transaction-icon-debit'}`}
      >
        {categoryIcons[transaction.category] || '💳'}
      </div>

      <div className="transaction-details">
        <span className="transaction-description">{transaction.description}</span>
        <span className="transaction-date">{formatDate(transaction.createdAt)}</span>
      </div>

      <div className="transaction-right">
        <span className={`transaction-amount ${isCredit ? 'transaction-amount-credit' : 'transaction-amount-debit'}`}>
          {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
        <span className="transaction-status" style={{ color: statusColor }}>
          {transaction.status}
        </span>
      </div>
    </div>
  );
};

export default TransactionItem;
