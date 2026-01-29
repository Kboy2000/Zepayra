import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card, Button } from '../components/common';
import walletService from '../services/walletService';
import { formatCurrency, copyToClipboard } from '../utils/formatters';
import './FundWallet.css';

const FundWallet = () => {
  const navigate = useNavigate();
  
  const [selectedMethod, setSelectedMethod] = useState('bank-transfer');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [copySuccess, setCopySuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [1000, 5000, 10000, 50000, 100000];

  const fundingMethods = [
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Transfer to your dedicated account',
      recommended: true,
      processingTime: 'Instant',
      fee: 'Free',
    },
    {
      id: 'card',
      name: 'Debit/Credit Card',
      icon: '💳',
      description: 'Pay with your card',
      recommended: false,
      processingTime: 'Instant',
      fee: '1.5%',
    },
    {
      id: 'ussd',
      name: 'USSD',
      icon: '📱',
      description: 'Dial code to fund',
      recommended: false,
      processingTime: 'Instant',
      fee: 'Free',
    },
  ];

  // Mock virtual account details (in production, fetch from backend)
  const virtualAccount = {
    accountNumber: '1234567890',
    accountName: 'ZEPAYRA - John Doe',
    bankName: 'Wema Bank',
  };

  const ussdCodes = [
    { bank: 'GTBank', code: '*737*50*Amount*1234567890#' },
    { bank: 'Access Bank', code: '*901*Amount*1234567890#' },
    { bank: 'Zenith Bank', code: '*966*Amount*1234567890#' },
    { bank: 'First Bank', code: '*894*Amount*1234567890#' },
    { bank: 'UBA', code: '*919*Amount*1234567890#' },
  ];

  useEffect(() => {
    fetchBalance();

    // Auto-refresh balance when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBalance();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also refresh every 30 seconds while page is active
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        fetchBalance();
      }
    }, 30000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await walletService.getBalance();
      setBalance(response.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleAmountSelect = (value) => {
    setAmount(value.toString());
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const handleCopy = async (text, label) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleCardPayment = async () => {
    if (!amount || Number(amount) < 100) {
      alert('Minimum amount is ₦100');
      return;
    }

    setLoading(true);
    
    // TODO: Integrate with Paystack/Flutterwave
    setTimeout(() => {
      alert('Card payment integration coming soon!');
      setLoading(false);
    }, 1000);
  };

  const calculateFee = () => {
    if (selectedMethod === 'card' && amount) {
      return Number(amount) * 0.015;
    }
    return 0;
  };

  const getTotalAmount = () => {
    if (!amount) return 0;
    return Number(amount) + calculateFee();
  };

  return (
    <div className="fund-wallet-page">
      <Header />

      <div className="fund-wallet-container">
        <div className="fund-wallet-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="fund-wallet-title">Fund Wallet</h1>
          <p className="fund-wallet-subtitle">Add money to your ZEPAYRA wallet</p>
        </div>

        {/* Current Balance */}
        <Card glass className="balance-display">
          <span className="balance-label">Current Balance</span>
          <span className="balance-amount">{formatCurrency(balance)}</span>
        </Card>

        {/* Amount Selection */}
        <Card glass padding="large" className="amount-section">
          <h3 className="section-title">Select Amount</h3>
          
          <div className="quick-amounts">
            {quickAmounts.map((value) => (
              <button
                key={value}
                className={`amount-button ${amount === value.toString() ? 'selected' : ''}`}
                onClick={() => handleAmountSelect(value)}
              >
                {formatCurrency(value)}
              </button>
            ))}
          </div>

          <div className="custom-amount">
            <label className="input-label">Or enter custom amount</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">₦</span>
              <input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className="amount-input"
              />
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card glass padding="large" className="payment-methods-section">
          <h3 className="section-title">Select Payment Method</h3>
          
          <div className="payment-methods">
            {fundingMethods.map((method) => (
              <button
                key={method.id}
                className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(method.id)}
              >
                {method.recommended && (
                  <span className="recommended-badge">Recommended</span>
                )}
                <div className="method-icon">{method.icon}</div>
                <div className="method-details">
                  <h4>{method.name}</h4>
                  <p>{method.description}</p>
                  <div className="method-info">
                    <span>⚡ {method.processingTime}</span>
                    <span>💰 {method.fee}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Payment Instructions */}
        {selectedMethod === 'bank-transfer' && (
          <Card glass padding="large" className="instructions-card">
            <h3 className="section-title">Bank Transfer Instructions</h3>
            
            <div className="account-details">
              <div className="account-detail-row">
                <span className="detail-label">Account Number</span>
                <div className="detail-value-with-copy">
                  <span className="detail-value">{virtualAccount.accountNumber}</span>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopy(virtualAccount.accountNumber, 'account')}
                  >
                    {copySuccess === 'account' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
              </div>

              <div className="account-detail-row">
                <span className="detail-label">Account Name</span>
                <span className="detail-value">{virtualAccount.accountName}</span>
              </div>

              <div className="account-detail-row">
                <span className="detail-label">Bank Name</span>
                <span className="detail-value">{virtualAccount.bankName}</span>
              </div>
            </div>

            <div className="info-box">
              <span className="info-icon">ℹ️</span>
              <p>Transfer any amount to this account and your wallet will be credited instantly. This account is unique to you.</p>
            </div>
          </Card>
        )}

        {selectedMethod === 'card' && (
          <Card glass padding="large" className="instructions-card">
            <h3 className="section-title">Card Payment</h3>
            
            {amount && Number(amount) >= 100 && (
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Amount</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
                <div className="summary-row">
                  <span>Processing Fee (1.5%)</span>
                  <span>{formatCurrency(calculateFee())}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatCurrency(getTotalAmount())}</span>
                </div>
              </div>
            )}

            <Button
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={!amount || Number(amount) < 100}
              onClick={handleCardPayment}
            >
              {loading ? 'Processing...' : `Pay ${amount ? formatCurrency(getTotalAmount()) : 'with Card'}`}
            </Button>

            <div className="info-box">
              <span className="info-icon">🔒</span>
              <p>Your payment is secured with industry-standard encryption</p>
            </div>
          </Card>
        )}

        {selectedMethod === 'ussd' && (
          <Card glass padding="large" className="instructions-card">
            <h3 className="section-title">USSD Codes</h3>
            
            <p className="ussd-instruction">
              Dial any of these codes from your registered phone number:
            </p>

            <div className="ussd-codes">
              {ussdCodes.map((ussd, index) => (
                <div key={index} className="ussd-code-card">
                  <div className="ussd-bank">{ussd.bank}</div>
                  <div className="ussd-code-wrapper">
                    <code className="ussd-code">{ussd.code}</code>
                    <button 
                      className="copy-btn small"
                      onClick={() => handleCopy(ussd.code, `ussd-${index}`)}
                    >
                      {copySuccess === `ussd-${index}` ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="info-box">
              <span className="info-icon">ℹ️</span>
              <p>Replace "Amount" with the amount you want to fund (e.g., *737*50*5000*1234567890#)</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FundWallet;
