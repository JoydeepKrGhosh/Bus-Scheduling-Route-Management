// controllers/conductorController.js  
const Conductor = require('../models/conductor.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

// Controller to register a conductor
const registerConductor = async (req, res) => {
  const { name, conductor_id, phone_number, password, employeeCode } = req.body;

  try {
    // Check if conductor_id, phone_number, or employeeCode already exists
    const existingConductor = await Conductor.findOne({
      $or: [
        { employeeCode },
        { phone_number }
      ]
    });

    if (existingConductor) {
      return res.status(400).json({
        message: 'Conductor with this conductor ID, phone number, or employee code already exists.'
      });
    }
    const employeeCodeFinal = conductor_id ? conductor_id : employeeCode;
    if (employeeCodeFinal.length !== 6) {
      return res.status(400).json({ message: 'Employee code must be exactly 6 characters.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new conductor instance without requiring referenceImageUrl
    const newConductor = new Conductor({
      name,
      conductor_id: employeeCodeFinal,
      phone_number,
      password: hashedPassword,
      employeeCode
    });

    // Save the conductor to the database
    await newConductor.save();

    res.status(201).json({
      message: 'Conductor registered successfully',
      conductor: {
        name: newConductor.name,
        conductor_id: newConductor.conductor_id,
        phone_number: newConductor.phone_number,
        employment_date: newConductor.employment_date,
        employeeCode: newConductor.employeeCode,
        availability: newConductor.availability,
        verificationStatus: newConductor.verificationStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering conductor', error: error.message });
  }
};


const getAllConductors = async (req, res) => {
  try {
    // Fetch all conductors from the database
    const conductors = await Conductor.find();

    // Return the conductors as a response
    res.status(200).json(conductors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conductors', error: error.message });
  }
};

module.exports = {
  registerConductor,
  getAllConductors
};


// Login conductor 
/* 
exports.login = async (req, res) => {
    const { conductor_id, password } = req.body;

    try {
        const conductor = await Conductor.findOne({ conductor_id });
        if (!conductor) {
            return res.status(404).json({ message: 'Conductor not found' });
        }

        const isMatch = await bcrypt.compare(password, conductor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: conductor._id, role: 'conductor' }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
        const options = {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            httpOnly: true
        };
        res.status(200).cookie('token', token, options).json({
            success: true,
            token,
            conductor
        });

        res.json({ token, conductor: { id: conductor._id, name: conductor.name } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout conductor  
exports.logout = (req, res) => {
    // Clear the authentication cookie  
    res.clearCookie('token', { httpOnly: true }); // Ensure to use the same options set during login  
    return res.status(200).json({ message: 'Successfully logged out' });
};

*/