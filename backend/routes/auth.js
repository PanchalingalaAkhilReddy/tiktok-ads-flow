const express = require('express');
const router = express.Router();

// Mock OAuth flow
router.get('/tiktok', (req, res) => {
  // Simulate successful OAuth
  const mockUserId = 'demo_user_' + Date.now();
  
  // Store mock session
  global.userSessions.set(mockUserId, {
    accessToken: 'mock_access_token',
    advertiserIds: ['mock_advertiser_123']
  });
  
  return res.redirect(`${process.env.FRONTEND_URL}?auth=success&userId=${mockUserId}`);
});

// Mock callback (in case it's called)
router.get('/callback', async (req, res) => {
  const mockUserId = 'demo_user_' + Date.now();
  
  // Store mock session
  global.userSessions.set(mockUserId, {
    accessToken: 'mock_access_token',
    advertiserIds: ['mock_advertiser_123']
  });
  
  return res.redirect(`${process.env.FRONTEND_URL}?auth=success&userId=${mockUserId}`);
});

// Get user info
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Check if user session exists
  const session = global.userSessions.get(userId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  // Return mock user info
  res.json({
    success: true,
    user: {
      id: userId,
      name: 'Demo User',
      username: '@demouser'
    }
  });
});

// Disconnect account
router.post('/disconnect', (req, res) => {
  res.json({
    success: true,
    message: 'Account disconnected successfully'
  });
});

module.exports = router;