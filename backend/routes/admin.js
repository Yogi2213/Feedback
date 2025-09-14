const express = require('express');
const { userValidation, storeValidation, validate } = require('../utils/validation');
const { hashPassword } = require('../utils/auth');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../config/database');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('SYSTEM_ADMIN'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    // Get statistics
    const [
      totalUsers,
      totalStores,
      totalRatings,
      averageRating,
      recentUsers,
      recentStores,
      topRatedStores
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
      prisma.rating.aggregate({
        _avg: { rating: true }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.store.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          address: true,
          avgRating: true,
          createdAt: true,
          owner: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.store.findMany({
        take: 5,
        orderBy: { avgRating: 'desc' },
        select: {
          id: true,
          name: true,
          address: true,
          avgRating: true,
          _count: {
            select: {
              ratings: true
            }
          }
        }
      })
    ]);

    // Get user role distribution
    const userRoleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });

    res.json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalStores,
          totalRatings,
          averageRating: Math.round((averageRating._avg.rating || 0) * 100) / 100
        },
        userRoleDistribution,
        recentUsers,
        recentStores,
        topRatedStores
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/admin/users
// @desc    Create new user (Admin only)
// @access  Private (Admin)
router.post('/users', validate(userValidation.signup), async (req, res) => {
  try {
    const { name, email, password, address, role = 'NORMAL_USER' } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/admin/stores
// @desc    Create new store (Admin only)
// @access  Private (Admin)
router.post('/stores', validate(storeValidation.create), async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check if owner exists and is a store owner
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true, role: true }
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    if (owner.role !== 'STORE_OWNER') {
      return res.status(400).json({
        success: false,
        message: 'Owner must have STORE_OWNER role'
      });
    }

    // Check if store with email already exists
    const existingStore = await prisma.store.findUnique({
      where: { email }
    });

    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'Store with this email already exists'
      });
    }

    // Create store
    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        avgRating: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: { store }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin)
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be SYSTEM_ADMIN, NORMAL_USER, or STORE_OWNER'
      });
    }

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

    // Prevent admin from changing their own role
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics (Admin only)
// @access  Private (Admin)
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get analytics data
    const [
      userGrowth,
      storeGrowth,
      ratingGrowth,
      topRatedStores,
      mostActiveUsers,
      ratingDistribution
    ] = await Promise.all([
      // User growth over time
      prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),
      // Store growth over time
      prisma.store.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),
      // Rating growth over time
      prisma.rating.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),
      // Top rated stores
      prisma.store.findMany({
        take: 10,
        orderBy: { avgRating: 'desc' },
        select: {
          id: true,
          name: true,
          avgRating: true,
          _count: {
            select: {
              ratings: true
            }
          }
        }
      }),
      // Most active users (by rating count)
      prisma.user.findMany({
        take: 10,
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              ratings: true
            }
          }
        },
        orderBy: {
          ratings: {
            _count: 'desc'
          }
        }
      }),
      // Rating distribution
      prisma.rating.groupBy({
        by: ['rating'],
        _count: {
          rating: true
        },
        orderBy: {
          rating: 'asc'
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        period: `${period} days`,
        userGrowth,
        storeGrowth,
        ratingGrowth,
        topRatedStores,
        mostActiveUsers,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
