
import './styles/App.css';
import Header from './components/Header';
import Timer from './components/Timer';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <div className="content-grid">
        <div className="main-content">
          <Header />
          <Timer />
          <div className="decorative-element"></div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
