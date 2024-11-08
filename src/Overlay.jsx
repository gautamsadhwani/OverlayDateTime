import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const Overlay = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, city: 'Loading...' });
  const [isLoading, setIsLoading] = useState(true);
 
  const [position, setPosition] = useState({ x: 250, y: 220 });
  

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get current location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${import.meta.env.VITE_API_KEY}`)
              .then((response) => response.json())
              .then((data) => {
                console.log("API Response Data:", data); // Check this output
                console.log("API Key:", import.meta.env.VITE_API_KEY);
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  city: data[0]?.name || 'Unknown Location'
                });
                setIsLoading(false);
              });
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocation({ latitude: 0, longitude: 0, city: 'Location unavailable' });
            setIsLoading(false);
          }
        );
      } else {
        setLocation({ latitude: 0, longitude: 0, city: 'Location unavailable' });
        setIsLoading(false);
      }
    };
    getLocation();
  }, []);

  // Dragging handlers (same as before)
  
  // Format time with leading zeros
  const formatTime = (num) => num.toString().padStart(2, '0');

  const hours = formatTime(dateTime.getHours());
  const minutes = formatTime(dateTime.getMinutes());
  const seconds = formatTime(dateTime.getSeconds());
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = dateTime.toLocaleDateString(undefined, options);

  return (
    <div 
      className="fixed select-none cursor-move"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
      }}
      
    >
      <div className="bg-black bg-opacity-85 text-white p-4 rounded-lg shadow-lg">
        <div className="text-4xl font-mono mb-2 text-center">
          {hours}:{minutes}:{seconds}
        </div>
        <div className="text-sm text-center">
          {dateStr}
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center mt-2">
            <span>Loading location...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center mt-2">
            <MapPin className="mr-2" size={20} />
            <span>{location.city}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overlay;