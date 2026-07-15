const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Added path helper
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();
// Debug line to see if Node is actually reading the URI 
console.log("Checking loaded URI:", process.env.MONGODB_URI ? "Found! " : "NOT FOUND (Undefined) ");
const app = express();
// Connect to MongoDB Atlas
connectDB();
// a simple test route to make sure the server is alive
app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from the Robotics Backend Server! " });
});
// listening for requests on port
app.use(express.json()); // allows server to read JSON bodies
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});