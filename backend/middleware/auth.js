const jwt = require('jsonwebtoken');
require('dotenv').config();  
 // Make sure to install jsonwebtoken package

 const authMiddleware = (req, res, next) => {
  console.log('Auth Middleware - Headers:', req.headers); // Log all headers

  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader); // Log the specific auth header

  if (!authHeader) {
    console.log('No Authorization header present');
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Token not found in Authorization header');
    return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Log the decoded token
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ message: 'Forbidden - Invalid token' });
  }
};

module.exports = authMiddleware;
