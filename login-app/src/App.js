
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import login from './components/login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<login />} />
        {/* <Route path="/home" element={<Home />} />/ */}
      </Routes>
    </Router>
  );
}
