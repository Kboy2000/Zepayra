import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/common';
import { isValidEmail, isValidNigerianPhone, validatePassword } from '../utils/validators';
import logo from '../assets/images/logo.png';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidNigerianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Nigerian phone number (e.g., 08012345678)';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-logo">ZEPAYRA</h1>
          <p className="register-tagline">Join thousands of Nigerians managing their finances smarter</p>
        </div>

        <Card glass padding="large" className="register-card">
          <form onSubmit={handleSubmit} className="register-form">
            <h2 className="register-title">Create Account</h2>

            {serverError && (
              <div className="register-error-banner">
                {serverError}
              </div>
            )}

            <div className="register-name-row">
              <Input
                type="text"
                name="firstName"
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />

              <Input
                type="text"
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </div>

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
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon={<Smartphone size={18} />}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create strong password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={18} />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock size={18} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Create Account
            </Button>

            <p className="register-signin-text">
              Already have an account?{' '}
              <Link to="/login" className="register-signin-link">
                Sign In
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
