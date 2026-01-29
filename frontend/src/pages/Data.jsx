import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Button, Input, Card } from '../components/common';
import serviceService from '../services/serviceService';
import { formatCurrency } from '../utils/formatters';
import { isValidNigerianPhone } from '../utils/validators';
import './Data.css';

const Data = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    plan: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [dataPlans, setDataPlans] = useState([]);

  const networks = [
    { id: 'mtn-data', name: 'MTN', color: '#FFCC00', logo: '/service-providers-logo/mtn-new-logo.svg' },
    { id: 'glo-data', name: 'Glo', color: '#00A859', logo: '/service-providers-logo/glo-logo.jpg' },
    { id: 'airtel-data', name: 'Airtel', color: '#ED1C24', logo: '/service-providers-logo/Airtel-logo.png' },
    { id: '9mobile-data', name: '9mobile', color: '#00A65A', logo: '/service-providers-logo/9Mobile-Telecom-Logo.jpg' },
  ];

  useEffect(() => {
    if (formData.network) {
      fetchDataPlans(formData.network);
    }
  }, [formData.network]);

  const fetchDataPlans = async (networkId) => {
    setPlansLoading(true);
    try {
      const response = await serviceService.getServiceVariations(networkId);
      setDataPlans(response.variations || []);
    } catch (error) {
      console.error('Error fetching data plans:', error);
      // Mock data plans for testing
      setDataPlans([
        { variation_code: '500MB', name: '500MB - 30 Days', variation_amount: 500 },
        { variation_code: '1GB', name: '1GB - 30 Days', variation_amount: 1000 },
        { variation_code: '2GB', name: '2GB - 30 Days', variation_amount: 2000 },
        { variation_code: '5GB', name: '5GB - 30 Days', variation_amount: 5000 },
        { variation_code: '10GB', name: '10GB - 30 Days', variation_amount: 10000 },
      ]);
    } finally {
      setPlansLoading(false);
    }
  };

  const handleNetworkSelect = (networkId) => {
    setFormData({ ...formData, network: networkId, plan: '' });
    if (errors.network) {
      setErrors({ ...errors, network: '' });
    }
  };

  const handlePlanSelect = (plan) => {
    setFormData({ ...formData, plan: plan.variation_code });
    if (errors.plan) {
      setErrors({ ...errors, plan: '' });
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

    if (!formData.plan) {
      newErrors.plan = 'Please select a data plan';
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
      const result = await serviceService.purchaseData({
        serviceID: formData.network,
        phone: formData.phone,
        variation_code: formData.plan,
      });

      if (result.success) {
        const selectedPlan = dataPlans.find(p => p.variation_code === formData.plan);
        alert(`Data purchase successful! ${selectedPlan?.name} sent to ${formData.phone}`);
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
  const selectedPlan = dataPlans.find(p => p.variation_code === formData.plan);

  return (
    <div className="data-page">
      <Header />

      <div className="data-container">
        <div className="data-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="data-title">Buy Data</h1>
          <p className="data-subtitle">Affordable data bundles for all networks</p>
        </div>

        <Card glass padding="large" className="data-card">
          <form onSubmit={handleSubmit} className="data-form">
            {serverError && (
              <div className="data-error-banner">
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
                    style={{ '--network-color': network.color }}
                    onClick={() => handleNetworkSelect(network.id)}
                  >
                    <img src={network.logo} alt={network.name} className="network-logo" />
                    <span className="network-name">{network.name}</span>
                  </button>
                ))}
              </div>
              {errors.network && <span className="error-text">{errors.network}</span>}
            </div>

            {/* Phone Number */}
            <Input
              type="tel"
              name="phone"
              label="Phone Number"
              placeholder="08012345678"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon="📱"
              required
            />

            {/* Data Plans */}
            {formData.network && (
              <div className="form-section">
                <label className="form-label">Select Data Plan</label>
                {plansLoading ? (
                  <div className="plans-loading">Loading plans...</div>
                ) : (
                  <div className="plans-grid">
                    {dataPlans.map((plan) => (
                      <button
                        key={plan.variation_code}
                        type="button"
                        className={`plan-card ${formData.plan === plan.variation_code ? 'selected' : ''}`}
                        onClick={() => handlePlanSelect(plan)}
                      >
                        <span className="plan-size">{plan.name.split('-')[0].trim()}</span>
                        <span className="plan-price">{formatCurrency(plan.variation_amount)}</span>
                        <span className="plan-validity">{plan.name.includes('Days') ? plan.name.split('-')[1].trim() : 'Monthly'}</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.plan && <span className="error-text">{errors.plan}</span>}
              </div>
            )}

            {/* Summary */}
            {formData.network && formData.phone && formData.plan && selectedPlan && (
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
                  <span>Data Plan:</span>
                  <span className="summary-value">{selectedPlan.name}</span>
                </div>
                <div className="summary-row">
                  <span>Amount:</span>
                  <span className="summary-value">{formatCurrency(selectedPlan.variation_amount)}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={!formData.network || !formData.phone || !formData.plan}
            >
              {loading ? 'Processing...' : `Purchase ${selectedPlan ? selectedPlan.name.split('-')[0].trim() : 'Data'}`}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Data;
