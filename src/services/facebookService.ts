import axios from 'axios';
import { FacebookPost, FacebookEvent } from '../types/facebook';

// Base URL for Facebook Graph API
const API_BASE_URL = 'https://graph.facebook.com/v18.0';
const PAGE_ID = import.meta.env.VITE_FACEBOOK_PAGE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN;

// Get the latest posts
export const fetchLatestPosts = async (limit = 5): Promise<FacebookPost[]> => {
  try {
    const response = await axios.get<{ data: FacebookPost[] }>(
      `${API_BASE_URL}/${PAGE_ID}/posts`,
      {
        params: {
          fields: 'id,message,full_picture,created_time,attachments{media_type,url,title,description}',
          limit,
          access_token: ACCESS_TOKEN
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    throw error;
  }
};

// Get upcoming events
export const fetchUpcomingEvents = async (limit = 5): Promise<FacebookEvent[]> => {
  try {
    const response = await axios.get<{ data: FacebookEvent[] }>(
      `${API_BASE_URL}/${PAGE_ID}/events`,
      {
        params: {
          fields: 'id,name,description,start_time,end_time,cover,place',
          time_filter: 'upcoming',
          limit,
          access_token: ACCESS_TOKEN
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Facebook events:', error);
    throw error;
  }
};