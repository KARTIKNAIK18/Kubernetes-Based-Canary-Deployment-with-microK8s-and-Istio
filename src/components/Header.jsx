import { useState, useEffect } from 'react';
import '../styles/Header.css';

const Header = ({ currentPage, setCurrentPage }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const sessionId = localStorage.getItem('sessionId');
    const savedUser = localStorage.getItem('user');
    if (sessionId && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setShowLogin(false);
        setLoginForm({ email: '', password: '' });
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check if the user service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3002/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setShowLogin(false);
        setSignupForm({ name: '', email: '', password: '' });
        setIsSignup(false);
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please check if the user service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('timer');
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="navigation">
            <button 
              className={`nav-btn ${currentPage === 'timer' ? 'active' : ''}`}
              onClick={() => setCurrentPage('timer')}
            >
              Timer
            </button>
            {user && (
              <button 
                className={`nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
                onClick={() => setCurrentPage('analytics')}
              >
                Analytics
              </button>
            )}
          </div>

          <div className="title-section">
            <h1 className="main-title">FOCUS</h1>
            <p className="subtitle">Pomodoro Timer</p>
          </div>

          <div className="user-section">
            {user ? (
              <div className="user-info">
                <span className="user-name">Hello, {user.name}!</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                <span className="login-icon">👤</span>
                Login
              </button>
            )}
          </div>
        </div>
        
        <div className="decorative-line"></div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
              <button className="close-btn" onClick={() => setShowLogin(false)}>×</button>
            </div>
            
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="auth-form">
              {isSignup && (
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={isSignup ? signupForm.email : loginForm.email}
                  onChange={(e) => isSignup 
                    ? setSignupForm({...signupForm, email: e.target.value})
                    : setLoginForm({...loginForm, email: e.target.value})
                  }
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={isSignup ? signupForm.password : loginForm.password}
                  onChange={(e) => isSignup 
                    ? setSignupForm({...signupForm, password: e.target.value})
                    : setLoginForm({...loginForm, password: e.target.value})
                  }
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
              </button>
            </form>
            
            <div className="auth-switch">
              <p>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
                <button 
                  type="button" 
                  className="switch-btn"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? 'Login' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
