// API Service - Connects React Frontend to Backend

const API_BASE_URL = 'http://localhost:5000/api';

// Store userId in memory
let currentUserId = null;

export const setUserId = (userId) => {
  currentUserId = userId;
  console.log('User ID stored:', userId);
};

export const getUserId = () => {
  return currentUserId;
};

export const clearUserId = () => {
  currentUserId = null;
};

// Connect to TikTok - Initiates OAuth flow
export const connectTikTok = () => {
  console.log('🔗 Redirecting to backend OAuth...');
  // Redirect to backend which will handle OAuth
  window.location.href = `${API_BASE_URL}/auth/tiktok`;
};

// Get user information
export const getUserInfo = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`);
    const data = await response.json();
    
    if (!data.success) {
      console.error('Failed to get user info:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return { 
      success: false, 
      error: 'Failed to connect to server. Make sure backend is running.' 
    };
  }
};

// Disconnect from TikTok
export const disconnectTikTok = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      clearUserId();
      console.log('✅ Disconnected successfully');
    }
    
    return data;
  } catch (error) {
    console.error('Error disconnecting:', error);
    return { 
      success: false, 
      error: 'Failed to disconnect' 
    };
  }
};

// Validate Music ID
export const validateMusicId = async (musicId, userId) => {
  try {
    console.log('🎵 Validating music ID:', musicId);
    
    const response = await fetch(`${API_BASE_URL}/ads/validate-music`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ musicId, userId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Music ID is valid');
    } else {
      console.log('❌ Music ID validation failed:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error validating music:', error);
    return { 
      success: false, 
      error: 'Failed to validate music. Please try again.' 
    };
  }
};

// Create Ad
export const createAd = async (adData, userId) => {
  try {
    console.log('📝 Creating ad with data:', adData);
    
    const response = await fetch(`${API_BASE_URL}/ads/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...adData,
        userId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Ad created successfully! Ad ID:', data.adId);
    } else {
      console.log('❌ Ad creation failed:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating ad:', error);
    return { 
      success: false, 
      error: 'Failed to create ad. Please try again.' 
    };
  }
};

// Check if backend is running
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    const data = await response.json();
    console.log(' Backend health check:', data);
    return data;
  } catch (error) {
    console.error(' Backend is not running!', error);
    return { success: false, error: 'Backend server is not running' };
  }
};