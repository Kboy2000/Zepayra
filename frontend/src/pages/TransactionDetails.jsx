import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Hash,
  Calendar,
  Wallet,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';

import * as htmlToImage from 'html-to-image';
import transactionService from '../services/transactionService';
import { Card, Button, Skeleton, Toast } from '../components/common';
import { formatCurrency, formatDate } from '../utils/formatters';
import './TransactionDetails.css';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);
  const receiptRef = useRef(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await transactionService.getTransactionById(id);
        if (response.success) {
          setTransaction(response.data);
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleCopyReference = () => {
    navigator.clipboard.writeText(transaction.reference);
    setToast({ message: 'Reference copied to clipboard!', type: 'success' });
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, {
        quality: 1,
        backgroundColor: 'var(--bg-primary)',
        style: {
          borderRadius: '0px'
        }
      });
      
      const link = document.createElement('a');
      link.download = `zepayra-receipt-${transaction.reference}.png`;
      link.href = dataUrl;
      link.click();
      
      setToast({ message: 'Receipt downloaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setToast({ message: 'Failed to download receipt', type: 'error' });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="details-loading"><Skeleton type="card" count={3} /></div>;
  if (!transaction) return <div className="details-not-found">Transaction not found</div>;

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'success': return <CheckCircle2 className="status-icon success" size={48} />;
      case 'pending': return <Clock className="status-icon pending" size={48} />;
      default: return <XCircle className="status-icon failed" size={48} />;
    }
  };

  return (
    <motion.div 
      className="transaction-details-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1>Receipt</h1>
        <div className="header-actions">
          <Button variant="ghost" size="sm" onClick={() => {/* Share logic */}}>
            <Share2 size={18} />
          </Button>
        </div>
      </header>

      <div className="receipt-wrapper">
        <div className="receipt-card-container" ref={receiptRef}>
          <Card glass className="receipt-card">
            <div className="receipt-header">
              <div className="brand-logo">ZEPAYRA</div>
              {getStatusIcon()}
              <h2 className="receipt-amount">{formatCurrency(transaction.amount)}</h2>
              <span className={`receipt-status-badge ${transaction.status}`}>
                {transaction.status.toUpperCase()}
              </span>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Service</span>
                  <span className="detail-value">{transaction.serviceType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{formatDate(transaction.createdAt)}</span>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Reference</span>
                  <div className="value-with-action" onClick={handleCopyReference}>
                    <span className="detail-value reference">{transaction.reference}</span>
                    <Copy size={14} />
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-value">Wallet</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fee</span>
                  <span className="detail-value">{formatCurrency(transaction.fee || 0)}</span>
                </div>
              </div>

              {transaction.metadata && Object.keys(transaction.metadata).map(key => (
                <div className="detail-row" key={key}>
                  <div className="detail-item">
                    <span className="detail-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span className="detail-value">{transaction.metadata[key]}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="receipt-footer">
              <p>Thank you for using Zepayra</p>
              <div className="support-link">
                <ExternalLink size={12} />
                <span>Support help.zepayra.com</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="receipt-actions">
          <Button 
            className="download-btn" 
            onClick={handleDownloadReceipt}
            loading={downloading}
          >
            <Download size={20} /> Download Receipt
          </Button>
          <Button variant="secondary" className="support-btn" onClick={() => navigate('/support')}>
            <MessageSquare size={20} /> Need Help?
          </Button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </motion.div>
  );
};

export default TransactionDetails;

