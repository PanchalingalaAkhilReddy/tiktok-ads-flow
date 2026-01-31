const express = require('express');
const axios = require('axios');
const router = express.Router();

// Validate Music ID
router.post('/validate-music', async (req, res) => {
  const { musicId, userId } = req.body;
  const userSessions = global.userSessions;
  
  console.log('🎵 Validating music ID:', musicId);
  
  // Check session
  const session = userSessions.get(userId);
  if (!session) {
    return res.status(401).json({ 
      success: false, 
      error: 'Please reconnect your TikTok account' 
    });
  }
  
  // Check if real TikTok credentials configured
  if (!process.env.TIKTOK_APP_ID || process.env.TIKTOK_APP_ID === 'your_app_id_here') {
    // Mock validation
    console.log('⚠️ Using mock music validation');
    
    // Simple validation: music ID should start with a digit
    const isValid = /^\d/.test(musicId);
    
    if (isValid) {
      return res.json({ 
        success: true, 
        musicId,
        message: 'Music ID validated successfully' 
      });
    } else {
      return res.json({ 
        success: false, 
        error: 'Invalid Music ID. Please check and try again.' 
      });
    }
  }
  
  try {
    // Real TikTok Music validation API call
    const response = await axios.get(
      `https://business-api.tiktok.com/open_api/v1.3/music/info/`,
      {
        params: { music_id: musicId },
        headers: { 'Access-Token': session.accessToken }
      }
    );
    
    res.json({ 
      success: true, 
      musicId,
      data: response.data 
    });
    
  } catch (error) {
    console.error('❌ Music validation error:', error.response?.data || error.message);
    res.json({ 
      success: false, 
      error: 'Music ID not found in TikTok library. Please check and try again.' 
    });
  }
});

// Create Ad
router.post('/create', async (req, res) => {
  const { 
    userId, 
    campaignName, 
    objective, 
    adText, 
    cta, 
    musicOption, 
    musicId 
  } = req.body;
  
  const userSessions = global.userSessions;
  
  console.log('📝 Creating ad:', { campaignName, objective, musicOption });
  
  // Check session
  const session = userSessions.get(userId);
  if (!session) {
    return res.status(401).json({ 
      success: false, 
      error: 'Session expired. Please reconnect your TikTok account.' 
    });
  }
  
  // Check if real TikTok credentials configured
  if (!process.env.TIKTOK_APP_ID || process.env.TIKTOK_APP_ID === 'your_app_id_here') {
    // Mock ad creation
    console.log('⚠️ Using mock ad creation');
    
    // Simulate random failure (10% chance) to show error handling
    if (Math.random() < 0.1) {
      return res.json({
        success: false,
        error: 'Failed to create ad. Your session may have expired. Please try reconnecting.'
      });
    }
    
    // Success
    const adId = 'ad_' + Date.now();
    console.log('✅ Ad created successfully (mock):', adId);
    
    return res.json({
      success: true,
      adId,
      message: 'Ad created successfully!',
      data: {
        campaignName,
        objective,
        adText,
        cta,
        musicOption,
        musicId
      }
    });
  }
  
  try {
    // Real TikTok Ad creation API call
    const response = await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/ad/create/',
      {
        advertiser_id: session.advertiserIds[0],
        campaign_name: campaignName,
        objective_type: objective === 'Traffic' ? 'TRAFFIC' : 'CONVERSIONS',
        ad_text: adText,
        call_to_action: cta,
        music_id: musicId || undefined
      },
      {
        headers: { 'Access-Token': session.accessToken }
      }
    );
    
    console.log('✅ Ad created successfully:', response.data);
    
    res.json({
      success: true,
      adId: response.data.data.ad_id,
      message: 'Ad created successfully!',
      data: response.data.data
    });
    
  } catch (error) {
    console.error('❌ Ad creation error:', error.response?.data || error.message);
    
    // Handle specific errors
    if (error.response?.status === 401) {
      return res.json({
        success: false,
        error: 'Your session has expired. Please reconnect your TikTok account.'
      });
    }
    
    res.json({
      success: false,
      error: error.response?.data?.message || 'Failed to create ad. Please try again.'
    });
  }
});

module.exports = router;