import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronRight, 
  Bell, 
  TrendingUp, 
  Zap, 
  Wallet,
  PiggyBank,
  ArrowRight,
  MessageSquare,
  Lock,
  BarChart3,
  Target,
  Inbox,
  Smartphone,
  Wifi,
  Tv,
  Users,
  Star
} from 'lucide-react';
import { Card, Button } from '../components/common';
import { 
  BalanceCard, 
  ServiceCard, 
  TransactionItem,
  AnalyticsCard,
  AnalyticsChart
} from '../components/dashboard';
import walletService from '../services/walletService';
import transactionService from '../services/transactionService';
import analyticsService from '../services/analyticsService';
import { formatCurrency } from '../utils/formatters';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock chart data for premium visual
  const chartData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 5000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 4890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [walletRes, transactionsRes, analyticsRes] = await Promise.all([
          walletService.getBalance(),
          transactionService.getRecentTransactions(),
          analyticsService.getSpendingAnalytics()
        ]);

        if (walletRes.success) setBalance(walletRes.data.balance);
        if (transactionsRes.success) setTransactions(transactionsRes.data);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const services = [
    { id: 'airtime', icon: Smartphone, title: 'Airtime', path: '/airtime', color: '#6366F1' },
    { id: 'data', icon: Wifi, title: 'Data', path: '/data', color: '#8B5CF6' },
    { id: 'electricity', icon: Zap, title: 'Electricity', path: '/electricity', color: '#F59E0B' },
    { id: 'tv', icon: Tv, title: 'Cable TV', path: '/tv', color: '#EC4899' },
  ];

  const quickActions = [
    { title: 'Fund Wallet', subtitle: 'Add money to your account', icon: Wallet, color: '#10B981', path: '/fund-wallet' },
    { title: 'Withdraw', subtitle: 'Send money to bank', icon: ArrowUpRight, color: '#6366F1', path: '/withdraw' },
    { title: 'Savings Vaults', subtitle: 'Save for your goals', icon: PiggyBank, color: '#8B5CF6', path: '/vaults' },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="dashboard-header">
        <div className="header-top">
          <div className="welcome-text">
            <span>Welcome back,</span>
            <h1>{user?.firstName || 'Dashboard'}</h1>
          </div>
          <button className="notification-bell" onClick={() => navigate('/notifications')}>
            <Bell size={20} />
            <span className="badge"></span>
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="balance-section">
          <BalanceCard 
            balance={balance} 
            onFund={() => navigate('/fund-wallet')}
            onWithdraw={() => navigate('/withdraw')}
          />
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Quick Services</h2>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={<service.icon size={24} />}
                title={service.title}
                onClick={() => navigate(service.path)}
                color={service.color}
              />
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="quick-actions-list">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="quick-action-card glass" 
                onClick={() => navigate(action.path)}
              >
                <div className="quick-action-icon" style={{ backgroundColor: `${action.color}20`, color: action.color }}>
                  <action.icon size={24} />
                </div>
                <div className="quick-action-content">
                  <h4>{action.title}</h4>
                  <p>{action.subtitle}</p>
                </div>
                <div className="quick-action-arrow">
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Insights</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')}>
              Analyze <ArrowRight size={16} />
            </Button>
          </div>
          <Card glass animate={false}>
            <div className="insights-summary">
              <div className="summary-info">
                <span className="summary-label">Total Spending (Weekly)</span>
                <span className="summary-value">{formatCurrency(19550)}</span>
                <span className="summary-trend positive">
                  <TrendingUp size={14} /> +12.5% from last week
                </span>
              </div>
              <AnalyticsChart data={chartData} />
            </div>
          </Card>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Transactions</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')}>
              View All <ArrowRight size={16} />
            </Button>
          </div>
          <div className="transactions-list">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionItem
                  key={transaction._id}
                  transaction={transaction}
                  onClick={() => navigate(`/transactions/${transaction._id}`)}
                />
              ))
            ) : (
              <div className="empty-state">
                <Inbox size={48} strokeWidth={1} />
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </section>

        {analytics && (
          <section className="dashboard-section">
            <h2 className="section-title">Spending Categories</h2>
            <div className="analytics-grid">
              <AnalyticsCard
                icon={<BarChart3 size={24} />}
                value={formatCurrency(analytics.spendingThisMonth)}
                label="Spending This Month"
                trend={{
                  change: analytics.spendingChange,
                  text: `${analytics.spendingChange}% from last month`,
                }}
                color="#6366F1"
              />
              <AnalyticsCard
                icon={<Target size={24} />}
                value={analytics.topCategory.name}
                label={`${formatCurrency(analytics.topCategory.amount)} • Top Category`}
                color="#8B5CF6"
              />
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
