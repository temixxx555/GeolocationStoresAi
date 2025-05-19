// app/page.jsx
"use client";

import { useState, useEffect } from 'react';

const LOCATIONIQ_API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || 'pk.ab4164c204cb64695b3078aac7c2ee9a'; // Move to .env.local

export default function Home() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Coordinates:', latitude, longitude);

          // Validate coordinates for Berger, Lagos (~6.65, 3.34)
          if (latitude < 6.5 || latitude > 6.7 || longitude < 3.3 || longitude > 3.4) {
            console.warn('Coordinates may be outside Berger, Lagos');
          }

          try {
            // Fetch reverse geocoding data from LocationIQ API
            const response = await fetch(
              `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
            );

            if (!response.ok) {
              throw new Error(`LocationIQ API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('LocationIQ Response:', data);

            if (data.error) {
              throw new Error(data.error || 'No location found for these coordinates');
            }

            // Verify the result is in Nigeria
            if (data.address.country_code !== 'ng') {
              throw new Error('Location is outside Nigeria');
            }

            // Extract postal code and address details
            const postalCode = data.address.postcode || 'Not available';
            const address = data.display_name || 'Unknown address';

            setLocation({
              address,
              postalCode,
              latitude,
              longitude,
            });
          } catch (err) {
            setError(err.message);
          }
        },
        (err) => {
          setError('Geolocation access denied or unavailable');
          console.error('Geolocation Error:', err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', textAlign: 'center' }}>
      <h1>Your Location in Berger, Nigeria</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {location ? (
        <div>
          <p><strong>Address:</strong> {location.address}</p>
          <p><strong>Postal Code:</strong> {location.postalCode}</p>
          <p><strong>Coordinates:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
        </div>
      ) : (
        !error && <p>Loading location...</p>
      )}
    </div>
  );
}