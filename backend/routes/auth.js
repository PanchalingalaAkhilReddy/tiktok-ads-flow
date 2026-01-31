const express = require('express');
const axios = require('axios');
const router = express.Router();

// Generate random user ID
const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};

// STEP 1: Initiate OAuth - Redirect to TikTok
router.get('/tiktok', (req, res) => {
  const appId = process.env.TIKTOK_APP_ID;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  const userSessions = global.userSessions;
  
  // Check if TikTok credentials are configured
  if (!appId || appId === 'your_app_id_here') {
    console.log('⚠️ TikTok credentials not configured yet - using mock flow');
    
    // Mock OAuth flow for development
    const mockUserId = generateUserId();
    const mockToken = 'mock_token_' + Date.now();
    const mockUser = {
      id: mockUserId,
      name: 'Test User',
      email: 'test@example.com'
    };
    
    // Store in session
    userSessions.set(mockUserId, {
      userId: mockUserId,
      accessToken: mockToken,
      user: mockUser,
      createdAt: Date.now()
    });
    
    // Redirect back to frontend with mock user ID
    return res.redirect(`${process.env.FRONTEND_URL}?auth=success&userId=${mockUserId}`);
  }
  
  // Real TikTok OAuth URL (when credentials are available)
  const tiktokAuthUrl = `https://ads.tiktok.com/marketing_api/auth?` +
    `app_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=random_state_string`;
  
  console.log('🔗 Redirecting to TikTok OAuth:', tiktokAuthUrl);
  res.redirect(tiktokAuthUrl);
});

// STEP 2: OAuth Callback - Exchange code for token
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const userSessions = global.userSessions;
  
  console.log('📥 OAuth callback received');
  
  // Check if TikTok credentials are configured
  if (!process.env.TIKTOK_APP_ID || process.env.TIKTOK_APP_ID === 'your_app_id_here') {
    console.log('⚠️ Using mock OAuth callback');
    
    const mockUserId = generateUserId();
    const mockToken = 'mock_token_' + Date.now();
    const mockUser = {
      id: mockUserId,
      name: 'Test User',
      email: 'test@example.com'
    };
    
    userSessions.set(mockUserId, {
      userId: mockUserId,
      accessToken: mockToken,
      user: mockUser,
      createdAt: Date.now()
    });
    
    return res.redirect(`${process.env.FRONTEND_URL}?auth=success&userId=${mockUserId}`);
  }
  
  try {
    // Real token exchange with TikTok
    const tokenResponse = await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/',
      {
        app_id: process.env.TIKTOK_APP_ID,
        secret: process.env.TIKTOK_APP_SECRET,
        auth_code: code
      }
    );
    
    const { access_token, advertiser_ids } = tokenResponse.data.data;
    const userId = generateUserId();
    
    // Store session
    userSessions.set(userId, {
      userId,
      accessToken: access_token,
      advertiserIds: advertiser_ids,
      createdAt: Date.now()
    });
    
    console.log('✅ OAuth successful! User ID:', userId);
    
    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}?auth=success&userId=${userId}`);
    
  } catch (error) {
    console.error('❌ OAuth error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}?auth=error&message=${encodeURIComponent(error.message)}`);
  }
});

// Get current user info
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userSessions = global.userSessions;
  const session = userSessions.get(userId);
  
  if (!session) {
    return res.status(401).json({ 
      success: false, 
      error: 'Session not found. Please reconnect.' 
    });
  }
  
  res.json({
    success: true,
    user: session.user || { 
      id: session.userId, 
      name: 'Test User' 
    }
  });
});

// Disconnect/Logout
router.post('/disconnect', (req, res) => {
  const { userId } = req.body;
  const userSessions = global.userSessions;
  
  if (userId && userSessions.has(userId)) {
    userSessions.delete(userId);
    console.log('👋 User disconnected:', userId);
  }
  
  res.json({ success: true, message: 'Disconnected successfully' });
});

module.exports = router;