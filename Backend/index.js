const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');



const conductorRoutes = require('./src/routes/conductorRoutes.js');
const driverRoutes = require('./src/routes/driverRouter.js');

//const uploadReferenceImage = require('./src/routes/uploadreferenceimage.routes.js')
const awsimage = require('./src/routes/awsimage.routes.js')

const connectDB = require('./src/Db.js');
const errorHandler = require('./src/middlewares/errorHandler.js');
dotenv.config(); // Load environment variables from .env file

const app = express();



// Middleware for file uploads
app.use(fileUpload({
    useTempFiles: true, // Optional: Use temporary files to store large uploads
    tempFileDir: '/tmp/' // Optional: Specify temp directory
  }));
  
  // Middleware to handle JSON and form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB  
connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server is Running at port: ${PORT}`));
});


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

// Middleware to handle JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware  
app.use(errorHandler); // Catch-all for errors

const corsOptions = {
    origin: 'http://localhost:5173', // Corrected origin  
    credentials: true,
}
app.use(cors(corsOptions));




// Routes  
app.use('/api/conductors', conductorRoutes);
app.use('/api/drivers', driverRoutes);

//Test
app.use('/api/awsimage',awsimage);


