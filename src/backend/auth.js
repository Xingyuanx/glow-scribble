const jwt = require('jsonwebtoken');

const SECRET_KEY = 'glow_scribble_secret_key_2024'; // In production, use environment variable

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // { id: userId, username: username }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};

module.exports = { authMiddleware, SECRET_KEY };
