const express = require('express');
const { hashPassword, comparePassword } = require('../utils/auth');
const { userValidation, queryValidation, validate } = require('../utils/validation');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../config/database');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', 
  authenticate, 
  authorize('SYSTEM_ADMIN'), 
  validate(queryValidation.pagination, 'query'),
  validate(queryValidation.search, 'query'),
  async (req, res) => {
    try {
      const { page, limit, sortBy, sortOrder, search, role } = req.query;
      const skip = (page - 1) * limit;

      // Build where clause
      const where = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } }
        ];
      }
      if (role) {
        where.role = role;
      }

      // Get users with pagination
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
            createdAt: true,
            _count: {
              select: {
                ownedStores: true,
                ratings: true
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        prisma.user.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Users can only view their own profile unless they're admin
    if (userRole !== 'SYSTEM_ADMIN' && id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own profile.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            ownedStores: true,
            ratings: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', 
  authenticate, 
  validate(userValidation.updateProfile), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Users can only update their own profile unless they're admin
      if (userRole !== 'SYSTEM_ADMIN' && id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own profile.'
        });
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(address && { address })
        },
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
          updatedAt: true
        }
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// @route   PUT /api/users/:id/password
// @desc    Update user password
// @access  Private
router.put('/:id/password', 
  authenticate, 
  validate(userValidation.updatePassword), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Users can only update their own password unless they're admin
      if (userRole !== 'SYSTEM_ADMIN' && id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own password.'
        });
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, password: true }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password (unless admin)
      if (userRole !== 'SYSTEM_ADMIN') {
        const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword }
      });

      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      console.error('Update password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', 
  authenticate, 
  authorize('SYSTEM_ADMIN'), 
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent admin from deleting themselves
      if (id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'You cannot delete your own account'
        });
      }

      // Delete user (cascade will handle related records)
      await prisma.user.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

module.exports = router;
