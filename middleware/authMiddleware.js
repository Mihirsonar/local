// import jwt from 'jsonwebtoken';
// import User from "../models/User";

// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     try {
//       // Extract token from Authorization header
//       const authHeader = req.headers.authorization;
//       if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Authentication token is missing or invalid' });
//       }

//       const token = authHeader.split(' ')[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded; 

//       // Role-based access control
//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: 'Access denied: insufficient permissions' });
//       }

//       next(); 
//     } catch (error) {
//       console.error('Authentication error:', error.message);
//       return res.status(401).json({ message: 'Authentication failed' });
//     }
//   };
// };

// export default authMiddleware;

// export const protectRoute =async (req,res,next) =>{
//   try {
//       const token = req.cookies.jwt;

//       if(!token){
//           return res.status(401).json({message:"Unauthorized Access!"});
//       }

//       const decoded= jwt.verify(token,process.env.JWT_SECRET);

//       if(!decoded){
//           return res.status(401).json({message:"Unauthorized Token!"});
//       }

//       const user = await User.findById(decoded.userId).select("-password");

//       if(!user){
//           return res.status(404).json({message:"User not found!"});
//       }

//       req.user = user;

//       next();
      
//   } catch (error) {
//       console.error("Protect Route Error: ",error);
//       return res.status(500).json({message:"Internal Server Error!"});    
      
//   }

// }

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
  };
};

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
