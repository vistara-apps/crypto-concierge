import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';
import CheckoutDemo from './components/CheckoutDemo';
import APIDocumentation from './components/APIDocumentation';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<CheckoutDemo />} />
          <Route path="/docs" element={<APIDocumentation />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;