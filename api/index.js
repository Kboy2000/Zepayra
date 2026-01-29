const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/database');

// Connect to database
let dbConnected = false;

module.exports = async (req, res) => {
  try {
    // Connect to database if not already connected
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }

    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
};
