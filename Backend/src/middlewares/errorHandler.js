// middleware/errorHandler.js  
module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error  
    res.status(500).send({ message: 'Something went wrong!' });
};