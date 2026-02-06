import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card, Button, Input, PinInput } from '../components/common';
import walletService from '../services/walletService';
import { formatCurrency } from '../utils/formatters';
import './Withdraw.css';

const Withdraw = () => {
  const navigate = useNavigate();
  
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinError, setPinError] = useState('');
  const [errors, setErrors] = useState({});

  // Mock bank accounts (in production, fetch from backend)
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: '1',
      accountNumber: '0123456789',
      accountName: 'John Doe',
      bankName: 'GTBank',
      bankCode: '058',
      isDefault: true,
    },
  ]);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    accountNumber: '',
    bankCode: '',
  });

  const quickAmounts = [5000, 10000, 20000, 50000, 100000];

  // Mock Nigerian banks
  const banks = [
    { code: '058', name: 'GTBank' },
    { code: '044', name: 'Access Bank' },
    { code: '057', name: 'Zenith Bank' },
    { code: '033', name: 'United Bank for Africa' },
    { code: '011', name: 'First Bank' },
    { code: '032', name: 'Union Bank' },
    { code: '035', name: 'Wema Bank' },
    { code: '214', name: 'FCMB' },
    { code: '221', name: 'Stanbic IBTC' },
    { code: '232', name: 'Sterling Bank' },
  ];

  const withdrawalLimits = {
    daily: 500000,
    monthly: 2000000,
    minimum: 1000,
  };

  const withdrawalFee = 50; // ₦50 flat fee

  useEffect(() => {
    fetchBalance();
    // Set first account as default selected
    if (bankAccounts.length > 0) {
      setSelectedAccount(bankAccounts[0].id);
    }
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
    if (errors.amount) {
      setErrors({ ...errors, amount: '' });
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    if (errors.amount) {
      setErrors({ ...errors, amount: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!selectedAccount) {
      newErrors.account = 'Please select a bank account';
    }

    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (Number(amount) < withdrawalLimits.minimum) {
      newErrors.amount = `Minimum withdrawal is ${formatCurrency(withdrawalLimits.minimum)}`;
    } else if (Number(amount) > balance) {
      newErrors.amount = 'Insufficient balance';
    } else if (Number(amount) > withdrawalLimits.daily) {
      newErrors.amount = `Daily limit is ${formatCurrency(withdrawalLimits.daily)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdraw = () => {
    if (!validate()) return;
    setShowPinModal(true);
  };

  const handlePinComplete = async (enteredPin) => {
    setPin(enteredPin);
    
    // Validate PIN (in production, validate with backend)
    if (enteredPin.length !== 4) {
      setPinError('Please enter a 4-digit PIN');
      return;
    }

    try {
      setLoading(true);
      setPinError('');

      // TODO: Implement actual withdrawal API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success
      alert(`Withdrawal of ${formatCurrency(amount)} initiated successfully!`);
      setShowPinModal(false);
      setAmount('');
      setPin('');
      navigate('/transactions');
    } catch (error) {
      setPinError('Invalid PIN or withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = () => {
    // TODO: Implement account verification with Paystack/Flutterwave
    if (!newAccount.accountNumber || !newAccount.bankCode) {
      alert('Please fill all fields');
      return;
    }

    const selectedBank = banks.find(b => b.code === newAccount.bankCode);
    
    const account = {
      id: Date.now().toString(),
      accountNumber: newAccount.accountNumber,
      accountName: 'Account Holder', // Would come from verification API
      bankName: selectedBank?.name || '',
      bankCode: newAccount.bankCode,
      isDefault: bankAccounts.length === 0,
    };

    setBankAccounts([...bankAccounts, account]);
    setNewAccount({ accountNumber: '', bankCode: '' });
    setShowAddAccount(false);
    setSelectedAccount(account.id);
  };

  const getTotalDeduction = () => {
    if (!amount) return 0;
    return Number(amount) + withdrawalFee;
  };

  const selectedAccountData = bankAccounts.find(acc => acc.id === selectedAccount);

  return (
    <div className="withdraw-page">
      <Header />

      <div className="withdraw-container">
        <div className="withdraw-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="withdraw-title">Withdraw Funds</h1>
          <p className="withdraw-subtitle">Transfer money from your wallet to your bank account</p>
        </div>

        {/* Current Balance */}
        <Card glass className="balance-display">
          <span className="balance-label">Available Balance</span>
          <span className="balance-amount">{formatCurrency(balance)}</span>
        </Card>

        {/* Bank Accounts */}
        <Card glass padding="large" className="accounts-section">
          <div className="section-header">
            <h3 className="section-title">Select Bank Account</h3>
            <button 
              className="add-account-button"
              onClick={() => setShowAddAccount(!showAddAccount)}
            >
              {showAddAccount ? '✕ Cancel' : '+ Add Account'}
            </button>
          </div>

          {showAddAccount && (
            <div className="add-account-form">
              <Input
                type="text"
                label="Account Number"
                placeholder="Enter 10-digit account number"
                value={newAccount.accountNumber}
                onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                maxLength={10}
              />

              <div className="form-group">
                <label className="input-label">Bank</label>
                <select
                  value={newAccount.bankCode}
                  onChange={(e) => setNewAccount({ ...newAccount, bankCode: e.target.value })}
                  className="bank-select"
                >
                  <option value="">Select Bank</option>
                  {banks.map(bank => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="primary"
                size="medium"
                fullWidth
                onClick={handleAddAccount}
              >
                Verify & Add Account
              </Button>
            </div>
          )}

          <div className="bank-accounts-list">
            {bankAccounts.map((account) => (
              <button
                key={account.id}
                className={`bank-account-card ${selectedAccount === account.id ? 'selected' : ''}`}
                onClick={() => setSelectedAccount(account.id)}
              >
                <div className="account-icon">🏦</div>
                <div className="account-details">
                  <h4>{account.bankName}</h4>
                  <p>{account.accountNumber}</p>
                  <p className="account-name">{account.accountName}</p>
                </div>
                {account.isDefault && (
                  <span className="default-badge">Default</span>
                )}
              </button>
            ))}
          </div>

          {errors.account && <p className="error-text">{errors.account}</p>}
        </Card>

        {/* Amount Section */}
        <Card glass padding="large" className="amount-section">
          <h3 className="section-title">Withdrawal Amount</h3>
          
          <div className="quick-amounts">
            {quickAmounts.map((value) => (
              <button
                key={value}
                className={`amount-button ${amount === value.toString() ? 'selected' : ''}`}
                onClick={() => handleAmountSelect(value)}
                disabled={value > balance}
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
            {errors.amount && <p className="error-text">{errors.amount}</p>}
          </div>

          {/* Withdrawal Info */}
          <div className="withdrawal-info">
            <div className="info-row">
              <span>Withdrawal Fee</span>
              <span>{formatCurrency(withdrawalFee)}</span>
            </div>
            <div className="info-row">
              <span>Processing Time</span>
              <span>Instant</span>
            </div>
            <div className="info-row">
              <span>Daily Limit</span>
              <span>{formatCurrency(withdrawalLimits.daily)}</span>
            </div>
          </div>

          {amount && Number(amount) >= withdrawalLimits.minimum && (
            <div className="withdrawal-summary">
              <div className="summary-row">
                <span>Amount</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="summary-row">
                <span>Fee</span>
                <span>{formatCurrency(withdrawalFee)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Deduction</span>
                <span>{formatCurrency(getTotalDeduction())}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Withdraw Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handleWithdraw}
          disabled={!amount || !selectedAccount || Number(amount) < withdrawalLimits.minimum}
        >
          Withdraw {amount ? formatCurrency(amount) : 'Funds'}
        </Button>

        {/* PIN Modal */}
        {showPinModal && (
          <div className="pin-modal-overlay" onClick={() => !loading && setShowPinModal(false)}>
            <Card glass padding="large" className="pin-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Enter Transaction PIN</h3>
              <p className="modal-subtitle">
                Withdrawing {formatCurrency(amount)} to {selectedAccountData?.bankName}
              </p>

              <PinInput
                length={4}
                onComplete={handlePinComplete}
                onChange={() => setPinError('')}
                error={pinError}
                disabled={loading}
              />

              {loading && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <p>Processing withdrawal...</p>
                </div>
              )}

              <button
                className="modal-close-button"
                onClick={() => !loading && setShowPinModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
