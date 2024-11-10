import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard'; // Adjust path if necessary
import Payment from './Payment';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// HomePage Component
function HomePage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h1 className="mb-4">Welcome to PayGlobe</h1>
      <p className="mb-4">Your one-stop platform for secure payments worldwide.</p>
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
