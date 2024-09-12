
// Middleware to redirect based on user role
const roleRedirect = (req, res, next) => {
  const { role } = req.user;

  if (role === 'admin') {
    res.redirect('/admin/dashboard');
  } else if (role === 'crew') {
    res.redirect('/crew/dashboard');
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

// Export the middleware function
export default roleRedirect;

// middleware/authMiddleware.js  
const jwt = require('jsonwebtoken');  

const authMiddleware = (roleRequired) => {  
    return (req, res, next) => {  
        const token = req.headers['authorization']?.split(' ')[1]; // Extracting token from "Bearer token"  

        if (!token) {  
            return res.status(401).json({ message: 'Access denied, no token provided.' });  
        }  

        try {  
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  
            req.user = decoded; // Store decoded token info in request object  

            // Role-based access control  
            if (roleRequired && req.user.role !== roleRequired) {  
                return res.status(403).json({ message: 'Access denied, you do not have permission for this resource.' });  
            }  

            next(); // Proceed to the next middleware or route handler  
        } catch (error) {  
            res.status(400).json({ message: 'Invalid token.' });  
        }  
    };  
};  

module.exports = authMiddleware;