const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
//--------------SSL
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const rateLimit = require('express-rate-limit');
//===========END:SSL

dotenv.config();

const app = express();

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to all requests
app.use(limiter);


app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
/*
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

*/

//const userRoutes = require('./routes/userRoute');
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

//-------------- SSL Setup --------------
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'keys', 'privatekey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'keys', 'certificate.pem'))
};

// HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// Redirect HTTP traffic to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(8080, () => {
  console.log('HTTP Server running on port 80 and redirecting to HTTPS');
});
//=======================END: SSL Setup

//-------------- Helmet for Security Headers--------------
const helmet = require('helmet');
app.use(helmet());


//=======================END:  Helmet for Security Headers
