const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
    }
};

module.exports = connectDB;
