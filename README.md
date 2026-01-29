# ZEPAYRA - Fintech Application

🚀 **Live Site:** https://zepayra.vercel.app/

## Important Setup Instructions

### For Vercel Deployment

**CRITICAL:** You must add these environment variables in your Vercel dashboard:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select the `Zepayra` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
FRONTEND_URL=https://zepayra.vercel.app
NODE_ENV=production
```

### Getting MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you don't have one)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `zepayra`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/zepayra?retryWrites=true&w=majority
```

### Generating JWT Secret

Run this in your terminal to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET` in Vercel.

## Recent Fixes (January 29, 2026)

✅ **Fixed authentication issues:**
- Corrected Vercel backend entry point from `index.js` to `server.js`
- Added production environment configuration
- Updated server.js for Vercel serverless compatibility
- Enabled CORS for all origins
- Added health check endpoints

✅ **Form improvements:**
- Login and Register forms already have proper labels
- All input fields clearly labeled above the input boxes
- Password visibility toggle included

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Access at: http://localhost:5173

### Backend
```bash
cd backend
npm install

# Create .env file with:
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# JWT_EXPIRE=24h
# FRONTEND_URL=http://localhost:5173
# NODE_ENV=development

npm run dev
```
Access at: http://localhost:5000

## Features

- ✅ User Authentication (Register/Login)
- ✅ Digital Wallet Management
- ✅ Airtime Purchase (MTN, Airtel, Glo, 9mobile)
- ✅ Data Bundle Purchase
- ✅ Electricity Bill Payment
- ✅ Cable TV Subscription
- ✅ Transaction History
- ✅ Beneficiary Management
- ✅ Referral System
- ✅ User Profile & Settings

## Tech Stack

**Frontend:**
- React 19.2.0
- Vite 7.2.4
- React Router DOM 7.11.0
- Axios

**Backend:**
- Node.js
- Express 4.18.2
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

**Deployment:**
- Vercel (Frontend & Backend)
- MongoDB Atlas (Database)

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT
