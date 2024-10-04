const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user info
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Assuming token is in the 'Authorization' header

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid.' });
  }

  try {
    const decoded = jwt.verify(token, 'yourSecretKey');  // Replace 'yourSecretKey' with your secret
    req.user = decoded;  // Assuming decoded JWT contains user info, e.g., { id, email }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateJWT;
