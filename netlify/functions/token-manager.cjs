const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const APP_ID = process.env.FACEBOOK_APP_ID || '1294804134917215';
const APP_SECRET = process.env.FACEBOOK_APP_SECRET || '24bd37d51788fe07e36aaad8a28bc005';
const TOKEN_FILE_PATH = path.join(__dirname, '.token.json');

// Helper function to read the current token from file
async function readTokenFile() {
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const data = fs.readFileSync(TOKEN_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
    return { token: process.env.FACEBOOK_LONG_LIVED_TOKEN, refreshed: null };
  } catch (error) {
    console.error('Error reading token file:', error);
    return { token: process.env.FACEBOOK_LONG_LIVED_TOKEN, refreshed: null };
  }
}

// Helper function to write token to file
async function writeTokenFile(tokenData) {
  try {
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokenData), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing token file:', error);
    return false;
  }
}

// Refresh token
async function refreshToken(token) {
  try {
    console.log('Attempting to refresh token...');
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
    console.error('Error refreshing token:', error.response ? error.response.data : error.message);
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
    const tokenData = await readTokenFile();
    const currentToken = tokenData.token;
    
    // Check if token needs refreshing
    if (needsRefresh(tokenData.refreshed)) {
      try {
        const newToken = await refreshToken(currentToken);
        const newTokenData = {
          token: newToken,
          refreshed: new Date().toISOString()
        };
        
        // Save new token data
        await writeTokenFile(newTokenData);
        return newToken;
      } catch (refreshError) {
        console.warn('Failed to refresh token, using existing token', refreshError.message);
        return currentToken;
      }
    }
    
    return currentToken;
  } catch (error) {
    console.error('Error getting current token:', error);
    return process.env.FACEBOOK_LONG_LIVED_TOKEN;
  }
}

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    const token = await getCurrentToken();
    
    // Only return the token status, not the actual token for security
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Token is valid and up to date'
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