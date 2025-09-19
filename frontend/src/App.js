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
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <h1>Welcome to Mood Mosaic App</h1>
              <p>Go to <a href="/mosaic">mosaic</a> to see the mood board</p>
                 <p>Or <a href="/add-mood">create a new mood</a></p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
