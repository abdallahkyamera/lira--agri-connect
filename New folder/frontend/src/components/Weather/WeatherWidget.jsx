// src/components/Weather/WeatherWidget.jsx
import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '6ad046e40956fee0cf6e10e5b5395604'; // ← Replace with your key
  const CITY = 'Lira'; // You can make this dynamic later

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      
      if (!res.ok) throw new Error("Weather data not available");

      const data = await res.json();
      
      setWeather({
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      });
    } catch (err) {
      setError("Failed to load weather");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card">Loading weather...</div>;
  if (error) return <div className="card">{error}</div>;

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, #bae6fd, #e0f2fe)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {weather.icon && <img src={weather.icon} alt="weather" style={{ width: '70px' }} />}
        <div>
          <h2 style={{ fontSize: '42px', margin: '0' }}>{weather.temp}°C</h2>
          <p style={{ margin: '0', fontSize: '18px', textTransform: 'capitalize' }}>
            {weather.description}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
        <p>Feels like: <strong>{weather.feelsLike}°C</strong></p>
        <p>Humidity: <strong>{weather.humidity}%</strong></p>
        <p>Wind: <strong>{weather.windSpeed} m/s</strong></p>
      </div>

      {/* <p style={{ marginTop: '15px', fontWeight: '600', color: '#166534' }}>
        Good day for farming in Lira
      </p> */}
    </div>
  );
};

export default WeatherWidget;