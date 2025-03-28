const axios = require('axios');
require('dotenv').config();

// Constants for Facebook API
const FB_API_VERSION = 'v19.0';
const FB_PAGE_ID = process.env.FB_PAGE_ID || '56005271774';
const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Helper function to check if token needs refresh
// We'll consider the token valid for 30 days to be safe
// (even though long-lived page tokens can last longer)
function isTokenValid(tokenData) {
  if (!tokenData || !tokenData.updatedAt) return false;
  
  // Check if token was updated in the last 30 days
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  return tokenData.updatedAt > thirtyDaysAgo;
}

// Get token from environment variable
// The token info is stored as a JSON string in the environment variable
async function getStoredToken() {
  try {
    const tokenEnvVar = process.env.FACEBOOK_TOKEN_DATA;
    if (!tokenEnvVar) {
      // If no token data exists, use the initial token
      return {
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
        updatedAt: 0
      };
    }
    
    return JSON.parse(tokenEnvVar);
  } catch (error) {
    console.error('Error parsing stored token:', error);
    // Fallback to the initial token
    return {
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
      updatedAt: 0
    };
  }
}

// Refresh the token using the Facebook Graph API
async function refreshToken(currentToken) {
  console.log('Refreshing Facebook token...');
  
  try {
    // Exchange the token for a new one
    const response = await axios.get(`https://graph.facebook.com/${FB_API_VERSION}/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: APP_ID,
        client_secret: APP_SECRET,
        fb_exchange_token: currentToken
      }
    });
    
    const newToken = response.data.access_token;
    
    // Get a page access token using the new user token
    const pageResponse = await axios.get(`https://graph.facebook.com/${FB_API_VERSION}/me/accounts`, {
      params: {
        access_token: newToken
      }
    });
    
    // Find the page token for our page
    const page = pageResponse.data.data.find(page => page.id === FB_PAGE_ID);
    
    if (!page) {
      throw new Error(`Page with ID ${FB_PAGE_ID} not found in accounts`);
    }
    
    const pageToken = page.access_token;
    
    // Return the new token data
    // Note: We can't update the environment variable dynamically,
    // but we can log it so it can be updated manually if needed
    const tokenData = {
      accessToken: pageToken,
      updatedAt: Date.now()
    };
    
    console.log('Token refreshed successfully');
    console.log('New token data (add to your Netlify environment variables):');
    console.log(`FACEBOOK_TOKEN_DATA=${JSON.stringify(tokenData)}`);
    
    return tokenData;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

// Get a valid token, refreshing if necessary
async function getValidToken() {
  // Get the current token data
  let tokenData = await getStoredToken();
  
  // Check if we need to refresh the token
  if (!isTokenValid(tokenData)) {
    try {
      // Attempt to refresh the token
      tokenData = await refreshToken(tokenData.accessToken);
    } catch (error) {
      console.error('Token refresh failed, using existing token:', error);
      // Continue with existing token if refresh fails
    }
  }
  
  return tokenData.accessToken;
}

// Fetch Facebook posts
async function getFacebookPosts(limit = 5) {
  const token = await getValidToken();
  
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/posts`, {
        params: {
          fields: 'message,created_time,full_picture,permalink_url',
          limit: limit,
          access_token: token
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    
    // Check if this is a token expiration error
    if (error.response && 
        error.response.data && 
        error.response.data.error && 
        error.response.data.error.code === 190) {
      
      console.log('Token expired, attempting refresh...');
      try {
        // Force token refresh
        const newTokenData = await refreshToken(token);
        console.log('Token refreshed successfully, retrying request with new token');
        
        // Retry with new token
        const retryResponse = await axios.get(
          `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/posts`, {
            params: {
              fields: 'message,created_time,full_picture,permalink_url',
              limit: limit,
              access_token: newTokenData.accessToken
            }
          }
        );
        
        return retryResponse.data.data;
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Failed to refresh Facebook token');
      }
    }
    
    throw error;
  }
}

// Fetch Facebook events
async function getFacebookEvents(limit = 5) {
  const token = await getValidToken();
  
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/events`, {
        params: {
          fields: 'name,description,start_time,end_time,cover',
          limit: limit,
          access_token: token
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Facebook events:', error);
    throw error;
  }
}

// Main handler function
exports.handler = async function(event, context) {
  // Set CORS headers for browser requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  // Parse the path to determine what to fetch
  const pathSegments = event.path.split('/');
  const resource = pathSegments[pathSegments.length - 1];
  const limit = event.queryStringParameters?.limit || 5;
  
  try {
    let data;
    
    if (resource === 'posts') {
      data = await getFacebookPosts(limit);
    } else if (resource === 'events') {
      data = await getFacebookEvents(limit);
    } else {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Resource not found' })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error in Facebook function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};