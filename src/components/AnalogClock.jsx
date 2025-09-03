import { useEffect, useState } from 'react';
import '../styles/Clock.css';
import '../styles/ClockExtras.css';

const AnalogClock = ({ minutes, seconds, isRunning }) => {
  // Parse minutes and seconds as integers
  const mins = parseInt(minutes);
  const secs = parseInt(seconds);

  return (
    <div className={`clock-face ${isRunning ? 'running' : ''}`}>
      {/* Clock ticks/markers */}
      <div className="clock-outer-ring"></div>
      <div className="clock-ticks-container">
        {[...Array(60)].map((_, i) => (
          <div 
            key={i} 
            className={
              i % 15 === 0 ? "clock-quarter-mark" : 
              i % 5 === 0 ? "clock-hour-mark" : 
              "clock-tick"
            }
            style={{ 
              transform: `rotate(${i * 6}deg)`
            }}
          ></div>
        ))}
      </div>
      
      {/* Progress indicator removed as requested */}
      
      {/* Minute and second hands */}
      <div 
        className="clock-minute-hand" 
        style={{ 
          transform: `rotate(${(mins % 60) * 6 + (secs / 60) * 6}deg)` 
        }}
      ></div>
      
      <div 
        className="clock-second-hand" 
        style={{ 
          transform: `rotate(${secs * 6}deg)` 
        }}
      ></div>
      
      {/* Center dot */}
      <div className="clock-center"></div>
      
      {/* Digital time overlay */}
      <div className="clock-time">
        {minutes}:{seconds}
      </div>
    </div>
  );
};

export default AnalogClock;
