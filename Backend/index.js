const express = require('express');
const fileUpload = require('express-fileupload'); // Import file upload middleware
const cookieParser = require('cookie-parser');
const cors = require("cors");
const dotenv = require('dotenv');
const app = express();

const path = require('path');
const fs = require('fs');

const tripAssignmentRoutes = require('./src/routes/assigntrip.routes.js');
const filtertrips = require('./src/routes/getTrips.routes.js')
const busdata = require('./src/routes/getAllBuses.routes.js')
const busRoutes = require('./src/routes/addbus.routes.js') 
const conductorRoutes = require('./src/routes/conductorRoutes.js');
const driverRoutes = require('./src/routes/driverRouter.js');

const awsimage = require('./src/routes/awsimage.routes.js');
const routegenerate = require('./src/routes/busroutegenerate.routes.js')
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp')
}));

// Middleware for creating tmp directory if it doesn't exist
const tmpDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}
    // Middleware to handle JSON and form data
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  
const connectDB = require('./src/Db.js');
const errorHandler = require('./src/middlewares/errorHandler.js');
dotenv.config(); // Load environment variables from .env file


  
  

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
app.use(cookieParser());


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
app.use('/api/busroute',routegenerate);

app.use('/api/buses', busRoutes);
app.use('/api/busdata',busdata);

app.use('/api/trip', tripAssignmentRoutes);
app.use('/api/filtertrip',filtertrips);







