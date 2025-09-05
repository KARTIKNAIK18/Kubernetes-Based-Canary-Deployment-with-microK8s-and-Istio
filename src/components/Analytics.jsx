import { useState, useEffect } from 'react';
import '../styles/Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, selectedPeriod]);

  const fetchAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user statistics
      const statsResponse = await fetch(
        `http://localhost:3003/api/analytics/stats/${user.id}?days=${selectedPeriod}`
      );
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch recent sessions
      const sessionsResponse = await fetch(
        `http://localhost:3003/api/analytics/sessions/${user.id}?limit=10&days=${selectedPeriod}`
      );
      const sessionsData = await sessionsResponse.json();
      
      if (sessionsData.success) {
        setSessions(sessionsData.sessions);
      }

      // Fetch trends
      const trendsResponse = await fetch(
        `http://localhost:3003/api/analytics/trends/${user.id}?days=${selectedPeriod}`
      );
      const trendsData = await trendsResponse.json();
      
      if (trendsData.success) {
        setTrends(trendsData.trends.slice(-7)); // Last 7 days
      }

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = async (format) => {
    if (!user) return;
    
    try {
      const response = await fetch(
        `http://localhost:3003/api/analytics/export/${user.id}?format=${format}&days=${selectedPeriod}`
      );
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timer-sessions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timer-sessions-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please check if the analytics service is running.');
    }
  };

  if (!user) {
    return (
      <div className="analytics-container">
        <div className="analytics-content">
          <div className="no-user">
            <h2>Please log in to view analytics</h2>
            <p>Track your productivity and see detailed insights about your timer sessions.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-content">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-content">
        <div className="analytics-header">
          <h2>Your Productivity Analytics</h2>
          <div className="period-selector">
            <button 
              className={selectedPeriod === 7 ? 'active' : ''}
              onClick={() => setSelectedPeriod(7)}
            >
              7 Days
            </button>
            <button 
              className={selectedPeriod === 30 ? 'active' : ''}
              onClick={() => setSelectedPeriod(30)}
            >
              30 Days
            </button>
            <button 
              className={selectedPeriod === 90 ? 'active' : ''}
              onClick={() => setSelectedPeriod(90)}
            >
              90 Days
            </button>
          </div>
        </div>

        {stats && (
          <>
            {/* Key Statistics */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Productivity Score</h3>
                <div className="stat-value score">
                  {stats.productivityScore}
                  <span className="unit">/100</span>
                </div>
              </div>
              
              <div className="stat-card">
                <h3>Focus Time</h3>
                <div className="stat-value">
                  {stats.totalFocusTimeMinutes}
                  <span className="unit">min</span>
                </div>
              </div>
              
              <div className="stat-card">
                <h3>Completion Rate</h3>
                <div className="stat-value">
                  {stats.completionRate}
                  <span className="unit">%</span>
                </div>
              </div>
              
              <div className="stat-card">
                <h3>Current Streak</h3>
                <div className="stat-value">
                  {stats.currentStreak}
                  <span className="unit">🍅</span>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="detailed-stats">
              <div className="stat-section">
                <h3>Session Summary</h3>
                <div className="stat-row">
                  <span>Total Sessions:</span>
                  <span>{stats.totalSessions}</span>
                </div>
                <div className="stat-row">
                  <span>Pomodoros:</span>
                  <span>{stats.pomodoroCount} 🍅</span>
                </div>
                <div className="stat-row">
                  <span>Short Breaks:</span>
                  <span>{stats.shortBreakCount}</span>
                </div>
                <div className="stat-row">
                  <span>Long Breaks:</span>
                  <span>{stats.longBreakCount}</span>
                </div>
                <div className="stat-row">
                  <span>Longest Streak:</span>
                  <span>{stats.longestStreak} 🍅</span>
                </div>
                <div className="stat-row">
                  <span>Total Interruptions:</span>
                  <span>{stats.totalInterruptions}</span>
                </div>
                <div className="stat-row">
                  <span>Avg Session Duration:</span>
                  <span>{formatDuration(stats.averageSessionDuration)}</span>
                </div>
              </div>

              {/* Daily Trends */}
              {trends.length > 0 && (
                <div className="stat-section">
                  <h3>Daily Trends (Last 7 Days)</h3>
                  <div className="trends-chart">
                    {trends.map((day, index) => (
                      <div key={day.date} className="trend-bar">
                        <div className="trend-label">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="trend-visual">
                          <div 
                            className="trend-fill"
                            style={{ 
                              height: `${Math.max(5, (day.focusTime / 120) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <div className="trend-value">{day.focusTime}m</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            {sessions.length > 0 && (
              <div className="recent-sessions">
                <h3>Recent Sessions</h3>
                <div className="sessions-list">
                  {sessions.map((session, index) => (
                    <div key={session.id || index} className="session-item">
                      <div className="session-type">
                        {session.sessionType === 'POMODORO' ? '🍅' : '☕'} 
                        {session.sessionType.replace('_', ' ')}
                      </div>
                      <div className="session-details">
                        <div className="session-task">
                          {session.taskName || 'No task specified'}
                        </div>
                        <div className="session-info">
                          {formatDate(session.startTime)} • {formatDuration(session.actualDuration)}
                          {session.completed ? ' ✅' : ' ❌'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Options */}
            <div className="export-section">
              <h3>Export Data</h3>
              <div className="export-buttons">
                <button onClick={() => exportData('json')} className="export-btn">
                  Download JSON
                </button>
                <button onClick={() => exportData('csv')} className="export-btn">
                  Download CSV
                </button>
              </div>
            </div>
          </>
        )}

        {!stats?.totalSessions && (
          <div className="no-data">
            <h3>No data available</h3>
            <p>Start using the timer to see your analytics here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
