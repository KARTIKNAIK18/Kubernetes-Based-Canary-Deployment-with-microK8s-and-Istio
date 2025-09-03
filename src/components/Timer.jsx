import { useState, useRef, useEffect } from 'react';
import Settings from './Settings';
import AnalogClock from './AnalogClock';
import SettingsIcon from './SettingsIcon';
import '../styles/Timer.css';

// Default timer mode durations (in minutes)
const DEFAULT_TIMER_MODES = {
  POMODORO: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15
};

const Timer = () => {
  const [settings, setSettings] = useState({
    timers: DEFAULT_TIMER_MODES,
    enableSounds: true,
    enableNotifications: true
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timerMode, setTimerMode] = useState('POMODORO');
  const [secondsLeft, setSecondsLeft] = useState(settings.timers[timerMode] * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  // Cache for timer states in different modes
  const [timerStates, setTimerStates] = useState({
    POMODORO: settings.timers.POMODORO * 60,
    SHORT_BREAK: settings.timers.SHORT_BREAK * 60,
    LONG_BREAK: settings.timers.LONG_BREAK * 60
  });
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [quote, setQuote] = useState('');
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  
  // Array of motivational quotes
  const quotes = [
    "Focus on being productive instead of busy.",
    "The secret of getting ahead is getting started.",
    "Don't count the days, make the days count.",
    "It always seems impossible until it's done.",
    "The only way to do great work is to love what you do.",
    "Your time is limited, don't waste it living someone else's life.",
    "Small progress is still progress.",
    "The best time to plant a tree was 20 years ago. The second best time is now."
  ];

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  // Update timer when mode changes - use cached value if available
  useEffect(() => {
    // Update seconds left based on cached value for this mode
    setSecondsLeft(timerStates[timerMode]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerMode]);

  // Handle timer completion
  useEffect(() => {
    if (secondsLeft === 0 && !isRunning) {
      // Play sound notification if enabled
      if (settings.enableSounds && audioRef.current) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }

      if (timerMode === 'POMODORO') {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        
        if (newSessions % 4 === 0) {
          showNotification('Take a long break!', 'LONG_BREAK');
        } else {
          showNotification('Take a short break!', 'SHORT_BREAK');
        }
      } else {
        showNotification('Back to work!', 'POMODORO');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isRunning]);

  // Set page title to show current timer
  useEffect(() => {
    document.title = `${minutes}:${seconds} - ${timerMode.toLowerCase().replace('_', ' ')}`;
    return () => {
      document.title = 'Pomodoro Timer';
    };
  }, [minutes, seconds, timerMode]);

  const showNotification = (message, nextMode) => {
    setNotificationMessage(message);
    setIsNotificationVisible(true);
    
    // Show notification for 3 seconds
    setTimeout(() => {
      setIsNotificationVisible(false);
      setTimerMode(nextMode);
    }, 3000);

    // Browser notification (if enabled, supported and permitted)
    if (settings.enableNotifications && "Notification" in window && Notification.permission === "granted") {
      new Notification("Pomodoro Timer", { 
        body: message,
        icon: "/favicon.ico" 
      });
    }
  };

  // Track focus time when timer is running
  useEffect(() => {
    if (isRunning && timerMode === 'POMODORO') {
      if (!sessionStartTime) {
        setSessionStartTime(new Date());
      }
    } else if (sessionStartTime && timerMode === 'POMODORO') {
      // When focus timer stops, calculate elapsed time
      const endTime = new Date();
      const elapsedSeconds = Math.floor((endTime - sessionStartTime) / 1000);
      setTotalFocusTime(prev => prev + elapsedSeconds);
      setSessionStartTime(null);
    }
  }, [isRunning, timerMode, sessionStartTime]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          const newValue = prev > 0 ? prev - 1 : 0;
          
          // Update the cached state for current timer mode
          setTimerStates(prevStates => ({
            ...prevStates,
            [timerMode]: newValue
          }));
          
          if (newValue === 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
          }
          
          return newValue;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    
    // Update the cached state for the current timer mode
    setTimerStates(prevStates => ({
      ...prevStates,
      [timerMode]: secondsLeft
    }));
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    const resetValue = settings.timers[timerMode] * 60;
    setSecondsLeft(resetValue);
    
    // Update cached state for this mode
    setTimerStates(prevStates => ({
      ...prevStates,
      [timerMode]: resetValue
    }));
    
    // Select a random quote when resetting
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };
  
  // Initialize with a random quote
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);
  
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    
    // Update all cached timer states with new durations
    const newTimerStates = {
      POMODORO: newSettings.timers.POMODORO * 60,
      SHORT_BREAK: newSettings.timers.SHORT_BREAK * 60,
      LONG_BREAK: newSettings.timers.LONG_BREAK * 60
    };
    
    // Preserve current timer's progress if it's running
    if (isRunning) {
      newTimerStates[timerMode] = secondsLeft;
    }
    
    setTimerStates(newTimerStates);
    
    // Update current timer if not running
    if (!isRunning) {
      setSecondsLeft(newSettings.timers[timerMode] * 60);
    }
  };

  const changeTimerMode = (mode) => {
    if (mode !== timerMode) {
      // Save current timer state before switching
      setTimerStates(prevStates => ({
        ...prevStates,
        [timerMode]: secondsLeft
      }));
      
      // Switch to the new mode
      setTimerMode(mode);
      
      // Stop the timer when switching modes
      if (isRunning) {
        setIsRunning(false);
        clearInterval(intervalRef.current);
      }
    }
  };

  return (
    <div className="timer-display-container">
      {isNotificationVisible && (
        <div className="notification-popup">
          {notificationMessage}
        </div>
      )}
      
      <div className="timer-header">
        <div className="timer-mode-selector">
          <button 
            onClick={() => changeTimerMode('POMODORO')} 
            className={timerMode === 'POMODORO' ? 'mode-selected' : ''}
          >
            Focus
          </button>
          <button 
            onClick={() => changeTimerMode('SHORT_BREAK')}
            className={timerMode === 'SHORT_BREAK' ? 'mode-selected' : ''}
          >
            Short Break
          </button>
          <button 
            onClick={() => changeTimerMode('LONG_BREAK')}
            className={timerMode === 'LONG_BREAK' ? 'mode-selected' : ''}
          >
            Long Break
          </button>
        </div>
        
        <button 
          className="settings-button" 
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Settings"
        >
          <SettingsIcon />
        </button>
      </div>

      <AnalogClock minutes={minutes} seconds={seconds} isRunning={isRunning} />
      
      <div className="current-task">
        {showTaskInput ? (
          <div className="task-input-container">
            <input
              type="text"
              placeholder="What are you working on?"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              className="task-input"
              autoFocus
              onBlur={() => setShowTaskInput(false)}
              onKeyDown={(e) => e.key === 'Enter' && setShowTaskInput(false)}
            />
          </div>
        ) : (
          <div 
            className="task-display" 
            onClick={() => setShowTaskInput(true)}
          >
            {currentTask ? currentTask : "Click to add task..."}
          </div>
        )}
      </div>

      <div className="timer-stats">
        <div className="session-counter">
          Session: {sessions}
        </div>
        <div className="focus-time-counter">
          Total Focus: {Math.floor(totalFocusTime / 60)} min
        </div>
      </div>

      {!isRunning && (
        <div className="quote-container">
          <p className="quote">"{quote}"</p>
        </div>
      )}
      
      <div className="timer-controls">
        <button 
          onClick={startTimer} 
          disabled={isRunning} 
          className={isRunning ? 'disabled' : 'primary'}
        >
          Start
        </button>
        <button 
          onClick={pauseTimer} 
          disabled={!isRunning}
          className={!isRunning ? 'disabled' : 'secondary'}
        >
          Pause
        </button>
        <button 
          onClick={resetTimer}
          className="tertiary"
        >
          Reset
        </button>
      </div>

      {/* Hidden audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        updateSettings={updateSettings} 
      />
    </div>
  );
};

export default Timer;
