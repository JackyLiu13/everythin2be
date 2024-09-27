import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Adjust the path as necessary
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<Home />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
