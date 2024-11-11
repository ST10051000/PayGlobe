import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Importing App.css for styling
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
import Payment from './Payment';

// HomePage Component
function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to PayGlobe</h1>
      <p>Your one-stop platform for secure payments worldwide.</p>
      <div>
        <Link to="/register" className="btn btn-primary me-2">Register</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payments" element={<Payment />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
