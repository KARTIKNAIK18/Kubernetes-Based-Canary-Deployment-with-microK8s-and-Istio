

import { useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import Timer from './components/Timer';
import Analytics from './components/Analytics';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('timer');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'analytics':
        return <Analytics />;
      case 'timer':
      default:
        return <Timer />;
    }
  };


  return (
    <div className="app-container">
      <div className="content-grid">
        <div className="main-content">

          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {renderCurrentPage()}
          <div className="decorative-element"></div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
