const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        // Wrap the await statement in parentheses  
        await (mongoose.connect(process.env.MONGO_URI));
        console.log("mongoDB connected successfully");
    } catch (e) {
        console.log("mongoDB connection error");
        console.error(e); // Add this line to log the error details  
    }
};

module.exports = connectDB;