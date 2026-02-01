const API_BASE_URL = 'http://localhost:5000/api';

export const getUserInfo = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user info');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const disconnectAccount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/disconnect`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to disconnect');
    return await response.json();
  } catch (error) {
    console.error('Error disconnecting:', error);
    throw error;
  }
};

export const validateMusic = async (musicUrl) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ads/validate-music`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ musicUrl }),
    });
    if (!response.ok) throw new Error('Failed to validate music');
    return await response.json();
  } catch (error) {
    console.error('Error validating music:', error);
    throw error;
  }
};

export const createAd = async (adData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ads/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adData),
    });
    if (!response.ok) throw new Error('Failed to create ad');
    return await response.json();
  } catch (error) {
    console.error('Error creating ad:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    if (!response.ok) throw new Error('Backend not responding');
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// User ID management (localStorage)
export const setUserId = (userId) => {
  localStorage.setItem('tiktok_user_id', userId);
};

export const getUserId = () => {
  return localStorage.getItem('tiktok_user_id');
};

export const clearUserId = () => {
  localStorage.removeItem('tiktok_user_id');
};

// TikTok OAuth
export const connectTikTok = () => {
  window.location.href = 'http://localhost:5000/api/auth/tiktok';
};

export const disconnectTikTok = async () => {
  await disconnectAccount();
  clearUserId();
};

// Music validation
export const validateMusicId = async (musicId) => {
  return await validateMusic(musicId);
};