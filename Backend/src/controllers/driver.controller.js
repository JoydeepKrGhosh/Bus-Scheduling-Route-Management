const Driver = require('../models/driver.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register driver
exports.register = async (req, res) => {
  const { name, driver_id, license_number, phone_number, password, employeeCode } = req.body;

  try {
    // Checking if the driver already exists
    const existingDriver = await Driver.findOne({ driver_id });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensuring employeeCode is exactly 6 characters, or auto-fill with driver_id if not provided
    const employeeCodeFinal = driver_id ? driver_id : employeeCode;
    if (employeeCodeFinal.length !== 6) {
      return res.status(400).json({ message: 'Employee code must be exactly 6 characters.' });
    }

    // Creating a new driver
    const newDriver = new Driver({
      name,
      driver_id: employeeCodeFinal,
      license_number,
      phone_number,
      password: hashedPassword,
      employeeCode, // Set employeeCode here
    });

    // Saving the driver to the database
    const savedDriver = await newDriver.save();

    // Respond with success and driver info
    res.status(201).json({
      message: 'Driver registered successfully',
      driver: { id: savedDriver._id, name: savedDriver.name, employeeCode: savedDriver.employeeCode },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};






exports.getAllDrivers = async (req, res) => {
  try {
    // Fetch all conductors from the database
    const drivers = await Driver.find();

    // Return the conductors as a response
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conductors', error: error.message });
  }
};






// Driver Login Controller
exports.login = async (req, res) => {
  const { driver_id, password } = req.body;

  try {
    // Check if the driver exists
    console.log("Checking if driver_id exists:", driver_id);
    const driver = await Driver.findOne({ driver_id });
    if (!driver) {
      console.log("Driver not found.");
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Check if the password is correct
    console.log("Checking password...");
    const isPasswordCorrect = await bcrypt.compare(password, driver.password);
    if (!isPasswordCorrect) {
      console.log("Incorrect password.");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    console.log("Generating JWT token...");
    const token = jwt.sign(
      { id: driver._id, driver_id: driver.driver_id, name: driver.name },
      process.env.JWT_SECRET, // Use your secret key from environment variables
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the token and driver details
    res.status(200).json({
      message: 'Login successful',
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        driver_id: driver.driver_id,
      },
    });

    console.log("Login successful for driver:", driver.driver_id);
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Driver Logout Controller
exports.logout = (req, res) => {
  try {
    // Client is expected to handle token removal, so just send a success message
    res.status(200).json({ message: 'Logout successful' });

    console.log("Driver logged out successfully.");
  } catch (error) {
    console.log("Error during logout:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
