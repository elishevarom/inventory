
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Inventory from './pages/Inventory';

function App() {
  return (
    <Router>
      <SiteHeader />
      <main className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;