import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, Button, Input } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validators';
import logo from '../assets/images/logo.png';
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
          <img src={logo} alt="ZEPAYRA" className="login-logo-img" style={{ height: '120px', marginBottom: '1.5rem', display: 'block', margin: '0 auto' }} />
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
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail size={18} />}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={18} />}
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
