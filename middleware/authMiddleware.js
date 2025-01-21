import jwt from 'jsonwebtoken';

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token is missing or invalid' });
      }

      const token = authHeader.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 

      // Role-based access control
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      next(); 
    } catch (error) {
      console.error('Authentication error:', error.message);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
};

export default authMiddleware;
