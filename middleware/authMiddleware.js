import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Utility function for JWT verification
const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw new Error(error.message || 'Invalid token');
  }
};

// Role-based Authentication Middleware
const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : req.cookies?.jwt;

      if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing or invalid' });
      }

      const user = await verifyToken(token);
      req.user = user;

      // Role-based authorization
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      return res.status(401).json({ message: error.message || 'Authentication failed' });
    }
  }
}

// Protect Route Middleware (same as authMiddleware but without role checks)
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized Access!' });
    }

    const user = await verifyToken(token);
    req.user = user;

    next();
  } catch (error) {
    console.error('Protect Route Error:', error.message);
    return res.status(401).json({ message: error.message || 'Authentication failed' });
  }
};

export { authMiddleware, protectRoute };
