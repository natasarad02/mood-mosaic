import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import MoodMosaic from './MoodMosaic';
import MoodForm from './MoodForm';

function App() {
  return (
     <Router>
      <Routes>
        <Route path="/mosaic" element={<MoodMosaic />} />
         <Route path="/add-mood" element={<MoodForm />} />
        <Route
          path="/"
          element={
            <div className='homepage-div'>
              <div className='logo-div'>
              <img className='logo' src='mood-mosaic-logo-new.svg'/>
              </div>
              <div className='title-div'>
              <h1 className='title'>Welcome to the Mood Mosaic App</h1>
              <p className='text'>Mood Mosaic is a simple app for tracking your moods by date, turning them into a colorful visual mosaic to help you see and understand your emotional patterns over time.</p>
              <div className='buttons'>
              <button className='btn' href="/mosaic">View mosaic</button>
              <button className='btn' href="/add-mood">Add mood</button>
              </div>
          </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
