# ZEPAYRA Render Deployment Guide

## Why Render?

✅ **No code changes needed** - Your Express backend works as-is  
✅ **Free tier available** - Perfect for your assignment  
✅ **Easy setup** - Deploy in minutes  
✅ **Automatic deployments** - From GitHub  
✅ **Perfect for your stack** - Vite + Express + MongoDB

---

## Prerequisites

1. GitHub account (you already have this)
2. Render account (free) - Sign up at https://render.com
3. MongoDB Atlas account (free) - https://www.mongodb.com/cloud/atlas

---

## Step 1: Set Up MongoDB (5 minutes)

### 1.1 Create MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** and sign up/login
3. Create a **FREE M0 cluster**
4. Choose **AWS** as provider, closest region to you
5. Click **"Create Cluster"**

### 1.2 Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `zepayra_user`
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 1.3 Whitelist All IPs

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. IP Address: `0.0.0.0/0`
5. Click **"Confirm"**

### 1.4 Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `zepayra`

**Example:**
```
mongodb+srv://zepayra_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/zepayra?retryWrites=true&w=majority
```

**Save this connection string** - you'll need it later!

---

## Step 2: Deploy Backend to Render (10 minutes)

### 2.1 Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest)
4. Authorize Render to access your repositories

### 2.2 Create Web Service for Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your **Zepayra** repository
3. Click **"Connect"** next to it

### 2.3 Configure Backend Service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `zepayra-backend` |
| **Region** | Choose closest to you |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 2.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string from Step 1.4 |
| `JWT_SECRET` | Run in terminal: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRE` | `24h` |
| `FRONTEND_URL` | Leave blank for now (we'll update later) |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

### 2.5 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (~3-5 minutes)
3. Once deployed, you'll see a URL like: `https://zepayra-backend.onrender.com`
4. **Copy this URL** - you'll need it!

### 2.6 Test Backend

Visit: `https://zepayra-backend.onrender.com/health`

You should see:
```json
{
  "success": true,
  "message": "ZEPAYRA API is running",
  "timestamp": "..."
}
```

✅ If you see this, backend is working!

---

## Step 3: Deploy Frontend to Render (5 minutes)

### 3.1 Create Static Site for Frontend

1. Click **"New +"** → **"Static Site"**
2. Select your **Zepayra** repository
3. Click **"Connect"**

### 3.2 Configure Frontend Service

| Field | Value |
|-------|-------|
| **Name** | `zepayra-frontend` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 3.3 Add Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://zepayra-backend.onrender.com/api` (use your backend URL from Step 2.5) |

### 3.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (~2-3 minutes)
3. Once deployed, you'll get a URL like: `https://zepayra-frontend.onrender.com`

---

## Step 4: Update Backend CORS (2 minutes)

Now we need to update the backend to allow requests from the frontend.

### 4.1 Update Backend Environment Variable

1. Go to your **zepayra-backend** service in Render
2. Click **"Environment"** tab
3. Find `FRONTEND_URL` variable
4. Update value to: `https://zepayra-frontend.onrender.com` (your frontend URL)
5. Click **"Save Changes"**
6. Backend will automatically redeploy

---

## Step 5: Test Your Application! 🎉

### 5.1 Open Your App

Go to: `https://zepayra-frontend.onrender.com`

### 5.2 Create Account

1. Click **"Sign Up"** or **"Register"**
2. Fill in the form:
   - **First Name:** Your name
   - **Last Name:** Your last name
   - **Email Address:** Your email
   - **Phone Number:** Nigerian format (e.g., `08012345678`)
   - **Password:** At least 6 characters
   - **Confirm Password:** Same password
3. Click **"Create Account"**

✅ You should be redirected to the dashboard!

### 5.3 Test Login

1. Logout (if logged in)
2. Click **"Sign In"**
3. Enter your email and password
4. Click **"Sign In"**

✅ You should be logged in and see the dashboard!

---

## Important Notes

### Free Tier Limitations

- **Backend:** May sleep after 15 minutes of inactivity
- **First request after sleep:** Takes 30-60 seconds to wake up
- **Solution:** Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 10 minutes

### Custom Domain (Optional)

You can add a custom domain in Render:
1. Go to your service → **Settings** → **Custom Domain**
2. Add your domain and follow DNS instructions

---

## Troubleshooting

### Backend Returns 500 Error

**Check:**
1. MongoDB connection string is correct
2. MongoDB IP whitelist includes `0.0.0.0/0`
3. All environment variables are set
4. Check Render logs: Service → **Logs** tab

### Frontend Can't Connect to Backend

**Check:**
1. `VITE_API_URL` is set correctly
2. Backend URL is accessible
3. CORS is configured (FRONTEND_URL set in backend)

### Authentication Fails

**Check:**
1. MongoDB is connected (check backend logs)
2. JWT_SECRET is set
3. All required environment variables are present

---

## Your Deployment URLs

After completing all steps, save these URLs:

- **Frontend:** `https://zepayra-frontend.onrender.com`
- **Backend:** `https://zepayra-backend.onrender.com`
- **API Health Check:** `https://zepayra-backend.onrender.com/health`

---

## Summary

✅ **No code changes needed**  
✅ **Free hosting**  
✅ **Automatic deployments from GitHub**  
✅ **Perfect for your Vite + Express + MongoDB stack**  
✅ **Production-ready**

Your assignment requirements are fully met:
- ✅ UI using Vite React
- ✅ Backend using Express
- ✅ Database as MongoDB
