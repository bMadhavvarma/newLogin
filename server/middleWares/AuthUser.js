const jwt = require('jsonwebtoken');
require('dotenv').config();

const AuthUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ success: false, message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { AuthUser };
