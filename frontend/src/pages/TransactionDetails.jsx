import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card, Button } from '../components/common';
import transactionService from '../services/transactionService';
import { formatCurrency, formatDateTime, copyToClipboard } from '../utils/formatters';
import './TransactionDetails.css';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requerying, setRequerying] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    fetchTransactionDetails();
  }, [id]);

  const fetchTransactionDetails = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactionById(id);
      setTransaction(response.transaction || response);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequery = async () => {
    try {
      setRequerying(true);
      await transactionService.requeryTransaction(id);
      await fetchTransactionDetails();
      alert('Transaction status updated successfully!');
    } catch (error) {
      console.error('Error requerying transaction:', error);
      alert('Failed to requery transaction. Please try again.');
    } finally {
      setRequerying(false);
    }
  };

  const handleCopy = async (text, label) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Transaction Receipt',
        text: `Transaction ${transaction.reference} - ${formatCurrency(transaction.amount)}`,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      alert('Sharing not supported on this device');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'airtime':
        return '📞';
      case 'data':
        return '📡';
      case 'electricity':
        return '⚡';
      case 'tv':
        return '📺';
      default:
        return '💳';
    }
  };

  if (loading) {
    return (
      <div className="transaction-details-page">
        <Header />
        <div className="transaction-details-loading">
          <div className="spinner"></div>
          <p>Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="transaction-details-page">
        <Header />
        <div className="transaction-details-container">
          <Card glass padding="large" className="error-state">
            <span className="error-icon">❌</span>
            <h3>Transaction not found</h3>
            <p>The transaction you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/transactions')}>
              Back to Transactions
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-details-page">
      <Header />

      <div className="transaction-details-container">
        <div className="transaction-details-header">
          <button className="back-button" onClick={() => navigate('/transactions')}>
            ← Back to Transactions
          </button>
        </div>

        {/* Status Card */}
        <Card glass className="status-card">
          <div className="status-icon-wrapper" style={{ '--status-color': getStatusColor(transaction.status) }}>
            <span className="service-icon">{getServiceIcon(transaction.serviceType)}</span>
          </div>
          <h2 className="transaction-amount">{formatCurrency(transaction.amount)}</h2>
          <div className="status-badge" style={{ backgroundColor: getStatusColor(transaction.status) }}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </div>
          <p className="transaction-date">{formatDateTime(transaction.createdAt)}</p>
        </Card>

        {/* Transaction Details */}
        <Card glass padding="large" className="details-card">
          <h3 className="section-title">Transaction Details</h3>
          
          <div className="detail-row">
            <span className="detail-label">Service Type</span>
            <span className="detail-value">
              {transaction.serviceType.charAt(0).toUpperCase() + transaction.serviceType.slice(1)}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Reference</span>
            <div className="detail-value-with-copy">
              <span className="detail-value">{transaction.reference}</span>
              <button 
                className="copy-button"
                onClick={() => handleCopy(transaction.reference, 'reference')}
              >
                {copySuccess === 'reference' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          {transaction.requestId && (
            <div className="detail-row">
              <span className="detail-label">Request ID</span>
              <div className="detail-value-with-copy">
                <span className="detail-value">{transaction.requestId}</span>
                <button 
                  className="copy-button"
                  onClick={() => handleCopy(transaction.requestId, 'requestId')}
                >
                  {copySuccess === 'requestId' ? '✓' : '📋'}
                </button>
              </div>
            </div>
          )}

          {transaction.recipient && (
            <div className="detail-row">
              <span className="detail-label">Recipient</span>
              <span className="detail-value">{transaction.recipient}</span>
            </div>
          )}

          {transaction.description && (
            <div className="detail-row">
              <span className="detail-label">Description</span>
              <span className="detail-value">{transaction.description}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Amount</span>
            <span className="detail-value amount">{formatCurrency(transaction.amount)}</span>
          </div>

          {transaction.fee && (
            <div className="detail-row">
              <span className="detail-label">Fee</span>
              <span className="detail-value">{formatCurrency(transaction.fee)}</span>
            </div>
          )}

          {transaction.balanceBefore !== undefined && (
            <div className="detail-row">
              <span className="detail-label">Balance Before</span>
              <span className="detail-value">{formatCurrency(transaction.balanceBefore)}</span>
            </div>
          )}

          {transaction.balanceAfter !== undefined && (
            <div className="detail-row">
              <span className="detail-label">Balance After</span>
              <span className="detail-value">{formatCurrency(transaction.balanceAfter)}</span>
            </div>
          )}
        </Card>

        {/* Provider Details */}
        {transaction.providerResponse && (
          <Card glass padding="large" className="details-card">
            <h3 className="section-title">Provider Information</h3>
            
            {transaction.providerResponse.content && (
              <div className="provider-content">
                <p>{transaction.providerResponse.content.transactions?.product_name}</p>
                {transaction.providerResponse.content.transactions?.unique_element && (
                  <p className="unique-element">
                    Token: {transaction.providerResponse.content.transactions.unique_element}
                  </p>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Actions */}
        <div className="transaction-actions">
          {transaction.status === 'pending' && (
            <Button
              variant="primary"
              size="large"
              fullWidth
              loading={requerying}
              onClick={handleRequery}
            >
              {requerying ? 'Checking Status...' : 'Requery Transaction'}
            </Button>
          )}
          
          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={handleShare}
          >
            📤 Share Receipt
          </Button>

          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={() => navigate('/support')}
          >
            🆘 Report Issue
          </Button>
        </div>

        {/* Timeline */}
        <Card glass padding="large" className="timeline-card">
          <h3 className="section-title">Transaction Timeline</h3>
          
          <div className="timeline">
            <div className="timeline-item completed">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Transaction Initiated</h4>
                <p>{formatDateTime(transaction.createdAt)}</p>
              </div>
            </div>

            {transaction.status === 'successful' && (
              <div className="timeline-item completed">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Transaction Completed</h4>
                  <p>{formatDateTime(transaction.updatedAt)}</p>
                </div>
              </div>
            )}

            {transaction.status === 'failed' && (
              <div className="timeline-item failed">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Transaction Failed</h4>
                  <p>{formatDateTime(transaction.updatedAt)}</p>
                  {transaction.errorMessage && (
                    <p className="error-message">{transaction.errorMessage}</p>
                  )}
                </div>
              </div>
            )}

            {transaction.status === 'pending' && (
              <div className="timeline-item pending">
                <div className="timeline-marker pulsing"></div>
                <div className="timeline-content">
                  <h4>Processing...</h4>
                  <p>Your transaction is being processed</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetails;
