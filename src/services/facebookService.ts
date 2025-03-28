export interface FacebookPost {
    id: string;
    message?: string;
    created_time: string;
    full_picture?: string;
    permalink_url: string;
  }
  
  export interface FacebookEvent {
    id: string;
    name: string;
    description?: string;
    start_time: string;
    end_time?: string;
    cover?: {
      source: string;
    };
  }
  
  class FacebookService {
    private apiBaseUrl = '/.netlify/functions/facebook';
    
    /**
     * Get posts from the Facebook API via our backend function
     */
    async getPosts(limit = 5): Promise<FacebookPost[]> {
      try {
        const response = await fetch(`${this.apiBaseUrl}/posts?limit=${limit}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Facebook API Error: ${errorData.message || response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching Facebook posts:', error);
        throw error;
      }
    }
  
    /**
     * Get events from the Facebook API via our backend function
     */
    async getEvents(limit = 5): Promise<FacebookEvent[]> {
      try {
        const response = await fetch(`${this.apiBaseUrl}/events?limit=${limit}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Facebook API Error: ${errorData.message || response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching Facebook events:', error);
        throw error;
      }
    }
  }
  
  export default new FacebookService();