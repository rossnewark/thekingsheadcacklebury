const axios = require('axios');
const { getStore } = require('@netlify/blobs');

// Configuration - get values from environment variables without fallbacks
const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const DEFAULT_TOKEN = process.env.FACEBOOK_LONG_LIVED_TOKEN;

// Token store using Netlify's KV store
const STORE_NAME = 'facebook-tokens';
const TOKEN_KEY = 'access-token';

// Helper function to read the current token from KV store
async function getStoredToken() {
  try {
    const store = getStore(STORE_NAME);
    const data = await store.get(TOKEN_KEY);
    
    if (data) {
      return JSON.parse(data);
    }
    
    // No token in store, use the environment variable and store it
    const initialToken = {
      token: DEFAULT_TOKEN,
      refreshed: null
    };
    
    await store.set(TOKEN_KEY, JSON.stringify(initialToken));
    return initialToken;
  } catch (error) {
    console.error('Error reading token from KV store:', error);
    return { token: DEFAULT_TOKEN, refreshed: null };
  }
}

// Helper function to write token to KV store
async function saveToken(tokenData) {
  try {
    const store = getStore(STORE_NAME);
    await store.set(TOKEN_KEY, JSON.stringify(tokenData));
    return true;
  } catch (error) {
    console.error('Error writing token to KV store:', error);
    return false;
  }
}

// Refresh token through Facebook API
async function refreshToken(token) {
  // Validate we have the necessary credentials
  if (!APP_ID || !APP_SECRET) {
    throw new Error('Missing required Facebook app credentials');
  }

  try {
    console.log('Attempting to refresh Facebook token...');
    const response = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: APP_ID,
        client_secret: APP_SECRET,
        fb_exchange_token: token
      }
    });
    
    if (response.data && response.data.access_token) {
      console.log('Token refreshed successfully');
      return response.data.access_token;
    }
    throw new Error('No access token in response');
  } catch (error) {
    console.error('Error refreshing token:', 
      error.response ? JSON.stringify(error.response.data) : error.message);
    throw error;
  }
}

// Check if token needs refreshing (refresh 7 days before expiration)
function needsRefresh(lastRefreshed) {
  if (!lastRefreshed) return true;
  
  const refreshDate = new Date(lastRefreshed);
  const now = new Date();
  const daysSinceRefresh = (now - refreshDate) / (1000 * 60 * 60 * 24);
  
  // Facebook long-lived tokens last about 60 days, refresh after 53 days
  return daysSinceRefresh > 53;
}

// Get current token, refreshing if needed
async function getCurrentToken() {
  try {
    // Read current token data
    const tokenData = await getStoredToken();
    const currentToken = tokenData.token;
    
    // Check if we have a token
    if (!currentToken) {
      throw new Error('No Facebook token available');
    }
    
    // Check if token needs refreshing
    if (needsRefresh(tokenData.refreshed)) {
      try {
        const newToken = await refreshToken(currentToken);
        const newTokenData = {
          token: newToken,
          refreshed: new Date().toISOString()
        };
        
        // Save new token data
        await saveToken(newTokenData);
        return { token: newToken, isNew: true };
      } catch (refreshError) {
        console.warn('Failed to refresh token, using existing token:', refreshError.message);
        return { token: currentToken, isNew: false, error: refreshError.message };
      }
    }
    
    return { token: currentToken, isNew: false };
  } catch (error) {
    console.error('Error getting current token:', error);
    return { token: DEFAULT_TOKEN, isNew: false, error: error.message };
  }
}

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    const result = await getCurrentToken();
    
    // Only return the token status, not the actual token for security
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        refreshed: result.isNew,
        message: result.isNew 
          ? 'Token was refreshed successfully' 
          : 'Token is valid and up to date',
        error: result.error || null
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to manage token',
        error: error.message
      })
    };
  }
};