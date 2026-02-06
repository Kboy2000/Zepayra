# ZEPAYRA Backend

Next-generation Nigerian fintech backend API with VTpass integration.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- VTpass sandbox account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

3. Start MongoDB (if running locally):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # MongoDB models
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── .env                 # Environment variables (DO NOT COMMIT)
├── .env.example         # Environment template
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Wallet
- `GET /api/wallet/balance` - Get wallet balance (protected)
- `POST /api/wallet/credit` - Credit wallet manually (protected)
- `GET /api/wallet/history` - Get transaction history (protected)

### Services
- `GET /api/services` - Get all services (protected)
- `GET /api/services/:serviceId/variations` - Get service variations (protected)
- `POST /api/services/airtime` - Purchase airtime (protected)
- `POST /api/services/data` - Purchase data (protected)
- `POST /api/services/electricity` - Pay electricity (protected)
- `POST /api/services/tv` - Subscribe to cable TV (protected)

### Transactions
- `GET /api/transactions` - Get all transactions (protected)
- `GET /api/transactions/stats` - Get transaction statistics (protected)
- `GET /api/transactions/:id` - Get transaction details (protected)
- `POST /api/transactions/:id/requery` - Requery pending transaction (protected)

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet.js security headers
- CORS protection
- Input validation
- MongoDB injection prevention

## 🧪 Testing

Test the API health:
```bash
curl http://localhost:5000/health
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🛠️ Development

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **axios** - HTTP client for VTpass
- **helmet** - Security headers
- **cors** - CORS middleware
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

## 🌟 Features

- ✅ User authentication & authorization
- ✅ Wallet management
- ✅ VTpass API integration
- ✅ Airtime purchase
- ✅ Data bundle purchase
- ✅ Electricity bill payment
- ✅ Cable TV subscription
- ✅ Transaction history
- ✅ Automatic refunds on failure
- ✅ Transaction requery
- ✅ Nigerian phone number validation
- ✅ Network provider detection

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for the Nigerian market**
