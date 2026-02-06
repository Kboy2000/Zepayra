import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/layout';
import { Button, Input, Card } from '../components/common';
import serviceService from '../services/serviceService';
import transactionService from '../services/transactionService';
import beneficiaryService from '../services/beneficiaryService';
import { formatCurrency } from '../utils/formatters';
import { isValidNigerianPhone } from '../utils/validators';
import './Airtime.css';

const Airtime = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    amount: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  // NEW: Recent recipients and beneficiaries
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [savedBeneficiaries, setSavedBeneficiaries] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const networks = [
    { id: 'mtn', name: 'MTN', color: '#FFCC00', logo: '/service-providers-logo/mtn-new-logo.svg' },
    { id: 'glo', name: 'Glo', color: '#00A859', logo: '/service-providers-logo/glo-logo.jpg' },
    { id: 'airtel', name: 'Airtel', color: '#ED1C24', logo: '/service-providers-logo/Airtel-logo.png' },
    { id: '9mobile', name: '9mobile', color: '#00A65A', logo: '/service-providers-logo/9Mobile-Telecom-Logo.jpg' },
  ];

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  // NEW: Fetch recent recipients and beneficiaries
  useEffect(() => {
    fetchRecentAndBeneficiaries();
    
    // Check if coming from beneficiaries page with pre-filled data
    if (location.state?.beneficiary) {
      const { phone, network } = location.state.beneficiary;
      setFormData(prev => ({ ...prev, phone, network: network || '' }));
    }
  }, [location.state]);

  const fetchRecentAndBeneficiaries = async () => {
    try {
      setLoadingRecent(true);
      
      // Fetch recent airtime transactions
      const recentData = await transactionService.getRecent({
        serviceType: 'airtime',
        limit: 5
      });
      setRecentRecipients(recentData || []);
      
      // Fetch saved beneficiaries
      const beneficiariesData = await beneficiaryService.getBeneficiaries({
        serviceType: 'airtime'
      });
      setSavedBeneficiaries(beneficiariesData || []);
    } catch (error) {
      console.error('Error fetching recent/beneficiaries:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  // NEW: Select from recent or beneficiary
  const selectRecipient = (recipient) => {
    setFormData({
      ...formData,
      phone: recipient.phone || recipient.recipientPhone,
      network: recipient.network || detectNetwork(recipient.phone || recipient.recipientPhone)
    });
    setErrors({});
  };

  // NEW: Detect network from phone number
  const detectNetwork = (phone) => {
    if (!phone) return '';
    const prefix = phone.substring(0, 4);
    
    // MTN prefixes
    if (['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906'].includes(prefix)) {
      return 'mtn';
    }
    // Glo prefixes
    if (['0805', '0807', '0705', '0815', '0811', '0905'].includes(prefix)) {
      return 'glo';
    }
    // Airtel prefixes
    if (['0802', '0808', '0708', '0812', '0701', '0902', '0907'].includes(prefix)) {
      return 'airtel';
    }
    // 9mobile prefixes
    if (['0809', '0817', '0818', '0909', '0908'].includes(prefix)) {
      return '9mobile';
    }
    
    return '';
  };

  // Auto-detect network when phone changes
  useEffect(() => {
    if (formData.phone && formData.phone.length >= 4) {
      const detected = detectNetwork(formData.phone);
      if (detected && !formData.network) {
        setFormData(prev => ({ ...prev, network: detected }));
      }
    }
  }, [formData.phone]);

  const handleNetworkSelect = (networkId) => {
    setFormData({ ...formData, network: networkId });
    if (errors.network) {
      setErrors({ ...errors, network: '' });
    }
  };

  const handleAmountSelect = (amount) => {
    setFormData({ ...formData, amount: amount.toString() });
    if (errors.amount) {
      setErrors({ ...errors, amount: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.network) {
      newErrors.network = 'Please select a network';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidNigerianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Nigerian phone number';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || Number(formData.amount) < 50) {
      newErrors.amount = 'Minimum amount is ₦50';
    } else if (Number(formData.amount) > 1000000) {
      newErrors.amount = 'Maximum amount is ₦1,000,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await serviceService.purchaseAirtime({
        network: formData.network,
        phone: formData.phone,
        amount: Number(formData.amount),
      });

      if (result.success) {
        // Auto-save as beneficiary (OPay style)
        try {
          await beneficiaryService.createBeneficiary({
            name: formData.phone, // Will be updated if user adds name later
            serviceType: 'airtime',
            phone: formData.phone,
            network: formData.network
          });
        } catch (err) {
          // Silently fail if beneficiary already exists
          console.log('Beneficiary may already exist');
        }
        
        alert(`Airtime purchase successful! ${formatCurrency(formData.amount)} sent to ${formData.phone}`);
        navigate('/transactions');
      } else {
        setServerError(result.message || 'Purchase failed. Please try again.');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedNetwork = networks.find(n => n.id === formData.network);

  return (
    <div className="airtime-page">
      <Header />

      <div className="airtime-container">
        <div className="airtime-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="airtime-title">Buy Airtime</h1>
          <p className="airtime-subtitle">Instant airtime recharge for all networks</p>
        </div>

        {/* NEW: Recent Recipients Section */}
        {!loadingRecent && recentRecipients.length > 0 && (
          <div className="recent-section">
            <h3 className="section-title">Recent</h3>
            <div className="recent-grid">
              {recentRecipients.map((recipient, index) => (
                <div
                  key={index}
                  className="recent-card"
                  onClick={() => selectRecipient(recipient)}
                >
                  <div className="recent-avatar">
                    {recipient.recipientName?.[0] || '📱'}
                  </div>
                  <span className="recent-name">
                    {recipient.recipientName || recipient.recipientPhone}
                  </span>
                  <span className="recent-network">{recipient.network?.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Card glass padding="large" className="airtime-card">
          <form onSubmit={handleSubmit} className="airtime-form">
            {serverError && (
              <div className="airtime-error-banner">
                {serverError}
              </div>
            )}

            {/* Network Selection */}
            <div className="form-section">
              <label className="form-label">Select Network</label>
              <div className="network-grid">
                {networks.map((network) => (
                  <button
                    key={network.id}
                    type="button"
                    className={`network-card ${formData.network === network.id ? 'selected' : ''}`}
                    style={{
                      '--network-color': network.color,
                    }}
                    onClick={() => handleNetworkSelect(network.id)}
                  >
                    <img src={network.logo} alt={network.name} className="network-logo" />
                    <span className="network-name">{network.name}</span>
                  </button>
                ))}
              </div>
              {errors.network && <span className="error-text">{errors.network}</span>}
            </div>

            {/* Phone Number with Contact Button */}
            <div className="form-section">
              <label className="form-label">Phone Number</label>
              <div className="phone-input-group">
                <Input
                  type="tel"
                  name="phone"
                  placeholder="08012345678"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  icon="📱"
                  required
                />
                <button
                  type="button"
                  className="contacts-button"
                  onClick={() => alert('Contact picker coming soon!')}
                >
                  📇 Contacts
                </button>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="form-section">
              <label className="form-label">Select Amount</label>
              <div className="amount-grid">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`amount-card ${formData.amount === amount.toString() ? 'selected' : ''}`}
                    onClick={() => handleAmountSelect(amount)}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <Input
              type="number"
              name="amount"
              label="Or Enter Custom Amount"
              placeholder="Enter amount (₦50 - ₦1,000,000)"
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              icon="₦"
              min="50"
              max="1000000"
              required
            />

            {/* Summary */}
            {formData.network && formData.phone && formData.amount && (
              <div className="purchase-summary">
                <h3>Purchase Summary</h3>
                <div className="summary-row">
                  <span>Network:</span>
                  <span className="summary-value">{selectedNetwork?.name}</span>
                </div>
                <div className="summary-row">
                  <span>Phone Number:</span>
                  <span className="summary-value">{formData.phone}</span>
                </div>
                <div className="summary-row">
                  <span>Amount:</span>
                  <span className="summary-value">{formatCurrency(formData.amount)}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={!formData.network || !formData.phone || !formData.amount}
            >
              {loading ? 'Processing...' : `Purchase ${formData.amount ? formatCurrency(formData.amount) : 'Airtime'}`}
            </Button>
          </form>
        </Card>

        {/* NEW: Saved Beneficiaries Section */}
        {!loadingRecent && savedBeneficiaries.length > 0 && (
          <div className="beneficiaries-section">
            <div className="section-header">
              <h3 className="section-title">Saved Beneficiaries</h3>
              <button 
                className="manage-link"
                onClick={() => navigate('/beneficiaries', { state: { serviceType: 'airtime' } })}
              >
                Manage →
              </button>
            </div>
            <div className="beneficiaries-grid">
              {savedBeneficiaries.slice(0, 6).map((beneficiary) => (
                <div
                  key={beneficiary._id}
                  className="beneficiary-card"
                  onClick={() => selectRecipient(beneficiary)}
                >
                  <div className="beneficiary-avatar">
                    {beneficiary.name?.[0] || '👤'}
                  </div>
                  <span className="beneficiary-name">{beneficiary.name}</span>
                  <span className="beneficiary-phone">{beneficiary.phone}</span>
                  {beneficiary.isFavorite && <span className="favorite-badge">⭐</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Airtime;
