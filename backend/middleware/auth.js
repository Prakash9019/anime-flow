// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    console.log("Auth middleware called");
   const token = req.header('X-User-Auth')?.replace('Bearer ', ''); 
    console.log("Token from header:", token);
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    console.log("hellooooooohiiiiiii")
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    console.log(process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
