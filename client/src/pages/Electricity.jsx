import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Button, Input, Card } from '../components/common';
import serviceService from '../services/serviceService';
import { formatCurrency } from '../utils/formatters';
import './Electricity.css';

const Electricity = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    disco: '',
    meterNumber: '',
    meterType: 'prepaid',
    amount: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const discos = [
    { id: 'ikeja-electric', name: 'IKEDC', fullName: 'Ikeja Electric', logo: '/service-providers-logo/IKEDC-logo.jpg', color: '#FF6B00' },
    { id: 'eko-electric', name: 'EKEDC', fullName: 'Eko Electric', logo: '/service-providers-logo/EKEDC-logo.jpg', color: '#0066CC' },
    { id: 'abuja-electric', name: 'AEDC', fullName: 'Abuja Electric', logo: '/service-providers-logo/AEDC-logo.webp', color: '#00A859' },
    { id: 'kano-electric', name: 'KEDCO', fullName: 'Kano Electric', logo: '/service-providers-logo/KEDCO-logo.webp', color: '#FFD700' },
    { id: 'port-harcourt-electric', name: 'PHED', fullName: 'Port Harcourt Electric', logo: '/service-providers-logo/PHED-logo.png', color: '#8B5CF6' },
    { id: 'ibadan-electric', name: 'IBEDC', fullName: 'Ibadan Electric', logo: '/service-providers-logo/IBEDC-logo.png', color: '#EC4899' },
  ];

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const handleDiscoSelect = (discoId) => {
    setFormData({ ...formData, disco: discoId });
    if (errors.disco) {
      setErrors({ ...errors, disco: '' });
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

    if (!formData.disco) {
      newErrors.disco = 'Please select a distribution company';
    }

    if (!formData.meterNumber) {
      newErrors.meterNumber = 'Meter number is required';
    } else if (formData.meterNumber.length < 10) {
      newErrors.meterNumber = 'Please enter a valid meter number';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || Number(formData.amount) < 1000) {
      newErrors.amount = 'Minimum amount is ₦1,000';
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
      const result = await serviceService.payElectricity({
        serviceID: formData.disco,
        billersCode: formData.meterNumber,
        variation_code: formData.meterType,
        amount: Number(formData.amount),
      });

      if (result.success) {
        alert(`Electricity payment successful! ${formatCurrency(formData.amount)} paid to ${formData.meterNumber}`);
        navigate('/transactions');
      } else {
        setServerError(result.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDisco = discos.find(d => d.id === formData.disco);

  return (
    <div className="electricity-page">
      <Header />

      <div className="electricity-container">
        <div className="electricity-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="electricity-title">Pay Electricity Bill</h1>
          <p className="electricity-subtitle">Quick and easy electricity payments</p>
        </div>

        <Card glass padding="large" className="electricity-card">
          <form onSubmit={handleSubmit} className="electricity-form">
            {serverError && (
              <div className="electricity-error-banner">
                {serverError}
              </div>
            )}

            {/* Disco Selection */}
            <div className="form-section">
              <label className="form-label">Select Distribution Company</label>
              <div className="disco-grid">
                {discos.map((disco) => (
                  <button
                    key={disco.id}
                    type="button"
                    className={`disco-card ${formData.disco === disco.id ? 'selected' : ''}`}
                    style={{ '--disco-color': disco.color }}
                    onClick={() => handleDiscoSelect(disco.id)}
                  >
                    {disco.logo ? (
                      <img src={disco.logo} alt={disco.name} className="disco-logo" />
                    ) : (
                      <span className="disco-icon">{disco.icon}</span>
                    )}
                    <span className="disco-name">{disco.name}</span>
                    <span className="disco-full-name">{disco.fullName}</span>
                  </button>
                ))}
              </div>
              {errors.disco && <span className="error-text">{errors.disco}</span>}
            </div>

            {/* Meter Type */}
            <div className="form-section">
              <label className="form-label">Meter Type</label>
              <div className="meter-type-grid">
                <button
                  type="button"
                  className={`meter-type-card ${formData.meterType === 'prepaid' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, meterType: 'prepaid' })}
                >
                  <span className="meter-type-icon">💳</span>
                  <span className="meter-type-name">Prepaid</span>
                </button>
                <button
                  type="button"
                  className={`meter-type-card ${formData.meterType === 'postpaid' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, meterType: 'postpaid' })}
                >
                  <span className="meter-type-icon">📋</span>
                  <span className="meter-type-name">Postpaid</span>
                </button>
              </div>
            </div>

            {/* Meter Number */}
            <Input
              type="text"
              name="meterNumber"
              label="Meter Number"
              placeholder="Enter your meter number"
              value={formData.meterNumber}
              onChange={handleChange}
              error={errors.meterNumber}
              icon="⚡"
              required
            />

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
              placeholder="Enter amount (₦1,000 - ₦1,000,000)"
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              icon="₦"
              min="1000"
              max="1000000"
              required
            />

            {/* Summary */}
            {formData.disco && formData.meterNumber && formData.amount && (
              <div className="purchase-summary">
                <h3>Payment Summary</h3>
                <div className="summary-row">
                  <span>Disco:</span>
                  <span className="summary-value">{selectedDisco?.fullName}</span>
                </div>
                <div className="summary-row">
                  <span>Meter Type:</span>
                  <span className="summary-value">{formData.meterType === 'prepaid' ? 'Prepaid' : 'Postpaid'}</span>
                </div>
                <div className="summary-row">
                  <span>Meter Number:</span>
                  <span className="summary-value">{formData.meterNumber}</span>
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
              disabled={!formData.disco || !formData.meterNumber || !formData.amount}
            >
              {loading ? 'Processing...' : `Pay ${formData.amount ? formatCurrency(formData.amount) : 'Bill'}`}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Electricity;
