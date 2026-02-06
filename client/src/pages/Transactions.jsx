import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card } from '../components/common';
import { TransactionItem } from '../components/dashboard';
import transactionService from '../services/transactionService';
import { formatCurrency, formatDate } from '../utils/formatters';
import './Transactions.css';

const Transactions = () => {
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    serviceType: 'all',
    searchQuery: '',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactions({
        page: pagination.page,
        limit: pagination.limit,
      });
      
      setTransactions(response.transactions || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await transactionService.getStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Filter by service type
    if (filters.serviceType !== 'all') {
      filtered = filtered.filter(t => t.serviceType === filters.serviceType);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.reference?.toLowerCase().includes(query) ||
        t.recipient?.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.createdAt);
        
        switch (filters.dateRange) {
          case 'today':
            return transactionDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return transactionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return transactionDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Filter by amount range
    if (filters.minAmount) {
      filtered = filtered.filter(t => Number(t.amount) >= Number(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(t => Number(t.amount) <= Number(filters.maxAmount));
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: e.target.value,
    }));
  };

  const groupTransactionsByDate = (transactions) => {
    const groups = {};
    const now = new Date();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      let groupKey;
      
      if (date.toDateString() === now.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
        groupKey = 'Yesterday';
      } else if (date > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        groupKey = 'This Week';
      } else if (date > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) {
        groupKey = 'This Month';
      } else {
        groupKey = formatDate(date);
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(transaction);
    });
    
    return groups;
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="transactions-page">
        <Header />
        <div className="transactions-loading">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <Header />

      <div className="transactions-container">
        <div className="transactions-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="transactions-title">Transactions</h1>
          <p className="transactions-subtitle">View and manage your transaction history</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="transactions-stats">
            <Card glass className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <span className="stat-label">Total Spent</span>
                <span className="stat-value">{formatCurrency(stats.totalSpent || 0)}</span>
              </div>
            </Card>
            <Card glass className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Successful</span>
                <span className="stat-value">{stats.successfulCount || 0}</span>
              </div>
            </Card>
            <Card glass className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-label">Pending</span>
                <span className="stat-value">{stats.pendingCount || 0}</span>
              </div>
            </Card>
            <Card glass className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <span className="stat-label">Failed</span>
                <span className="stat-value">{stats.failedCount || 0}</span>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card glass padding="medium" className="transactions-filters">
          <div className="filters-row">
            {/* Search */}
            <div className="filter-group search-group">
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Service Type Filter */}
            <div className="filter-group">
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Services</option>
                <option value="airtime">Airtime</option>
                <option value="data">Data</option>
                <option value="electricity">Electricity</option>
                <option value="tv">Cable TV</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="filter-group">
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Amount Range Filters */}
            <div className="filter-group amount-range-group">
              <input
                type="number"
                placeholder="Min Amount"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                className="amount-range-input"
              />
              <span className="range-separator">-</span>
              <input
                type="number"
                placeholder="Max Amount"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                className="amount-range-input"
              />
            </div>

            {/* Export Button */}
            <button className="export-button" onClick={handleExport}>
              📥 Export
            </button>
          </div>
        </Card>

        {/* Transactions List */}
        <div className="transactions-list">
          {Object.keys(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions).map(([dateGroup, groupTransactions]) => (
              <div key={dateGroup} className="transaction-group">
                <h3 className="group-header">{dateGroup}</h3>
                <Card glass className="transactions-card">
                  {groupTransactions.map((transaction) => (
                    <TransactionItem
                      key={transaction._id}
                      transaction={transaction}
                      onClick={() => navigate(`/transactions/${transaction._id}`)}
                    />
                  ))}
                </Card>
              </div>
            ))
          ) : (
            <Card glass padding="large" className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No transactions found</h3>
              <p>
                {filters.searchQuery || filters.status !== 'all' || filters.serviceType !== 'all' || filters.dateRange !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start making transactions to see them here'}
              </p>
              {(filters.searchQuery || filters.status !== 'all' || filters.serviceType !== 'all' || filters.dateRange !== 'all' || filters.minAmount || filters.maxAmount) && (
                <button
                  className="clear-filters-button"
                  onClick={() => setFilters({
                    status: 'all',
                    serviceType: 'all',
                    searchQuery: '',
                    dateRange: 'all',
                    minAmount: '',
                    maxAmount: '',
                  })}
                >
                  Clear Filters
                </button>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
