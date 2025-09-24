// HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
      <div className='homepage-div'>
              <div className='logo-div'>
              <img className='logo' src='mood-mosaic-logo-new.svg'/>
              </div>
              <div className='title-div'>
              <h1 className='title'>Welcome to the Mood Mosaic App</h1>
              <p className='text'>Mood Mosaic is a simple app for tracking your moods by date, turning them into a colorful visual mosaic to help you see and understand your emotional patterns over time.</p>
              <div className='buttons'>
              <button className='btn'  onClick={() => navigate("/mosaic")}>View mosaic</button>
              <button className='btn' onClick={() => navigate("/add-mood")}>Add mood</button>
              </div>
          </div>
            </div>
  );
}
