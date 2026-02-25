# Zepayra Documentation

🚀 **Frontend:** [https://zepayra-frontend.onrender.com](https://zepayra-frontend.onrender.com)  
🚀 **Backend:** [https://zepayra-backend.onrender.com](https://zepayra-backend.onrender.com)  
📦 **Repository:** https://github.com/Kboy2000/Zepayra.git

## Quick Start - Deploy to Render

This project is designed to deploy to **Render** with **zero code changes**. Perfect for your Vite + Express + MongoDB stack!

### Why Render?

✅ No code changes needed - Express works as-is  
✅ Free tier available  
✅ Easy MongoDB integration  
✅ Automatic GitHub deployments  

### Deployment Steps

**See the complete deployment guide:** [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

**Quick Summary:**

1. **Set up MongoDB Atlas** (free) - Get connection string
2. **Deploy Backend** to Render as Web Service
3. **Deploy Frontend** to Render as Static Site
4. **Configure environment variables**
5. **Test your app!**

Total time: ~20 minutes

## Project Structure

```
ZEPAYRA/
├── frontend/          # Vite + React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
│
├── backend/           # Express + MongoDB API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
│
├── .env.example       # Environment variables template
└── render.yaml        # Render configuration
```

## Features

- ✅ User Authentication (Register/Login)
- ✅ Digital Wallet Management
- ✅ Airtime Purchase (MTN, Airtel, Glo, 9mobile)
- ✅ Data Bundle Purchase
- ✅ Electricity Bill Payment (IKEDC, EKEDC)
- ✅ Cable TV Subscription (DSTV, GOtv, Startimes)
- ✅ Transaction History & Details
- ✅ Beneficiary Management
- ✅ Referral System
- ✅ User Profile & Settings
- ✅ Security (Transaction PIN)

## Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.11.0
- **HTTP Client:** Axios 1.13.2
- **Styling:** Custom CSS

### Backend
- **Runtime:** Node.js
- **Framework:** Express 4.18.2
- **Database:** MongoDB + Mongoose 8.0.3
- **Authentication:** JWT + bcryptjs
- **Security:** Helmet, CORS, Rate Limiting

### Deployment
- **Platform:** Render
- **Database:** MongoDB Atlas
- **CI/CD:** Automatic from GitHub

## Local Development

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp ../.env.example .env

# Add your environment variables:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# JWT_EXPIRE=24h
# FRONTEND_URL=http://localhost:5173
# NODE_ENV=development

npm run dev
```

Backend runs on: http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

npm run dev
```

Frontend runs on: http://localhost:5173

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_64_char_hex_string
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## API Documentation

### Base URL
- **Local:** http://localhost:5000/api
- **Production:** https://your-backend.onrender.com/api

### Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/fund` - Fund wallet
- `POST /api/wallet/withdraw` - Withdraw funds

#### Services
- `POST /api/services/airtime` - Buy airtime
- `POST /api/services/data` - Buy data
- `POST /api/services/electricity` - Pay electricity
- `POST /api/services/tv` - Subscribe to cable TV

#### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction details

See [DOCUMENTATION.md](./DOCUMENTATION.md) for complete API reference.

## Assignment Requirements

This project fulfills all requirements:

✅ **UI:** Built with Vite + React  
✅ **Backend:** Built with Express.js  
✅ **Database:** MongoDB (via Mongoose)  
✅ **Features:** Full fintech functionality  
✅ **Deployment:** Ready for production (Render)  
✅ **Documentation:** Complete API and deployment docs

## Support

For issues or questions:
- Check [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for deployment help
- Check [DOCUMENTATION.md](./DOCUMENTATION.md) for technical details
- Open an issue on GitHub

## License

MIT

---

**Made with ❤️ for fintech innovation in Nigeria**
