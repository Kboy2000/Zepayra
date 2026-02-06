const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { generateReference } = require('../utils/helpers');
const logger = require('../utils/logger');

class WalletService {
  /**
   * Create wallet for new user
   */
  async createWallet(userId) {
    try {
      const wallet = await Wallet.create({
        userId,
        balance: 0,
      });
      
      logger.success(`Wallet created for user: ${userId}`);
      return wallet;
    } catch (error) {
      logger.error(`Create wallet error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user wallet
   */
  async getWallet(userId) {
    try {
      const wallet = await Wallet.findOne({ userId });
      
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      
      return wallet;
    } catch (error) {
      logger.error(`Get wallet error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Credit wallet (manual funding)
   */
  async creditWallet(userId, amount, description = 'Manual wallet funding') {
    try {
      const wallet = await this.getWallet(userId);
      const balanceBefore = wallet.balance;

      // Credit wallet
      await wallet.credit(amount);

      // Create transaction record
      const transaction = await Transaction.create({
        userId,
        walletId: wallet._id,
        type: 'credit',
        category: 'funding',
        amount,
        balanceBefore,
        balanceAfter: wallet.balance,
        status: 'success',
        reference: generateReference('FUND'),
        description,
      });

      logger.success(`Wallet credited: ${userId} - ₦${amount}`);

      return {
        wallet,
        transaction,
      };
    } catch (error) {
      logger.error(`Credit wallet error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Debit wallet (for purchases)
   */
  async debitWallet(userId, amount, category, description, additionalData = {}) {
    try {
      const wallet = await this.getWallet(userId);
      
      // Check sufficient balance
      if (!wallet.hasSufficientBalance(amount)) {
        throw new Error('Insufficient wallet balance');
      }

      const balanceBefore = wallet.balance;

      // Debit wallet
      await wallet.debit(amount);

      // Create transaction record
      const transactionData = {
        userId,
        walletId: wallet._id,
        type: 'debit',
        category,
        amount,
        balanceBefore,
        balanceAfter: wallet.balance,
        status: 'pending',
        reference: generateReference(),
        description,
        ...additionalData,
      };

      const transaction = await Transaction.create(transactionData);

      logger.success(`Wallet debited: ${userId} - ₦${amount}`);

      return {
        wallet,
        transaction,
      };
    } catch (error) {
      logger.error(`Debit wallet error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Refund wallet (when transaction fails)
   */
  async refundWallet(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.type !== 'debit') {
        throw new Error('Only debit transactions can be refunded');
      }

      if (transaction.status === 'success') {
        throw new Error('Cannot refund successful transaction');
      }

      const wallet = await this.getWallet(transaction.userId);
      const balanceBefore = wallet.balance;

      // Credit wallet with refund
      await wallet.credit(transaction.amount);

      // Create refund transaction
      const refundTransaction = await Transaction.create({
        userId: transaction.userId,
        walletId: wallet._id,
        type: 'credit',
        category: 'refund',
        amount: transaction.amount,
        balanceBefore,
        balanceAfter: wallet.balance,
        status: 'success',
        reference: generateReference('REFUND'),
        description: `Refund for ${transaction.reference}`,
      });

      // Update original transaction status
      transaction.status = 'failed';
      await transaction.save();

      logger.success(`Wallet refunded: ${transaction.userId} - ₦${transaction.amount}`);

      return {
        wallet,
        refundTransaction,
      };
    } catch (error) {
      logger.error(`Refund wallet error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(transactionId, status, vtpassResponse = null, failureReason = null) {
    try {
      const transaction = await Transaction.findById(transactionId);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      transaction.status = status;
      
      if (vtpassResponse) {
        transaction.vtpassResponse = vtpassResponse;
      }
      
      if (failureReason) {
        transaction.failureReason = failureReason;
      }

      await transaction.save();
      logger.success(`Transaction status updated: ${transactionId} - ${status}`);

      return transaction;
    } catch (error) {
      logger.error(`Update transaction status error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new WalletService();
