import React, { useState, useEffect } from 'react';
import facebookService, { FacebookEvent } from '../services/facebookService';

interface FacebookEventsProps {
  limit?: number;
}

const FacebookEvents: React.FC<FacebookEventsProps> = ({ limit = 3 }) => {
  const [events, setEvents] = useState<FacebookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events with limit:', limit);
        setLoading(true);
        const eventsData = await facebookService.getEvents(limit);
        console.log('Events data received:', eventsData);
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

  // Debug output to help identify issues
  console.log('Events component state:', { loading, error, eventsCount: events.length });

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
    console.error('Rendering error state:', error);
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    console.log('No events to display');
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
    <div className="grid md:grid-cols-3 gap-8">
      {events.map(event => (
        <div key={event.id} className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#e6a648]">
          {event.cover ? (
            <img
              src={event.cover.source}
              alt={event.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
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