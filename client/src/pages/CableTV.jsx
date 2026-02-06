import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Button, Input, Card } from '../components/common';
import serviceService from '../services/serviceService';
import { formatCurrency } from '../utils/formatters';
import './CableTV.css';

const CableTV = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    provider: '',
    smartCardNumber: '',
    package: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [packages, setPackages] = useState([]);

  const providers = [
    { id: 'dstv', name: 'DSTV', logo: '/service-providers-logo/DStv-logo.jpg', color: '#0033A0' },
    { id: 'gotv', name: 'GOtv', logo: '/service-providers-logo/gotv-logo.png', color: '#E30613' },
    { id: 'startimes', name: 'Startimes', logo: '/service-providers-logo/StarTimes-logo.png', color: '#FF6600' },
  ];

  useEffect(() => {
    if (formData.provider) {
      fetchPackages(formData.provider);
    }
  }, [formData.provider]);

  const fetchPackages = async (providerId) => {
    setPackagesLoading(true);
    try {
      const response = await serviceService.getServiceVariations(providerId);
      setPackages(response.variations || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      // Mock packages for testing
      const mockPackages = {
        'dstv': [
          { variation_code: 'dstv-padi', name: 'DSTV Padi', variation_amount: 2500 },
          { variation_code: 'dstv-yanga', name: 'DSTV Yanga', variation_amount: 3500 },
          { variation_code: 'dstv-confam', name: 'DSTV Confam', variation_amount: 6200 },
          { variation_code: 'dstv-compact', name: 'DSTV Compact', variation_amount: 10500 },
          { variation_code: 'dstv-premium', name: 'DSTV Premium', variation_amount: 24500 },
        ],
        'gotv': [
          { variation_code: 'gotv-lite', name: 'GOtv Lite', variation_amount: 1100 },
          { variation_code: 'gotv-jinja', name: 'GOtv Jinja', variation_amount: 2250 },
          { variation_code: 'gotv-jolli', name: 'GOtv Jolli', variation_amount: 3300 },
          { variation_code: 'gotv-max', name: 'GOtv Max', variation_amount: 4850 },
        ],
        'startimes': [
          { variation_code: 'nova', name: 'Nova', variation_amount: 1200 },
          { variation_code: 'basic', name: 'Basic', variation_amount: 2200 },
          { variation_code: 'smart', name: 'Smart', variation_amount: 3000 },
          { variation_code: 'classic', name: 'Classic', variation_amount: 3600 },
        ],
      };
      setPackages(mockPackages[providerId] || []);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handleProviderSelect = (providerId) => {
    setFormData({ ...formData, provider: providerId, package: '' });
    if (errors.provider) {
      setErrors({ ...errors, provider: '' });
    }
  };

  const handlePackageSelect = (pkg) => {
    setFormData({ ...formData, package: pkg.variation_code });
    if (errors.package) {
      setErrors({ ...errors, package: '' });
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

    if (!formData.provider) {
      newErrors.provider = 'Please select a provider';
    }

    if (!formData.smartCardNumber) {
      newErrors.smartCardNumber = 'Smart card number is required';
    } else if (formData.smartCardNumber.length < 10) {
      newErrors.smartCardNumber = 'Please enter a valid smart card number';
    }

    if (!formData.package) {
      newErrors.package = 'Please select a package';
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
      const result = await serviceService.subscribeCableTV({
        serviceID: formData.provider,
        billersCode: formData.smartCardNumber,
        variation_code: formData.package,
      });

      if (result.success) {
        const selectedPackage = packages.find(p => p.variation_code === formData.package);
        alert(`Subscription successful! ${selectedPackage?.name} activated for ${formData.smartCardNumber}`);
        navigate('/transactions');
      } else {
        setServerError(result.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedProvider = providers.find(p => p.id === formData.provider);
  const selectedPackage = packages.find(p => p.variation_code === formData.package);

  return (
    <div className="cabletv-page">
      <Header />

      <div className="cabletv-container">
        <div className="cabletv-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="cabletv-title">Cable TV Subscription</h1>
          <p className="cabletv-subtitle">Renew your cable TV subscription instantly</p>
        </div>

        <Card glass padding="large" className="cabletv-card">
          <form onSubmit={handleSubmit} className="cabletv-form">
            {serverError && (
              <div className="cabletv-error-banner">
                {serverError}
              </div>
            )}

            {/* Provider Selection */}
            <div className="form-section">
              <label className="form-label">Select Provider</label>
              <div className="provider-grid">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    className={`provider-card ${formData.provider === provider.id ? 'selected' : ''}`}
                    style={{ '--provider-color': provider.color }}
                    onClick={() => handleProviderSelect(provider.id)}
                  >
                    <img src={provider.logo} alt={provider.name} className="provider-logo" />
                    <span className="provider-name">{provider.name}</span>
                  </button>
                ))}
              </div>
              {errors.provider && <span className="error-text">{errors.provider}</span>}
            </div>

            {/* Smart Card Number */}
            <Input
              type="text"
              name="smartCardNumber"
              label="Smart Card Number"
              placeholder="Enter your smart card number"
              value={formData.smartCardNumber}
              onChange={handleChange}
              error={errors.smartCardNumber}
              icon="📺"
              required
            />

            {/* Packages */}
            {formData.provider && (
              <div className="form-section">
                <label className="form-label">Select Package</label>
                {packagesLoading ? (
                  <div className="packages-loading">Loading packages...</div>
                ) : (
                  <div className="packages-grid">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.variation_code}
                        type="button"
                        className={`package-card ${formData.package === pkg.variation_code ? 'selected' : ''}`}
                        onClick={() => handlePackageSelect(pkg)}
                      >
                        <span className="package-name">{pkg.name}</span>
                        <span className="package-price">{formatCurrency(pkg.variation_amount)}</span>
                        <span className="package-duration">Monthly</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.package && <span className="error-text">{errors.package}</span>}
              </div>
            )}

            {/* Summary */}
            {formData.provider && formData.smartCardNumber && formData.package && selectedPackage && (
              <div className="purchase-summary">
                <h3>Subscription Summary</h3>
                <div className="summary-row">
                  <span>Provider:</span>
                  <span className="summary-value">{selectedProvider?.name}</span>
                </div>
                <div className="summary-row">
                  <span>Smart Card:</span>
                  <span className="summary-value">{formData.smartCardNumber}</span>
                </div>
                <div className="summary-row">
                  <span>Package:</span>
                  <span className="summary-value">{selectedPackage.name}</span>
                </div>
                <div className="summary-row">
                  <span>Amount:</span>
                  <span className="summary-value">{formatCurrency(selectedPackage.variation_amount)}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={!formData.provider || !formData.smartCardNumber || !formData.package}
            >
              {loading ? 'Processing...' : `Subscribe ${selectedPackage ? '- ' + formatCurrency(selectedPackage.variation_amount) : ''}`}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CableTV;
