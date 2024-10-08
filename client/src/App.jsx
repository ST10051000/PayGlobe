import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';  // Adjust path if necessary
import Payment from './Payment'; 

//import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from "./Login"

function App() {
  return (
    <Router>
            <Routes>
                <Route path="/register" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/payments" element={<Payment />} />
                {/* Other routes */}
            </Routes>
        </Router>
    /*
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        
      </Routes>
    </BrowserRouter>
    */
  )
}

export default App
