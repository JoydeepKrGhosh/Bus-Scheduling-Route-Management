// controllers/driverController.js  
const Driver = require('../models/driver.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign up driver  
exports.register = async (req, res) => {
    const { name, driver_id, license_number, phone_number, password } = req.body;

    try {
        // Checking if the driver already exists  
        const existingDriver = await Driver.findOne({ driver_id });
        if (existingDriver) {
            return res.status(400).json({ message: 'Driver already exists' });
        }

        // Hashing the password  
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new driver  
        const newDriver = new Driver({
            name,
            driver_id,
            license_number,
            phone_number,
            password: hashedPassword,
        });

        const savedDriver = await newDriver.save();

        res.status(201).json({
            message: 'Driver registered successfully',
            driver: { id: savedDriver._id, name: savedDriver.name },
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = async (req, res) => {  
    const { driver_id, password } = req.body;  

    try {  
        // Find the driver by driver_id  
        const driver = await Driver.findOne({ driver_id });  
        if (!driver) {  
            return res.status(404).json({ message: 'Driver not found' });  
        }  

        // Compare the password using bcrypt  
        const isMatch = await bcrypt.compare(password, driver.password);  
        if (!isMatch) {  
            return res.status(400).json({ message: 'Invalid credentials' });  
        }  

        // Generate a token  
        const token = jwt.sign({ id: driver._id, role: 'driver' }, process.env.JWT_SECRET, {  
            expiresIn: '24h',  
        });  

        // Set cookie options  
        const options = {  
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),  
            httpOnly: true,  
        };  

        // Send response with token and driver info  
        return res  
            .status(200)  
            .cookie('token', token, options)  
            .json({  
                success: true,  
                token,  
                driver: { id: driver._id, name: driver.name }  
            });  

    } catch (error) {  
        // Handle server error  
        return res.status(500).json({ message: 'Server error' });  
    }  
};

  // Logout driver
exports.logout = (req, res) => {  
    // Clear the cookie set during login  
    res.clearCookie('token', { httpOnly: true }); // Ensure the options match those used when setting the cookie  

    // Send a response indicating that the user has been logged out  
    return res.status(200).json({ message: 'Successfully logged out' });  
};