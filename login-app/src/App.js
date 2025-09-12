
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import login from './components/login';

export default function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Login" element={<Login />}/>
=======
        <Route path="/" element={<login />} />
        {/* <Route path="/home" element={<Home />} />/ */}
>>>>>>> 0b298e9fa9322e8949dd20c926052f7cfae5d445
      </Routes>
    </Router>
  );
}
