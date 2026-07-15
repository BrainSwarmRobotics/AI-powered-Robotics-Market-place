const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // This pulls your MONGO_URI string from the .env file
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Atlas Connected successfully!");
    } catch (error) {
        console.error("Database connection failed ", error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;