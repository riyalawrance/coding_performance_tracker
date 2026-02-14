import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing the components we created in the components folder
import Login from './components/Login';
import Home from './components/Home';
import Results from './components/Results';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default page is Login */}
          <Route path="/" element={<Login />} />
          
          {/* Dashboard/Upload page */}
          <Route path="/home" element={<Home />} />

          {/* NEW: Results page to display Groq output */}
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;