import React, { useState, useEffect } from 'react';
import { fetchLatestPosts } from '../services/facebookService';
import { FacebookPost } from '../types/facebook';
import { Calendar, Facebook } from 'lucide-react';

const FacebookPosts: React.FC = () => {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const postsData = await fetchLatestPosts(3); // Fetch 3 latest posts
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6a648]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Facebook className="text-[#e6a648] w-6 h-6" />
        <h2 className="text-3xl font-bold">Latest Updates</h2>
      </div>
      
      {posts.length === 0 ? (
        <p className="text-gray-600">No recent posts available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-xl rounded-lg overflow-hidden border border-[#f3df63]">
              {post.full_picture && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.full_picture} 
                    alt="Post" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.created_time)}</span>
                </div>
                <div className="mb-4">
                  {post.message ? (
                    <p className="text-gray-700">
                      {post.message.length > 150 
                        ? `${post.message.substring(0, 150)}...` 
                        : post.message}
                    </p>
                  ) : (
                    post.attachments?.data[0]?.description && (
                      <p className="text-gray-700">
                        {post.attachments.data[0].description.length > 150 
                          ? `${post.attachments.data[0].description.substring(0, 150)}...` 
                          : post.attachments.data[0].description}
                      </p>
                    )
                  )}
                </div>
                <a 
                  href={`https://www.facebook.com/${post.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#f3df63] text-black px-4 py-2 rounded-lg hover:bg-[#e6a648] hover:text-white transition-colors mt-2"
                >
                  <Facebook className="w-4 h-4" />
                  View on Facebook
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacebookPosts;