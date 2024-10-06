import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Link } from 'react-router-dom';

import App from './App.jsx'
import './App.css'; 
import backgroundImage from './assets/nasabackground.jpg';
import logo from './assets/PayGlobeLogo.png';

function Main() {
  const mainStyle = {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100%',
      //added
      display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
  };

  return (
      <div style={mainStyle}>
        <img 
                src={logo} 
                alt="PayGlobe Logo" 
                style={{ width: '200px', marginBottom: '50px' }} // Adjust size and spacing as needed
            />
          <h1 className="welcome-text">Welcome to PayGlobe</h1>
          <p className="slogan">Your Global Payment Solution</p> {/* Slogan */}
            <p className="description">
                PayGlobe offers a seamless way to make international payments, 
                ensuring your transactions are secure, fast, and efficient. 
                Join us today and experience hassle-free global transactions.
            </p> 
            
          <App />
          <Link to="/register">
    <button className="get-started-btn">Get Started</button>
</Link>

          
      </div>
  );
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Main />
  </StrictMode>,
);

/*
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <p>PayGlobe</p>
  </StrictMode>,
)
*/