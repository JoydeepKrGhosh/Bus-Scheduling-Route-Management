const jwt = require('jsonwebtoken');

// Middleware to authenticate drivers
const authenticateDriver = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the authorization header

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.driver = decoded; // Attach driver info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateDriver;