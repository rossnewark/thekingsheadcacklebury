import React, { useState, useEffect } from 'react';
import facebookService, { FacebookPost } from '../services/facebookService';

interface FacebookPostsProps {
  limit?: number;
}

const FacebookPosts: React.FC<FacebookPostsProps> = ({ limit = 3 }) => {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts with limit:', limit);
        setLoading(true);
        const postsData = await facebookService.getPosts(limit);
        console.log('Posts data received:', postsData);
        setPosts(postsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Unable to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate time difference in milliseconds
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHour / 24);
    
    // Format relative time
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      // Fall back to a standard date format for older posts
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#e6a648] animate-pulse">
            <div className="responsive-image-container responsive-image-container--4-3 bg-gray-200"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#e6a648]">
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">No Recent Posts</h3>
          <p className="text-gray-600">Check our Facebook page for the latest updates.</p>
          <a 
            href="https://www.facebook.com/KingsHeadCacklebury"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-[#e6a648] hover:text-[#f3df63]"
          >
            Visit our Facebook page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#e6a648] h-full flex flex-col">
          {post.full_picture && (
            <div className="responsive-image-container responsive-image-container--4-3 border-b border-[#e6a648]/20">
              <img
                src={post.full_picture}
                alt="Facebook post image"
                className="responsive-image responsive-image--mobile-contain md:responsive-image--cover"
              />
            </div>
          )}
          <div className="p-6 flex-grow">
            {post.message && (
              <p className="text-gray-700 mb-4">{post.message}</p>
            )}
            <div className="flex justify-between items-center mt-auto">
              <span className="text-gray-500 text-sm">
                {formatDate(post.created_time)}
              </span>
              <a
                href={post.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e6a648] hover:text-[#f3df63]"
              >
                View on Facebook
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacebookPosts;