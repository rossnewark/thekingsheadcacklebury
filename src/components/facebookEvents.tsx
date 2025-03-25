import React, { useState, useEffect } from 'react';
import { fetchUpcomingEvents } from '../services/facebookService';
import { FacebookEvent } from '../types/facebook';
import { Calendar, Clock, MapPin, Facebook } from 'lucide-react';

const FacebookEvents: React.FC = () => {
  const [events, setEvents] = useState<FacebookEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await fetchUpcomingEvents(3); // Fetch 3 upcoming events
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
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
        <Calendar className="text-[#e6a648] w-6 h-6" />
        <h2 className="text-3xl font-bold">Upcoming Events</h2>
      </div>
      
      {events.length === 0 ? (
        <p className="text-gray-600">No upcoming events scheduled. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white shadow-xl rounded-lg overflow-hidden border border-[#e6a648]">
              {event.cover && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.cover.source} 
                    alt={event.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{event.name}</h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 text-[#e6a648]" />
                  <span>{formatDate(event.start_time)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock className="w-4 h-4 text-[#e6a648]" />
                  <span>{formatTime(event.start_time)}</span>
                  {event.end_time && (
                    <>
                      <span>-</span>
                      <span>{formatTime(event.end_time)}</span>
                    </>
                  )}
                </div>
                
                {event.place && event.place.name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-[#e6a648]" />
                    <span>{event.place.name}</span>
                  </div>
                )}
                
                {event.description && (
                  <p className="text-gray-700 mb-4">
                    {event.description.length > 100 
                      ? `${event.description.substring(0, 100)}...` 
                      : event.description}
                  </p>
                )}
                
                <a 
                  href={`https://www.facebook.com/events/${event.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#f3df63] text-black px-4 py-2 rounded-lg hover:bg-[#e6a648] hover:text-white transition-colors mt-2"
                >
                  <Facebook className="w-4 h-4" />
                  View Event
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacebookEvents;