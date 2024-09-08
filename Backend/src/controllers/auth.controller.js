const bcrypt = require('bcrypt'); // Import bcrypt for password hashing and comparison
const User = require('../models/user.model.js');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).populate('driver').populate('conductor');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    // Handle first login flow (if applicable)
    if (user.isFirstLogin) {
      // Update user's first login status and set an initial password
      user.isFirstLogin = false;
      user.password = await bcrypt.hash(newPassword, 10); // Replace 'newPassword' with a generated strong password
      await user.save();
    }

    // Return response based on user role
    if (user.role === 'driver') {
      res.json({ msg: 'Login successful', user, driver: user.driver });
    } else if (user.role === 'conductor') {
      res.json({ msg: 'Login successful', user, conductor: user.conductor });
    } else if (user.role === 'admin') {
      res.json({ msg: 'Login successful', user });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export default loginUser;