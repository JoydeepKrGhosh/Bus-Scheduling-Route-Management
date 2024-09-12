// controllers/conductorController.js  
const Conductor = require('../models/conductor.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign up conductor  
exports.register = async (req, res) => {
    const { name, conductor_id, phone_number, password } = req.body;

    try {
        // Checking if the conductor already exists  
        const existingConductor = await Conductor.findOne({ conductor_id });
        if (existingConductor) {
            return res.status(400).json({ message: 'Conductor already exists' });
        }

        // Hashing the password  
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new conductor  
        const newConductor = new Conductor({
            name,
            conductor_id,
            phone_number,
            password: hashedPassword,
        });

        const savedConductor = await newConductor.save();

        res.status(201).json({
            message: 'Conductor registered successfully',
            conductor: { id: savedConductor._id, name: savedConductor.name },
        });
        console.log('Conductor registered successfully');

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Server error' });
    }
};

// Login conductor  
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