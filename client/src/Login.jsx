import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

function Login() {
    const [identifier, setIdentifier] = useState(""); // For username or account number
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

//-----------RegEx Input Whitelisting
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/; // Username: alphanumeric, 3-30 chars
    const accountNumberRegex = /^\d{10}$/; // Account number: 10 digits
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//===========END: RegEx Input Whitelisting    

    const handleSubmit = async (e) => {
        e.preventDefault();
//-----------RegEx Input Whitelisting  
        const isUsernameValid = usernameRegex.test(identifier);
        const isAccountNumberValid = accountNumberRegex.test(identifier);

        if (!isUsernameValid && !isAccountNumberValid) {
            setError("Identifier must be a valid username or account number.");
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long and contain at least one letter and one number.");
            return;
        }          

//===========END: RegEx Input Whitelisting 
        try {
            const result = await axios.post('http://localhost:5000/api/login', {
                identifier, // Either username or account number
                password
            });
            console.log(result.data);
            // Handle successful login, e.g., redirect to a dashboard
        } catch (error) {
            console.error(error);
            setError("Error logging in. Please check your credentials.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="identifier"><strong>Username or Account Number</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Username or Account Number"
                            autoComplete="off"
                            name="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Login
                    </button>
                </form>
                <p>Don't Have an Account?</p>
                <Link to="/signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Signup
                </Link>
            </div>
        </div>
    );
}

export default Login;
