// import './App.css'

import React from 'react';
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col">
        <Chatbot />
      </div>
      <Footer />
    </div>
  );
}

export default App;
