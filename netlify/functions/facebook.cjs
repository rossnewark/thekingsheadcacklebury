const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const PAGE_ID = '56005271774'; // Kings Head Cacklebury Facebook page ID
const TOKEN_FILE_PATH = path.join(__dirname, '.token.json');

// Fallback data for when Facebook API is unavailable
const FALLBACK_DATA = {
  posts: [
    {
      id: 'fallback1',
      message: "Join us this Sunday for our famous roast dinner! Seating available from 12pm to 4pm. Book your table now by calling 01323 440447.",
      created_time: new Date().toISOString(),
      full_picture: "/roast_lunch.jpg",
      permalink_url: "https://www.facebook.com/KingsHeadCacklebury"
    },
    {
      id: 'fallback2',
      message: "Test your knowledge at our weekly Pub Quiz! Every Sunday evening from 7pm. Great prizes to be won!",
      created_time: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      full_picture: "/quiz.jpg",
      permalink_url: "https://www.facebook.com/KingsHeadCacklebury"
    },
    {
      id: 'fallback3',
      message: "We're proud to serve a wide selection of Harvey's ales, brewed locally in Lewes. Come and enjoy a perfect pint in our cozy pub atmosphere!",
      created_time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      full_picture: "/harveys_pumps.jpg",
      permalink_url: "https://www.facebook.com/KingsHeadCacklebury"
    }
  ],
  events: [
    {
      id: 'event1',
      name: "Sunday Roast Lunch",
      description: "Join us for our legendary Sunday roast lunch with all the trimmings! Choose from succulent roast beef, tender pork, mouthwatering chicken, or our delicious vegetarian option.",
      start_time: getNextSunday(12, 0).toISOString(),
      end_time: getNextSunday(16, 0).toISOString(),
      cover: { source: "/roast_lunch.jpg" }
    },
    {
      id: 'event2',
      name: "Sunday Evening Pub Quiz",
      description: "Test your knowledge and win great prizes at our weekly pub quiz!",
      start_time: getNextSunday(19, 0).toISOString(),
      end_time: getNextSunday(21, 0).toISOString(),
      cover: { source: "/quiz.jpg" }
    },
    {
      id: 'event3',
      name: "Live Music in the Garden",
      description: "Enjoy live music in our pub garden, weather permitting. Check back for details of performers!",
      start_time: getNextSaturday(18, 0).toISOString(),
      end_time: getNextSaturday(22, 0).toISOString(),
      cover: { source: "/live_music.jpg" }
    }
  ]
};

// Helper function to get next Sunday
function getNextSunday(hours, minutes) {
  const date = new Date();
  const day = date.getDay(); // 0 is Sunday
  const daysToAdd = day === 0 ? 7 : 7 - day;
  
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(hours, minutes, 0, 0);
  
  return date;
}

// Helper function to get next Saturday
function getNextSaturday(hours, minutes) {
  const date = new Date();
  const day = date.getDay(); // 6 is Saturday
  const daysToAdd = day === 6 ? 7 : (6 - day + 7) % 7;
  
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(hours, minutes, 0, 0);
  
  return date;
}

// Helper function to read the current token from file
async function getToken() {
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const data = fs.readFileSync(TOKEN_FILE_PATH, 'utf8');
      const tokenData = JSON.parse(data);
      return tokenData.token;
    }
    return process.env.FACEBOOK_LONG_LIVED_TOKEN;
  } catch (error) {
    console.error('Error reading token file:', error);
    return process.env.FACEBOOK_LONG_LIVED_TOKEN;
  }
}

// Get Facebook posts
async function getFacebookPosts(token) {
  try {
    // Attempt to use the API
    const response = await axios.get(`https://graph.facebook.com/v19.0/${PAGE_ID}/posts`, {
      params: {
        fields: 'message,created_time,full_picture,permalink_url',
        limit: '5',
        access_token: token
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Facebook posts:', error.response ? error.response.data : error.message);
    
    // Use fallback data
    console.log('Using fallback posts data');
    return FALLBACK_DATA.posts;
  }
}

// Get Facebook events
async function getFacebookEvents(token) {
  try {
    // Attempt to use the API
    const response = await axios.get(`https://graph.facebook.com/v19.0/${PAGE_ID}/events`, {
      params: {
        fields: 'name,description,start_time,end_time,cover',
        limit: '3',
        access_token: token
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Facebook events:', error.response ? error.response.data : error.message);
    
    // Use fallback data
    console.log('Using fallback events data');
    return FALLBACK_DATA.events;
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

  const type = event.queryStringParameters ? event.queryStringParameters.type : 'posts';
  
  try {
    // Try to trigger token refresh first
    try {
      await axios.get('/.netlify/functions/token-manager');
    } catch (refreshError) {
      console.warn('Token manager error:', refreshError.message);
      // Continue anyway, as we'll use the current token file
    }
    
    // Get the current token
    const token = await getToken();
    
    // Get data
    let result;
    if (type === 'events') {
      result = await getFacebookEvents(token);
    } else {
      result = await getFacebookPosts(token);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error in Facebook function:', error);
    
    // Return fallback data even if all else fails
    const fallbackData = type === 'events' ? FALLBACK_DATA.events : FALLBACK_DATA.posts;
    
    return {
      statusCode: 200, // Return 200 with fallback data instead of error
      headers,
      body: JSON.stringify(fallbackData)
    };
  }
};