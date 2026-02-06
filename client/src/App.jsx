import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Airtime from './pages/Airtime';
import Data from './pages/Data';
import Electricity from './pages/Electricity';
import CableTV from './pages/CableTV';
import Transactions from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';
import FundWallet from './pages/FundWallet';
import Withdraw from './pages/Withdraw';
import Referrals from './pages/Referrals';
import Beneficiaries from './pages/Beneficiaries';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Security from './pages/Security';
import Profile from './pages/Profile';
import AccountSettings from './pages/AccountSettings';
import './styles/globals.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="animate-spin" style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #E2E8F0', 
          borderTopColor: '#6366F1', 
          borderRadius: '50%' 
        }}></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="animate-spin" style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #E2E8F0', 
          borderTopColor: '#6366F1', 
          borderRadius: '50%' 
        }}></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/airtime" 
            element={
              <ProtectedRoute>
                <Airtime />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/data" 
            element={
              <ProtectedRoute>
                <Data />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/electricity" 
            element={
              <ProtectedRoute>
                <Electricity />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tv" 
            element={
              <ProtectedRoute>
                <CableTV />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions/:id" 
            element={
              <ProtectedRoute>
                <TransactionDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fund-wallet" 
            element={
              <ProtectedRoute>
                <FundWallet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/withdraw" 
            element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/referrals" 
            element={
              <ProtectedRoute>
                <Referrals />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/beneficiaries" 
            element={
              <ProtectedRoute>
                <Beneficiaries />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/security" 
            element={
              <ProtectedRoute>
                <Security />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/account-settings" 
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/theme-settings" 
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
