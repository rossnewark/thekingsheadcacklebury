import React, { useState, useEffect } from 'react';
import facebookService, { FacebookEvent } from '../services/facebookService';

interface FacebookEventsProps {
  limit?: number;
}

const FacebookEvents: React.FC<FacebookEventsProps> = ({ limit = 3 }) => {
  const [events, setEvents] = useState<FacebookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Default image to use when an event doesn't have its own cover image
  const defaultEventImage = "/kingshead_cacklebury_pub_outside.jpg";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await facebookService.getEvents(limit);
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Unable to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#e6a648] animate-pulse">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
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

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#e6a648]">
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
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
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
      {events.map(event => (
        <div key={event.id} className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#e6a648] hover:translate-y-[-5px] transition-transform duration-300">
          {/* Cover image section - Use event cover or default if none available */}
          <div className="w-full h-48 bg-[#f3df63]/10">
            {event.cover?.source ? (
              <img
                src={event.cover.source}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={defaultEventImage}
                  alt="Event at Kings Head Cacklebury"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <span className="text-xl font-bold">Event at Kings Head</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
            <p className="text-gray-600 mb-2">{formatDate(event.start_time)}</p>
            {event.description && (
              <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
            )}
            <a 
              href={`https://facebook.com/events/${event.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-[#e6a648] hover:text-[#f3df63]"
            >
              View event details
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacebookEvents;