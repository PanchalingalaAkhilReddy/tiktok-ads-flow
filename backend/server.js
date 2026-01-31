const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// In-memory storage for tokens (in production, use database)
const userSessions = new Map();

// Routes
const authRoutes = require('./routes/auth');
const adsRoutes = require('./routes/ads');

app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to handle OAuth and API requests`);
});

// Export userSessions for use in routes
module.exports = { userSessions };