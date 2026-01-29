import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/common';
import { isValidEmail } from '../utils/validators';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);

    const result = await login(formData);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-logo">ZEPAYRA</h1>
          <p className="login-tagline">Your Digital Wallet, Simplified</p>
        </div>

        <Card glass padding="large" className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <h2 className="login-title">Sign In</h2>

            {serverError && (
              <div className="login-error-banner">
                {serverError}
              </div>
            )}

            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon="📧"
              required
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon="🔒"
              required
            />

            <Link to="/forgot-password" className="login-forgot-link">
              Forgot Password?
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>

            <p className="login-signup-text">
              Don't have an account?{' '}
              <Link to="/register" className="login-signup-link">
                Sign Up
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
