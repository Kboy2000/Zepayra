import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Book, 
  User, 
  CreditCard, 
  Settings, 
  Lock, 
  Mail, 
  Phone, 
  MessageCircle, 
  Twitter,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Card, Button } from '../components/common';
import './Support.css';

const Support = () => {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'account', name: 'Account', icon: User },
    { id: 'transactions', name: 'Transactions', icon: CreditCard },
    { id: 'technical', name: 'Technical', icon: Settings },
    { id: 'security', name: 'Security', icon: Lock },
  ];

  const faqs = [
    { id: 1, category: 'account', question: 'How do I create an account?', answer: 'Click on "Sign Up" on the login page, fill in your details including name, email, phone number, and password. You\'ll receive a verification code to complete registration.' },
    { id: 2, category: 'account', question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.' },
    { id: 3, category: 'transactions', question: 'How long does a transaction take?', answer: 'Most transactions are processed instantly. However, some services may take up to 5 minutes during peak hours.' },
    { id: 4, category: 'transactions', question: 'Can I cancel a transaction?', answer: 'Once a transaction is successful, it cannot be cancelled. However, if it\'s pending, you can contact support for assistance.' },
    { id: 5, category: 'payments', question: 'What payment methods are supported?', answer: 'We support bank transfer, debit/credit cards, and USSD codes for funding your wallet.' },
    { id: 6, category: 'payments', question: 'Are there any transaction fees?', answer: 'Card payments have a 1.5% fee. Bank transfers and USSD are free. Service purchases have no additional fees.' },
    { id: 7, category: 'technical', question: 'The app is not loading', answer: 'Try clearing your browser cache, checking your internet connection, or using a different browser. If the issue persists, contact support.' },
    { id: 8, category: 'security', question: 'How do I enable 2FA?', answer: 'Go to Settings > Security > Two-Factor Authentication and follow the setup instructions.' },
  ];

  const contactMethods = [
    { id: 'email', name: 'Email Support', icon: Mail, value: 'support@zepayra.com', action: 'mailto:support@zepayra.com' },
    { id: 'phone', name: 'Phone Support', icon: Phone, value: '+234 800 123 4567', action: 'tel:+2348001234567' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, value: 'Chat with us', action: 'https://wa.me/2348001234567' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, value: '@ZepayraHQ', action: 'https://twitter.com/ZepayraHQ' },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <div className="support-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="support-title">Help & Support</h1>
          <p className="support-subtitle">We're here to help you 24/7</p>
        </div>

        {/* Search */}
        <Card glass padding="medium" className="search-card">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Card glass className="quick-action-card" onClick={() => navigate('/transactions')}>
            <CreditCard className="action-icon" size={24} />
            <h4>Track Transaction</h4>
            <p>Check your transaction status</p>
          </Card>
          <Card glass className="quick-action-card" onClick={() => navigate('/security')}>
            <Lock className="action-icon" size={24} />
            <h4>Security Settings</h4>
            <p>Manage your account security</p>
          </Card>
          <Card glass className="quick-action-card">
            <FileText className="action-icon" size={24} />
            <h4>Submit Ticket</h4>
            <p>Report an issue</p>
          </Card>
        </div>

        {/* Categories */}
        <div className="categories">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <Icon className="category-icon" size={18} />
                <span className="category-name">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* FAQs */}
        <Card glass padding="large" className="faq-card">
          <h3 className="section-title">Frequently Asked Questions</h3>

          <div className="faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => (
                <div key={faq.id} className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}>
                  <button className="faq-question" onClick={() => toggleFaq(faq.id)}>
                    <span>{faq.question}</span>
                    <span className="faq-toggle">
                      {expandedFaq === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">
                <Search className="no-results-icon" size={48} opacity={0.5} />
                <p>No FAQs found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Methods */}
        <Card glass padding="large" className="contact-card">
          <h3 className="section-title">Contact Us</h3>
          <p className="section-subtitle">Choose your preferred contact method</p>

          <div className="contact-methods">
            {contactMethods.map(method => {
              const icons = { email: Mail, phone: Phone, whatsapp: MessageCircle, twitter: Twitter };
              const Icon = icons[method.id] || HelpCircle;
              return (
                <a
                  key={method.id}
                  href={method.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-method"
                >
                  <Icon className="contact-icon" size={24} />
                  <div className="contact-info">
                    <h4>{method.name}</h4>
                    <p>{method.value}</p>
                  </div>
                  <ExternalLink className="contact-arrow" size={16} />
                </a>
              );
            })}
          </div>
        </Card>

        {/* Live Chat Placeholder */}
        <Card glass padding="large" className="live-chat-card">
          <div className="live-chat-content">
            <MessageSquare size={32} className="chat-icon" />
            <div>
              <h3>Need Immediate Help?</h3>
              <p>Start a live chat with our support team</p>
            </div>
            <Button primary size="medium">
              Start Chat
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Support;
