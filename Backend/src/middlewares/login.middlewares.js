


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