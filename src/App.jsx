import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing the components we created in the components folder
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* This sets the Login page as the default (index) page */}
          <Route path="/" element={<Login />} />
          
          {/* This defines the /home route for the dashboard */}
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;