import { useState, useEffect } from 'react';
import eventConfig from '../config/eventConfig.json';

export const useEventData = () => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay (in real app, this would fetch from API)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get the current active event
        const activeEvent = eventConfig.currentEvent;
        
        if (activeEvent && activeEvent.isActive) {
          setCurrentEvent(activeEvent);
        } else {
          // If no active event, try to get the next upcoming event
          const nextEvent = eventConfig.upcomingEvents.find(event => 
            new Date(event.startTime) > new Date()
          );
          
          if (nextEvent) {
            setCurrentEvent(nextEvent);
          } else {
            setCurrentEvent(null);
          }
        }
      } catch (err) {
        setError('Failed to load event data');
        console.error('Error loading event data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, []);

  const updateEventData = (newEventData) => {
    setCurrentEvent(newEventData);
  };

  const getEventStatus = (event) => {
    if (!event) return 'inactive';
    
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    
    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'live';
    return 'ended';
  };

  const getTimeUntilEvent = (event) => {
    if (!event) return null;
    
    const now = new Date();
    const startTime = new Date(event.startTime);
    const difference = startTime.getTime() - now.getTime();
    
    if (difference <= 0) return null;
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };

  const getTimeUntilEventEnd = (event) => {
    if (!event) return null;
    
    const now = new Date();
    const endTime = new Date(event.endTime);
    const difference = endTime.getTime() - now.getTime();
    
    if (difference <= 0) return null;
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };

  return {
    currentEvent,
    loading,
    error,
    updateEventData,
    getEventStatus,
    getTimeUntilEvent,
    getTimeUntilEventEnd
  };
};
