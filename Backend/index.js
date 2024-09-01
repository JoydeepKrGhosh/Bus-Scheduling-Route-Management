const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const dotenv = require('dotenv');

const connectDB = require('./src/Db.js');
dotenv.config(); // Specify the path to your .env file  

const app = express();

// Basic API   
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to backend server',
        success: true
    })
});


//Middlewares  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173', // Corrected origin  
    credentials: true,
}
app.use(cors(corsOptions));


// Connect to MongoDB  
connectDB().then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful database connection  
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server is Running at port: ${PORT}`));
});