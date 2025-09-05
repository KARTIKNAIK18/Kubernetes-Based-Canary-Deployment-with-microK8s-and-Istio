
<<<<<<< HEAD
import './styles/App.css';
import Header from './components/Header';
import Timer from './components/Timer';
import Footer from './components/Footer';

function App() {
=======
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

>>>>>>> dev
  return (
    <div className="app-container">
      <div className="content-grid">
        <div className="main-content">
<<<<<<< HEAD
          <Header />
          <Timer />
=======
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {renderCurrentPage()}
>>>>>>> dev
          <div className="decorative-element"></div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
