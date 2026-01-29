# ZEPAYRA - Complete Project Documentation

**Version:** 1.0.0  
**Live URL:** https://zepayra.vercel.app/  
**GitHub Repository:** https://github.com/Kboy2000/Zepayra.git  
**Documentation Date:** January 29, 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Technical Architecture](#technical-architecture)
4. [Features & Functionality](#features--functionality)
5. [Frontend Documentation](#frontend-documentation)
6. [Backend Documentation](#backend-documentation)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Security & Authentication](#security--authentication)
10. [Deployment & Hosting](#deployment--hosting)
11. [User Guide](#user-guide)
12. [Development Workflow](#development-workflow)
13. [Future Enhancements](#future-enhancements)

---

## Executive Summary

**ZEPAYRA** is a next-generation Nigerian fintech super-app designed to provide seamless digital financial services. The platform enables users to purchase airtime, data bundles, pay electricity bills, subscribe to cable TV services, manage digital wallets, and perform various financial transactions—all within a modern, intuitive interface.

### Key Highlights

- **Full-Stack Application:** React-based frontend with Node.js/Express backend
- **Secure Authentication:** JWT-based authentication with bcrypt password hashing
- **Real-Time Transactions:** Integrated wallet system with transaction history
- **Bill Payment Services:** Airtime, Data, Electricity, Cable TV
- **Modern UI/UX:** Premium design with responsive layouts
- **Production Ready:** Deployed on Vercel with MongoDB database

---

## Project Overview

### Vision

To create a comprehensive fintech platform that simplifies digital payments and financial services for Nigerian users, competing with established platforms like OPay, PalmPay, and Kuda.

### Target Audience

- Nigerian consumers seeking convenient bill payment solutions
- Users looking for a unified platform for multiple financial services
- Mobile-first users requiring fast, reliable digital transactions

### Core Value Propositions

1. **Unified Platform:** All financial services in one application
2. **User-Friendly Interface:** Intuitive design with minimal learning curve
3. **Secure Transactions:** Bank-level security with encrypted communications
4. **Fast Processing:** Quick transaction processing and instant confirmations
5. **Beneficiary Management:** Save and reuse recipient information
6. **Transaction History:** Complete audit trail of all activities

---

## Technical Architecture

### Technology Stack

#### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.11.0
- **HTTP Client:** Axios 1.13.2
- **Styling:** Custom CSS with modern design patterns
- **State Management:** React Context API

#### Backend
- **Runtime:** Node.js
- **Framework:** Express 4.18.2
- **Database:** MongoDB with Mongoose 8.0.3
- **Authentication:** JSON Web Tokens (JWT) 9.0.2
- **Password Hashing:** bcryptjs 2.4.3
- **Security:** Helmet 7.1.0, CORS 2.8.5
- **Rate Limiting:** express-rate-limit 7.1.5
- **Validation:** express-validator 7.0.1
- **Logging:** Morgan 1.10.0

#### DevOps & Deployment
- **Version Control:** Git & GitHub
- **Hosting:** Vercel (Frontend & Backend)
- **Database Hosting:** MongoDB Atlas (recommended)
- **Environment Management:** dotenv

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │   React Application (Vite)                       │   │
│  │   - Pages (18 routes)                            │   │
│  │   - Components (Reusable UI)                     │   │
│  │   - Context (Auth, State)                        │   │
│  │   - Services (API calls)                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Express.js Server                              │   │
│  │   - Routes (9 modules)                           │   │
│  │   - Controllers (Business logic)                 │   │
│  │   - Middleware (Auth, Validation, Error)         │   │
│  │   - Services (External integrations)             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕ Mongoose
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │   MongoDB Database                               │   │
│  │   - Users Collection                             │   │
│  │   - Wallets Collection                           │   │
│  │   - Transactions Collection                      │   │
│  │   - Beneficiaries Collection                     │   │
│  │   - Services Collection                          │   │
│  │   - Notifications Collection                     │   │
│  │   - Referrals Collection                         │   │
│  │   - Bank Accounts Collection                     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
ZEPAYRA/
├── frontend/
│   ├── src/
│   │   ├── assets/          # Static assets (images, icons)
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Shared components
│   │   │   ├── dashboard/   # Dashboard-specific components
│   │   │   └── layout/      # Layout components
│   │   ├── context/         # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components (18 pages)
│   │   ├── services/        # API service modules
│   │   ├── styles/          # Global styles
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   ├── database.js  # MongoDB connection
│   │   │   └── vtpass.js    # VTPass API config
│   │   ├── controllers/     # Request handlers (9 modules)
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.js      # Authentication middleware
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── models/          # Mongoose schemas (8 models)
│   │   │   ├── User.js
│   │   │   ├── Wallet.js
│   │   │   ├── Transaction.js
│   │   │   ├── Beneficiary.js
│   │   │   ├── Service.js
│   │   │   ├── Notification.js
│   │   │   ├── Referral.js
│   │   │   └── BankAccount.js
│   │   ├── routes/          # API routes (9 modules)
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Server entry point
│   └── package.json
│
├── .gitignore
├── vercel.json              # Vercel deployment config
└── DOCUMENTATION.md         # This file
```

---

## Features & Functionality

### 1. User Authentication & Authorization

#### Registration
- **Email-based registration** with password validation
- **Automatic wallet creation** upon successful registration
- **Email verification** (optional enhancement)
- **Referral code support** for user acquisition

#### Login
- **Secure JWT-based authentication**
- **Password encryption** using bcrypt
- **Session management** with token refresh
- **Remember me functionality**
- **Protected route access**

#### Security Features
- **Transaction PIN** for sensitive operations
- **Password change** functionality
- **Account security settings**
- **Session timeout** management

### 2. Wallet Management

#### Wallet Features
- **Virtual wallet** with real-time balance
- **Fund wallet** via multiple payment methods
- **Withdraw funds** to linked bank accounts
- **Transaction history** with filtering
- **Balance visibility toggle** for privacy
- **Wallet analytics** and insights

#### Funding Methods
- Bank transfer
- Card payment
- USSD code
- Bank account linking

### 3. Bill Payment Services

#### Airtime Purchase
- **Network providers:** MTN, Airtel, Glo, 9mobile
- **Amount selection:** Predefined or custom amounts
- **Beneficiary management:** Save frequent recipients
- **Recent recipients:** Quick access to previous transactions
- **Contact integration:** Select from phone contacts

#### Data Bundle Purchase
- **Network-specific plans:** Tailored data plans per provider
- **Plan categories:** Daily, Weekly, Monthly bundles
- **Auto-renewal options** (future enhancement)
- **Data gifting** to other numbers

#### Electricity Bill Payment
- **Supported DISCOs:** IKEDC, EKEDC, and others
- **Meter validation:** Verify meter numbers before payment
- **Prepaid & Postpaid** support
- **Payment history** per meter number
- **Token delivery** via SMS/email

#### Cable TV Subscription
- **Providers:** DSTV, GOtv, Startimes
- **Package selection:** All available subscription plans
- **Smart card validation**
- **Auto-renewal** reminders
- **Multi-device management**

### 4. Beneficiary Management

- **Save beneficiaries** across all services
- **Quick selection** from saved list
- **Edit beneficiary details**
- **Delete beneficiaries**
- **Recent recipients** auto-save
- **Beneficiary categories** (Airtime, Data, Bills)

### 5. Transaction Management

#### Transaction History
- **Complete transaction log** with timestamps
- **Status tracking:** Pending, Successful, Failed
- **Filter by:**
  - Date range
  - Service type
  - Status
  - Amount range
- **Search functionality**
- **Export to PDF/CSV** (future enhancement)

#### Transaction Details
- **Detailed view** of each transaction
- **Receipt generation**
- **Transaction reference numbers**
- **Customer support** integration for disputes
- **Retry failed transactions**

### 6. Referral Program

- **Unique referral codes** for each user
- **Referral tracking** dashboard
- **Earnings from referrals**
- **Referral history**
- **Social sharing** integration
- **Bonus rewards** for successful referrals

### 7. Notifications

- **Transaction notifications**
- **Promotional offers**
- **System announcements**
- **Security alerts**
- **Mark as read/unread**
- **Notification preferences**

### 8. User Profile & Settings

#### Profile Management
- **Personal information** editing
- **Profile picture** upload
- **Contact details** management
- **KYC verification** (future enhancement)

#### Account Settings
- **Email preferences**
- **Notification settings**
- **Privacy controls**
- **Language selection**
- **Theme customization**

#### Security Settings
- **Change password**
- **Set/Change transaction PIN**
- **Two-factor authentication** (2FA) - future
- **Login history**
- **Device management**

### 9. Customer Support

- **In-app support** chat
- **FAQ section**
- **Ticket system** for issues
- **Email support**
- **Phone support** integration
- **Help center** with guides

---

## Frontend Documentation

### Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | User authentication page |
| Register | `/register` | New user registration |
| Dashboard | `/dashboard` | Main user dashboard with overview |
| Airtime | `/airtime` | Airtime purchase interface |
| Data | `/data` | Data bundle purchase |
| Electricity | `/electricity` | Electricity bill payment |
| Cable TV | `/tv` | Cable TV subscription |
| Transactions | `/transactions` | Transaction history list |
| Transaction Details | `/transactions/:id` | Individual transaction view |
| Fund Wallet | `/fund-wallet` | Wallet funding interface |
| Withdraw | `/withdraw` | Withdrawal to bank account |
| Beneficiaries | `/beneficiaries` | Saved beneficiaries management |
| Referrals | `/referrals` | Referral program dashboard |
| Notifications | `/notifications` | User notifications center |
| Profile | `/profile` | User profile management |
| Account Settings | `/account-settings` | Account preferences |
| Security | `/security` | Security settings |
| Support | `/support` | Customer support center |

### Component Architecture

#### Layout Components
- **Header:** Navigation bar with user menu
- **Sidebar:** Service navigation menu
- **Footer:** App information and links
- **Container:** Page wrapper with consistent spacing

#### Dashboard Components
- **BalanceCard:** Displays wallet balance with visibility toggle
- **ServicesGrid:** Quick access to all services
- **RecentTransactions:** Latest transaction list
- **InsightsAnalytics:** Spending analytics and charts

#### Common Components
- **Button:** Reusable button with variants
- **Input:** Form input with validation
- **Card:** Container component
- **Modal:** Popup dialogs
- **Loader:** Loading spinner
- **Alert:** Notification messages
- **TransactionItem:** Transaction list item

### State Management

#### AuthContext
```javascript
{
  user: Object,           // Current user data
  isAuthenticated: Boolean,
  loading: Boolean,
  login: Function,
  logout: Function,
  register: Function,
  updateUser: Function
}
```

### API Service Layer

Located in `frontend/src/services/`:

- **authService.js:** Authentication operations
- **walletService.js:** Wallet operations
- **serviceService.js:** Bill payment services
- **transactionService.js:** Transaction operations
- **beneficiaryService.js:** Beneficiary management
- **userService.js:** User profile operations

### Styling Approach

- **Custom CSS** with CSS variables for theming
- **Responsive design** with mobile-first approach
- **Color scheme:** Modern fintech palette
- **Typography:** Clean, readable fonts
- **Animations:** Smooth transitions and micro-interactions
- **Glassmorphism effects** for premium feel

---

## Backend Documentation

### API Routes

#### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user
- `PUT /update-profile` - Update user profile
- `PUT /change-password` - Change password

#### Wallet Routes (`/api/wallet`)
- `GET /balance` - Get wallet balance
- `POST /fund` - Fund wallet
- `POST /withdraw` - Withdraw from wallet
- `GET /transactions` - Get wallet transactions

#### Service Routes (`/api/services`)
- `POST /airtime` - Purchase airtime
- `POST /data` - Purchase data bundle
- `POST /electricity` - Pay electricity bill
- `POST /tv` - Subscribe to cable TV
- `GET /providers` - Get service providers
- `GET /plans/:provider` - Get plans for provider
- `POST /validate` - Validate service details

#### Transaction Routes (`/api/transactions`)
- `GET /` - Get all transactions
- `GET /:id` - Get transaction by ID
- `GET /filter` - Filter transactions
- `POST /retry/:id` - Retry failed transaction

#### PIN Routes (`/api/pin`)
- `POST /create` - Create transaction PIN
- `POST /verify` - Verify PIN
- `PUT /change` - Change PIN
- `POST /reset` - Reset PIN

#### Beneficiary Routes (`/api/beneficiaries`)
- `GET /` - Get all beneficiaries
- `POST /` - Add beneficiary
- `PUT /:id` - Update beneficiary
- `DELETE /:id` - Delete beneficiary

#### Notification Routes (`/api/notifications`)
- `GET /` - Get all notifications
- `PUT /:id/read` - Mark as read
- `DELETE /:id` - Delete notification

#### Referral Routes (`/api/referrals`)
- `GET /` - Get referral data
- `GET /code` - Get referral code
- `POST /apply` - Apply referral code

#### Bank Account Routes (`/api/bank-accounts`)
- `GET /` - Get linked accounts
- `POST /` - Link bank account
- `DELETE /:id` - Remove bank account

### Middleware

#### Authentication Middleware
```javascript
// Protects routes requiring authentication
// Verifies JWT token from Authorization header
// Attaches user object to request
```

#### Validation Middleware
```javascript
// Validates request data using express-validator
// Returns 400 errors for invalid data
// Sanitizes inputs to prevent injection attacks
```

#### Error Handler
```javascript
// Centralized error handling
// Returns consistent error responses
// Logs errors for debugging
// Handles different error types
```

#### Rate Limiter
```javascript
// Limits requests per IP
// 100 requests per 15 minutes
// Prevents abuse and DDoS attacks
```

### Security Features

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Minimum password requirements
   - Password change requires old password

2. **JWT Authentication**
   - Secure token generation
   - Token expiration (24 hours)
   - Refresh token mechanism

3. **Transaction PIN**
   - 4-digit PIN for sensitive operations
   - Separate from login password
   - PIN verification before transactions

4. **Request Validation**
   - Input sanitization
   - Type checking
   - Range validation

5. **CORS Protection**
   - Whitelist frontend domain
   - Credentials support
   - Preflight handling

6. **Helmet Security Headers**
   - XSS protection
   - Content Security Policy
   - HSTS enforcement

---

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  pin: String (hashed, optional),
  referralCode: String (unique),
  referredBy: String (optional),
  isVerified: Boolean (default: false),
  kycStatus: String (enum: pending, verified, rejected),
  createdAt: Date,
  updatedAt: Date
}
```

### Wallet Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  balance: Number (default: 0),
  currency: String (default: NGN),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  walletId: ObjectId (ref: Wallet),
  type: String (enum: airtime, data, electricity, tv, funding, withdrawal),
  amount: Number (required),
  status: String (enum: pending, successful, failed),
  reference: String (unique),
  description: String,
  recipient: String,
  provider: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Beneficiary Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  serviceType: String (enum: airtime, data, electricity, tv),
  name: String (required),
  identifier: String (required), // Phone, meter, card number
  provider: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  type: String (enum: airtime, data, electricity, tv),
  provider: String (required),
  plans: Array,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String (required),
  message: String (required),
  type: String (enum: transaction, promo, system, security),
  isRead: Boolean (default: false),
  createdAt: Date
}
```

### Referral Model
```javascript
{
  _id: ObjectId,
  referrerId: ObjectId (ref: User),
  referredUserId: ObjectId (ref: User),
  status: String (enum: pending, completed),
  reward: Number,
  createdAt: Date
}
```

### BankAccount Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  bankName: String (required),
  accountNumber: String (required),
  accountName: String (required),
  isDefault: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Complete API Reference

#### Authentication

**Register User**
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "08012345678",
  "referralCode": "ABC123" (optional)
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {...},
    "token": "jwt_token_here"
  }
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {...},
    "token": "jwt_token_here"
  }
}
```

#### Wallet Operations

**Get Balance**
```
GET /api/wallet/balance
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "balance": 5000.00,
    "currency": "NGN"
  }
}
```

**Fund Wallet**
```
POST /api/wallet/fund
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "amount": 1000,
  "method": "card",
  "reference": "payment_ref_123"
}

Response (200):
{
  "success": true,
  "message": "Wallet funded successfully",
  "data": {
    "newBalance": 6000.00,
    "transaction": {...}
  }
}
```

#### Service Purchase

**Buy Airtime**
```
POST /api/services/airtime
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "network": "MTN",
  "amount": 100,
  "phone": "08012345678",
  "pin": "1234"
}

Response (200):
{
  "success": true,
  "message": "Airtime purchase successful",
  "data": {
    "transaction": {...},
    "newBalance": 5900.00
  }
}
```

**Buy Data**
```
POST /api/services/data
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "network": "MTN",
  "planId": "mtn_1gb_monthly",
  "phone": "08012345678",
  "pin": "1234"
}

Response (200):
{
  "success": true,
  "message": "Data purchase successful",
  "data": {...}
}
```

**Pay Electricity**
```
POST /api/services/electricity
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "disco": "IKEDC",
  "meterNumber": "1234567890",
  "amount": 5000,
  "meterType": "prepaid",
  "pin": "1234"
}

Response (200):
{
  "success": true,
  "message": "Electricity payment successful",
  "data": {
    "token": "electricity_token_here",
    "transaction": {...}
  }
}
```

**Subscribe Cable TV**
```
POST /api/services/tv
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "provider": "DSTV",
  "smartCardNumber": "1234567890",
  "package": "compact",
  "pin": "1234"
}

Response (200):
{
  "success": true,
  "message": "Subscription successful",
  "data": {...}
}
```

#### Transactions

**Get All Transactions**
```
GET /api/transactions?page=1&limit=20&type=airtime&status=successful
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 3
    }
  }
}
```

**Get Transaction Details**
```
GET /api/transactions/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "transaction": {...}
  }
}
```

---

## Security & Authentication

### Authentication Flow

1. **User Registration**
   - User submits registration form
   - Backend validates input data
   - Password is hashed using bcrypt
   - User record created in database
   - Wallet automatically created for user
   - JWT token generated and returned
   - User redirected to dashboard

2. **User Login**
   - User submits credentials
   - Backend validates email and password
   - Password compared with hashed version
   - JWT token generated with user ID
   - Token sent to frontend
   - Token stored in localStorage/sessionStorage
   - User redirected to dashboard

3. **Protected Route Access**
   - Frontend checks for valid token
   - Token sent in Authorization header
   - Backend middleware verifies token
   - User data attached to request
   - Route handler processes request

4. **Token Refresh**
   - Token expires after 24 hours
   - Frontend detects expired token
   - User prompted to login again
   - New token issued upon re-authentication

### Transaction Security

1. **PIN Verification**
   - User creates 4-digit PIN
   - PIN hashed and stored separately
   - All financial transactions require PIN
   - PIN verified before processing
   - Failed attempts tracked and limited

2. **Amount Validation**
   - Minimum and maximum limits enforced
   - Balance check before transaction
   - Duplicate transaction prevention
   - Transaction timeout handling

### Data Protection

1. **Encryption**
   - Passwords hashed with bcrypt (10 rounds)
   - PINs hashed separately
   - Sensitive data encrypted at rest
   - HTTPS for data in transit

2. **Input Validation**
   - All inputs sanitized
   - SQL injection prevention
   - XSS attack prevention
   - CSRF token implementation (recommended)

3. **Rate Limiting**
   - API rate limits per IP
   - Login attempt limiting
   - Transaction frequency limits
   - Prevents brute force attacks

---

## Deployment & Hosting

### Current Deployment

**Platform:** Vercel  
**URL:** https://zepayra.vercel.app/  
**Repository:** https://github.com/Kboy2000/Zepayra.git  
**Branch:** main

### Deployment Configuration

**vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "backend/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### Environment Variables

#### Frontend (.env)
```
VITE_API_URL=https://zepayra.vercel.app/api
VITE_APP_NAME=ZEPAYRA
```

#### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=24h
FRONTEND_URL=https://zepayra.vercel.app
VTPASS_API_KEY=your_vtpass_key
VTPASS_PUBLIC_KEY=your_vtpass_public_key
PAYSTACK_SECRET_KEY=your_paystack_key
```

### Database Hosting

**Recommended:** MongoDB Atlas  
**Connection:** Mongoose ODM  
**Backup:** Automated daily backups  
**Scaling:** Auto-scaling enabled

### CI/CD Pipeline

1. **Code Push to GitHub**
2. **Vercel Auto-Deploy Triggered**
3. **Build Process:**
   - Install dependencies
   - Run linting (optional)
   - Build frontend (Vite)
   - Prepare backend
4. **Deploy to Production**
5. **Health Check Verification**

### Monitoring & Logging

- **Vercel Analytics:** Page views, performance
- **Error Tracking:** Console logs, error boundaries
- **API Monitoring:** Response times, error rates
- **Database Monitoring:** Query performance, connections

---

## User Guide

### Getting Started

#### 1. Registration
1. Visit https://zepayra.vercel.app/
2. Click "Register" or "Sign Up"
3. Fill in your details:
   - First Name
   - Last Name
   - Email Address
   - Phone Number
   - Password (minimum 8 characters)
   - Referral Code (optional)
4. Click "Create Account"
5. You'll be automatically logged in

#### 2. Setting Up Your Account
1. **Create Transaction PIN:**
   - Go to Security Settings
   - Click "Create PIN"
   - Enter 4-digit PIN
   - Confirm PIN
   - Save

2. **Fund Your Wallet:**
   - Click "Fund Wallet" from dashboard
   - Select payment method
   - Enter amount
   - Complete payment
   - Wallet credited instantly

#### 3. Making Your First Purchase

**Buying Airtime:**
1. Click "Airtime" from dashboard or menu
2. Select network (MTN, Airtel, Glo, 9mobile)
3. Enter phone number
4. Enter amount or select preset
5. Enter transaction PIN
6. Confirm purchase
7. Receive confirmation

**Buying Data:**
1. Click "Data" from services
2. Select network provider
3. Choose data plan
4. Enter phone number
5. Enter PIN and confirm
6. Data activated instantly

**Paying Electricity Bill:**
1. Click "Electricity"
2. Select your DISCO
3. Enter meter number
4. Select meter type (Prepaid/Postpaid)
5. Enter amount
6. Enter PIN and pay
7. Receive token via SMS/email

**Subscribing to Cable TV:**
1. Click "Cable TV"
2. Select provider (DSTV, GOtv, Startimes)
3. Enter smart card number
4. Choose subscription package
5. Enter PIN and confirm
6. Subscription activated

### Managing Beneficiaries

1. **Add Beneficiary:**
   - During any transaction, check "Save as beneficiary"
   - Or go to Beneficiaries page
   - Click "Add New"
   - Fill in details
   - Save

2. **Use Saved Beneficiary:**
   - On any service page
   - Click "Saved Beneficiaries"
   - Select beneficiary
   - Details auto-filled
   - Proceed with transaction

3. **Edit/Delete Beneficiary:**
   - Go to Beneficiaries page
   - Click on beneficiary
   - Edit details or delete

### Viewing Transactions

1. **Transaction History:**
   - Click "Transactions" from menu
   - View all transactions
   - Filter by date, type, status
   - Search by reference

2. **Transaction Details:**
   - Click any transaction
   - View complete details
   - Download receipt
   - Contact support if needed

### Withdrawing Funds

1. **Link Bank Account:**
   - Go to Account Settings
   - Click "Bank Accounts"
   - Add account details
   - Verify account

2. **Withdraw:**
   - Click "Withdraw"
   - Select bank account
   - Enter amount
   - Enter PIN
   - Confirm withdrawal
   - Funds sent to account

### Referral Program

1. **Get Your Code:**
   - Go to Referrals page
   - Copy your unique code
   - Share with friends

2. **Track Referrals:**
   - View referral dashboard
   - See total referrals
   - Check earnings
   - Withdraw referral bonus

---

## Development Workflow

### Local Development Setup

#### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev

# Access at http://localhost:5173
```

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with required variables
# (See Environment Variables section)

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Development Commands

#### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Code Standards

#### JavaScript/React
- ES6+ syntax
- Functional components with hooks
- PropTypes for type checking
- Consistent naming conventions
- Component-based architecture

#### CSS
- BEM methodology
- CSS variables for theming
- Mobile-first responsive design
- Consistent spacing and sizing

#### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push to GitHub
git push origin feature/feature-name

# Create pull request
# Merge after review
```

### Testing Strategy

#### Frontend Testing
- Component unit tests
- Integration tests
- E2E tests with Cypress (recommended)
- Visual regression testing

#### Backend Testing
- Unit tests for controllers
- Integration tests for routes
- Database tests
- API endpoint tests

---

## Future Enhancements

### Phase 1: Core Improvements
- [ ] Email verification system
- [ ] SMS notifications
- [ ] Transaction receipts (PDF)
- [ ] Export transaction history
- [ ] Advanced filtering and search
- [ ] Dark mode theme
- [ ] Multi-language support

### Phase 2: Advanced Features
- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication
- [ ] KYC verification system
- [ ] Virtual card issuance
- [ ] Bill splitting feature
- [ ] Scheduled payments
- [ ] Auto-renewal for subscriptions

### Phase 3: Business Features
- [ ] Merchant accounts
- [ ] Payment links
- [ ] QR code payments
- [ ] POS integration
- [ ] Business analytics
- [ ] Invoice generation
- [ ] Multi-user accounts

### Phase 4: Platform Expansion
- [ ] Mobile apps (iOS & Android)
- [ ] USSD integration
- [ ] WhatsApp bot
- [ ] API for third-party integration
- [ ] Cryptocurrency support
- [ ] International transfers
- [ ] Investment products

### Technical Improvements
- [ ] GraphQL API
- [ ] Real-time notifications (WebSocket)
- [ ] Redis caching
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced monitoring (Datadog, Sentry)
- [ ] Performance optimization
- [ ] Load balancing

---

## Appendix

### Glossary

- **DISCO:** Distribution Company (Electricity)
- **JWT:** JSON Web Token
- **KYC:** Know Your Customer
- **PIN:** Personal Identification Number
- **USSD:** Unstructured Supplementary Service Data
- **VTPass:** Nigerian bill payment API provider

### Support Contacts

- **Email:** support@zepayra.com
- **Phone:** +234-XXX-XXXX-XXX
- **GitHub Issues:** https://github.com/Kboy2000/Zepayra/issues

### License

MIT License - See LICENSE file for details

### Acknowledgments

- VTPass API for bill payment services
- Paystack for payment processing
- MongoDB Atlas for database hosting
- Vercel for application hosting

---

**Document Version:** 1.0.0  
**Last Updated:** January 29, 2026  
**Prepared By:** ZEPAYRA Development Team

---

*This documentation is comprehensive and ready for PDF conversion. For updates or corrections, please contact the development team.*
