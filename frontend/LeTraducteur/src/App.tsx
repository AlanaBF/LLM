import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Learn from './components/Learn';
import Practice from './components/Practice';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col">
        <Routes>
          <Route path="/translate" element={<Chatbot />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/" element={<Navigate to="/translate" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
