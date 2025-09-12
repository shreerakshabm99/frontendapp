import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import groupImage from '../assets/group.png'; // Import the image properly

function Home() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    navigate('/Login');
  };

  return (
    <div className="container">
      {showContent ? (
        <>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <div className="content-box">
            <h1>Welcome to sony!!!</h1>
            <h2>Congratulations 🥳🥳</h2>
            <h3>We have successfully completed our first GIT Collab project</h3>
            <img src={groupImage} alt="Group" className="group-image" />
          </div>
        </>
      ) : (
        <div className="logged-in-message">
          <h2>Successfully logged in</h2>
        </div>
      )}
    </div>
  );
}

export default Home;
