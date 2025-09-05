import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = ({ isOpen, onClose, updateSettings }) => {
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableSounds, setEnableSounds] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings({
      timers: {
        POMODORO: pomodoroMinutes,
        SHORT_BREAK: shortBreakMinutes,
        LONG_BREAK: longBreakMinutes
      },
      enableNotifications,
      enableSounds
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="settings-section">
            <h3>Timer (minutes)</h3>
            <div className="settings-controls">
              <div className="setting-group">
                <label htmlFor="pomodoro">Focus</label>
                <input
                  id="pomodoro"
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroMinutes}
                  onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                />
              </div>
              
              <div className="setting-group">
                <label htmlFor="shortBreak">Short Break</label>
                <input
                  id="shortBreak"
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakMinutes}
                  onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
                />
              </div>
              
              <div className="setting-group">
                <label htmlFor="longBreak">Long Break</label>
                <input
                  id="longBreak"
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakMinutes}
                  onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Notifications</h3>
            <div className="settings-toggle">
              <label htmlFor="notifications">
                Browser Notifications
                <input
                  id="notifications"
                  type="checkbox"
                  checked={enableNotifications}
                  onChange={() => setEnableNotifications(!enableNotifications)}
                />
                <span className="checkmark"></span>
              </label>
              {enableNotifications && (
                <button 
                  type="button" 
                  className="permission-button"
                  onClick={() => {
                    if ("Notification" in window) {
                      Notification.requestPermission();
                    }
                  }}
                >
                  Request Permission
                </button>
              )}
            </div>
            
            <div className="settings-toggle">
              <label htmlFor="sounds">
                Sound Effects
                <input
                  id="sounds"
                  type="checkbox"
                  checked={enableSounds}
                  onChange={() => setEnableSounds(!enableSounds)}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
          
          <div className="settings-actions">
            <button type="submit" className="save-button">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
