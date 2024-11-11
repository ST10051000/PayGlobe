import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Signup.css'; // Import the new CSS file

function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Validation Regex Patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    const idNumberRegex = /^\d{13}$/; // Assuming an ID number is 13 digits
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
            setError("Invalid email format");
            return;
        }      
        if (!usernameRegex.test(username)) {
            setError("Username must be alphanumeric and between 3-30 characters");
            return;
        }   
        if (!idNumberRegex.test(idNumber)) {
            setError("ID number must be 13 digits");
            return;
        }
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long, with at least one letter and one number");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const result = await axios.post('http://localhost:5000/api/signup', {
                firstName,
                lastName,
                email,
                username,
                idNumber,
                accountNumber,
                password
            });
            console.log(result.data);
            alert("User registered successfully!");

            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);

            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setError("Error registering user. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        placeholder="Enter First Name"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        placeholder="Enter Last Name"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="idNumber">ID Number</label>
                    <input
                        type="text"
                        placeholder="Enter ID Number"
                        name="idNumber"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="accountNumber">Account Number</label>
                    <input
                        type="text"
                        placeholder="Enter Account Number"
                        name="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control"
                    />
                </div>

                {error && <p className="text-danger">{error}</p>}

                <button type="submit" className="btn btn-success w-100">
                    Register
                </button>

            </form>

            <p>Already Have an Account?</p>
            <Link to="/login" className="btn btn-default w-100">
                Login
            </Link>
        </div>
    );
}

export default Signup;
