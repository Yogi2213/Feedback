const { verifyToken } = require('../utils/auth');
const prisma = require('../config/database');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Check if user can access store (owner or admin)
const canAccessStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Admin can access any store
    if (userRole === 'SYSTEM_ADMIN') {
      return next();
    }

    // Check if user is the store owner
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { ownerId: true }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.'
      });
    }

    if (store.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own stores.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking store access.'
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  canAccessStore
};
