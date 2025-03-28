const axios = require('axios');

// This function will be triggered by Netlify's scheduled functions feature
exports.handler = async function(event, context) {
  console.log('Scheduled token refresh starting...');
  
  try {
    // Call the token manager to check and refresh the token if needed
    const response = await axios.get('https://yoursitename.netlify.app/.netlify/functions/token-manager', {
      headers: {
        'x-api-key': process.env.INTERNAL_API_KEY || 'scheduled-refresh'
      }
    });
    
    console.log('Token refresh result:', response.data);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Token refresh completed successfully'
      })
    };
  } catch (error) {
    console.error('Scheduled token refresh failed:', error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Token refresh failed',
        error: error.message
      })
    };
  }
};