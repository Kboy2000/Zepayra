import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { BalanceCard, ServiceCard, TransactionItem, AnalyticsCard } from '../components/dashboard';
import walletService from '../services/walletService';
import transactionService from '../services/transactionService';
import { formatCurrency } from '../utils/formatters';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch balance
      const balanceData = await walletService.getBalance();
      setBalance(balanceData.balance);

      // Fetch recent transactions
      const transactionsData = await walletService.getHistory({ page: 1, limit: 3 });
      setTransactions(transactionsData.transactions || []);

      // Fetch analytics (mock data for now)
      setAnalytics({
        spendingThisMonth: 12450,
        spendingChange: 15,
        topCategory: { name: 'Airtime', amount: 5200 },
        transactionsCount: 24,
        transactionsChange: 8,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { id: 'airtime', icon: '📞', title: 'Airtime', color: '#6366F1', path: '/airtime' },
    { id: 'data', icon: '📡', title: 'Data', color: '#8B5CF6', path: '/data' },
    { id: 'electricity', icon: '⚡', title: 'Electricity', color: '#EC4899', path: '/electricity' },
    { id: 'tv', icon: '📺', title: 'Cable TV', color: '#10B981', path: '/tv' },
  ];

  const quickActions = [
    { id: 'referrals', icon: '👥', title: 'Referrals', subtitle: 'Earn rewards', color: '#F59E0B', path: '/referrals' },
    { id: 'beneficiaries', icon: '⭐', title: 'Beneficiaries', subtitle: 'Quick send', color: '#6366F1', path: '/beneficiaries' },
    { id: 'notifications', icon: '🔔', title: 'Notifications', subtitle: 'Stay updated', color: '#8B5CF6', path: '/notifications' },
    { id: 'support', icon: '💬', title: 'Support', subtitle: 'Get help', color: '#10B981', path: '/support' },
    { id: 'security', icon: '🔒', title: 'Security', subtitle: 'Stay safe', color: '#EF4444', path: '/security' },
  ];

  const handleServiceClick = (service) => {
    if (service.path) {
      navigate(service.path);
    }
  };

  const handleAddMoney = () => {
    navigate('/fund-wallet');
  };

  const handleWithdraw = () => {
    navigate('/withdraw');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard-container">
        <BalanceCard 
          balance={balance}
          onAddMoney={handleAddMoney}
          onWithdraw={handleWithdraw}
        />

        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Services</h2>
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                color={service.color}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="quick-action-card"
                onClick={() => navigate(action.path)}
                style={{ borderLeftColor: action.color }}
              >
                <div className="quick-action-icon" style={{ backgroundColor: `${action.color}20` }}>
                  {action.icon}
                </div>
                <div className="quick-action-content">
                  <h4>{action.title}</h4>
                  <p>{action.subtitle}</p>
                </div>
                <div className="quick-action-arrow">→</div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Recent Transactions</h2>
            <button 
              className="dashboard-view-all"
              onClick={() => navigate('/transactions')}
            >
              View All →
            </button>
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
                <span className="empty-state-icon">📭</span>
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </section>

        {analytics && (
          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Insights & Analytics</h2>
            <div className="analytics-grid">
              <AnalyticsCard
                icon="📊"
                value={formatCurrency(analytics.spendingThisMonth)}
                label="Spending This Month"
                trend={{
                  change: analytics.spendingChange,
                  text: `${analytics.spendingChange}% from last month`,
                }}
                color="#6366F1"
              />

              <AnalyticsCard
                icon="🎯"
                value={analytics.topCategory.name}
                label={`${formatCurrency(analytics.topCategory.amount)} • Top Category`}
                color="#8B5CF6"
              />

              <AnalyticsCard
                icon="📈"
                value={analytics.transactionsCount}
                label="Transactions This Month"
                trend={{
                  change: analytics.transactionsChange,
                  text: `+${analytics.transactionsChange} from last month`,
                }}
                color="#EC4899"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
