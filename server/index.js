const dotenv = require('dotenv');
// Load environment variables from .env
dotenv.config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const path = require('path'); // Added path helper
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const couponRoutes = require('./routes/couponRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Debug line to see if Node is actually reading the URI 
console.log("Checking loaded URI:", process.env.MONGODB_URI ? "Found! " : "NOT FOUND (Undefined) ");

const app = express();

// Connect to MongoDB Atlas
connectDB();
app.use(cors());
// a simple test route to make sure the server is alive
app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from the Robotics Backend Server! " });
});

app.use(express.json()); // allows server to read JSON bodies

// Use the authentication routes
app.use('/api/auth', authRoutes);
// Use the product routes
app.use('/api/products', productRoutes);
// Use the category routes
app.use('/api/categories', categoryRoutes);
// Use the cart routes
app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reviews', reviewRoutes);

// listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});