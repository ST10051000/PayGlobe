const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//-------------------------- Whitelist all input using RegEx patterns. 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
const idNumberRegex = /^\d{13}$/;
const accountNumberRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;




//-------------------------- POST request to handle signup
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, username, idNumber, accountNumber, password} = req.body;
    console.log("Received signup request:", req.body);

//-------------Adding input validation
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }  
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: 'Username must be alphanumeric and between 3-30 characters' });
    }
    if (!idNumberRegex.test(idNumber)) {
        return res.status(400).json({ error: 'ID number must be 13 digits' });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one letter and one number' });
    }     
//=============END: Adding input validation    
    try {
        // Check if the account number is unique
        const existingUser = await User.findOne({ accountNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'Account number already exists' });
        }
         // Hash password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         
        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            idNumber,
            accountNumber,
            password: hashedPassword
        });
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).json({ error: 'Error registering user' });
    }
});
//==============================END POST request to handle signup
//-------------------------------POST request to handle login
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

//-------------Adding input validation   
    const isUsernameValid = usernameRegex.test(identifier);
    const isAccountNumberValid = accountNumberRegex.test(identifier);
//=============END: Adding input validation 
    if (!isUsernameValid && !isAccountNumberValid) {
        return res.status(400).json({ error: 'Identifier must be a valid username or account number' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Invalid password format' });
    }


    try {
        if (!identifier || !password) {
            return res.status(400).json({ error: 'Both identifier and password are required' });
        }

        // Find user by either username or account number
        const user = await User.findOne({
            $or: [{ username: identifier }, { accountNumber: identifier }]
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or account number' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // If login is successful, send a success response
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in. Please try again.' });
    }
});
//========================================END: POST request to handle login

module.exports = router;
