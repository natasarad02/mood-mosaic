import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import MoodMosaic from './MoodMosaic';
import MoodForm from './MoodForm';
import { useNavigate } from "react-router-dom";
import HomePage from './HomePage';
function App() {


  return (
     <Router>
      <Routes>
        <Route path="/mosaic" element={<MoodMosaic />} />
         <Route path="/add-mood" element={<MoodForm />} />
        <Route
          path="/"
          element={<HomePage/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
