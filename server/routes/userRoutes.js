const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const Payoff = require('../models/payoff');

//------------Fix login
const jwt = require('jsonwebtoken'); 
//==============Fix login

//-------------------------- Whitelist all input using RegEx patterns. 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
const idNumberRegex = /^\d{13}$/;
const accountNumberRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;


//-------------PAYMENT
// Regex patterns for whitelisting input FOR 
const nameRegex = /^[a-zA-Z\s]+$/;
const bankRegex = /^[a-zA-Z\s]+$/;
const accountBankNumberRegex = /^\d{10}$/;
const amountRegex = /^\d+(\.\d{1,2})?$/;
const swiftCodeRegex = /^[A-Z0-9]{8,11}$/;
//===========END:PAYMENT

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
    console.log("Received login request with data:", req.body);

    try {
        let user;

        // Check if identifier is a valid account number or username
        if (/^\d{10}$/.test(identifier)) {
            console.log("Looking for user by account number:", identifier);
            user = await User.findOne({ accountNumber: identifier });
        } else {
            console.log("Looking for user by username:", identifier);
            user = await User.findOne({ username: identifier });
        }

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: 'User does not exist' });
        }

        // Verify password
        console.log("User found. Verifying password...");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        console.log("Password mismatch for user:", user.username);
        console.log("Password comparison result:", isMatch);
        return res.status(400).json({ message: 'Invalid credentials' });
        }


        // Login successful
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Login successful");
        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error("Error during login process:", error);
        res.status(500).json({ message: 'Error checking user', error });
    }
});

//========================================END: POST request to handle login

//---------- Payment 
router.post('/payment', async (req, res) => {
    const {  recipientName, recipientBank, recipientAccount, amount, swiftCode  } = req.body;

    if (!nameRegex.test(recipientName)) {
        return res.status(400).json({ error: 'Invalid recipient name' });
    }
    if (!bankRegex.test(recipientBank)) {
        return res.status(400).json({ error: 'Invalid bank name' });
    }
    if (!accountBankNumberRegex.test(recipientAccount)) {
        return res.status(400).json({ error: 'Account number must be 10 digits' });
    }
    if (!amountRegex.test(amount)) {
        return res.status(400).json({ error: 'Invalid amount format. Use 0.00 for decimal.' });
    }
    if (!swiftCodeRegex.test(swiftCode)) {
        return res.status(400).json({ error: 'Invalid SWIFT code. Must be 8 to 11 characters.' });
    }
    try {
        // Create a new payoff record
        const payment = new Payoff({
            recipientName,
            recipientBank,
            recipientAccount,
            amount,
            swiftCode,
        });

        // Save payment to the database
        await payment.save();

        res.status(201).json({ message: 'Payment recorded successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error recording payment', error });
    }



});

//============END: Payment 

// Endpoint to check if a user exists
router.post('/check-user', async (req, res) => {
    const { accountNumber, username  } = req.body;

    try {
        let user;

        // Check if either email or userId is provided
        if (accountNumber) {
            user = await User.findOne({ accountNumber });
        } else if (username ) {
            user = await User.findById(username );
        }

        // Respond accordingly
        if (user) {
            res.status(200).json({ message: 'User exists', user });
        } else {
            res.status(404).json({ message: 'User does not exist' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking user', error });
    }
});

module.exports = router;
