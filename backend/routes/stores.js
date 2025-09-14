const express = require('express');
const { storeValidation, queryValidation, validate } = require('../utils/validation');
const { authenticate, authorize, canAccessStore } = require('../middleware/auth');
const prisma = require('../config/database');

const router = express.Router();

// @route   GET /api/stores
// @desc    Get all stores
// @access  Private
router.get('/', 
  authenticate, 
  validate(queryValidation.pagination, 'query'),
  validate(queryValidation.search, 'query'),
  async (req, res) => {
    try {
      const { page, limit, sortBy, sortOrder, search } = req.query;
      const skip = (page - 1) * limit;
      const userId = req.user.id;

      // Build where clause
      const where = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Get stores with pagination
      const [stores, total] = await Promise.all([
        prisma.store.findMany({
          where,
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
            },
            ratings: {
              where: { userId },
              select: {
                rating: true,
                comment: true
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        prisma.store.count({ where })
      ]);

      // Add user's rating to each store
      const storesWithUserRating = stores.map(store => ({
        ...store,
        userRating: store.ratings.length > 0 ? store.ratings[0].rating : null,
        userComment: store.ratings.length > 0 ? store.ratings[0].comment : null,
        ratings: undefined // Remove ratings array from response
      }));

      res.json({
        success: true,
        data: {
          stores: storesWithUserRating,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get stores error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// @route   GET /api/stores/:id
// @desc    Get store by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const store = await prisma.store.findUnique({
      where: { id },
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
        },
        ratings: {
          where: { userId },
          select: {
            rating: true,
            comment: true
          }
        }
      }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Add user's rating
    const storeWithUserRating = {
      ...store,
      userRating: store.ratings.length > 0 ? store.ratings[0].rating : null,
      userComment: store.ratings.length > 0 ? store.ratings[0].comment : null,
      ratings: undefined
    };

    res.json({
      success: true,
      data: { store: storeWithUserRating }
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/stores
// @desc    Create new store (Admin only)
// @access  Private (Admin)
router.post('/', 
  authenticate, 
  authorize('SYSTEM_ADMIN'), 
  validate(storeValidation.create), 
  async (req, res) => {
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
  }
);

// @route   PUT /api/stores/:id
// @desc    Update store
// @access  Private (Admin or Store Owner)
router.put('/:id', 
  authenticate, 
  canAccessStore, 
  validate(storeValidation.update), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, address } = req.body;

      // Check if store exists
      const existingStore = await prisma.store.findUnique({
        where: { id }
      });

      if (!existingStore) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      // Check if email is being changed and if new email already exists
      if (email && email !== existingStore.email) {
        const emailExists = await prisma.store.findUnique({
          where: { email }
        });

        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Store with this email already exists'
          });
        }
      }

      // Update store
      const updatedStore = await prisma.store.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(address && { address })
        },
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          avgRating: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Store updated successfully',
        data: { store: updatedStore }
      });
    } catch (error) {
      console.error('Update store error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// @route   DELETE /api/stores/:id
// @desc    Delete store (Admin only)
// @access  Private (Admin)
router.delete('/:id', 
  authenticate, 
  authorize('SYSTEM_ADMIN'), 
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if store exists
      const store = await prisma.store.findUnique({
        where: { id }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      // Delete store (cascade will handle related records)
      await prisma.store.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Store deleted successfully'
      });
    } catch (error) {
      console.error('Delete store error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// @route   GET /api/stores/owner/:ownerId
// @desc    Get stores by owner ID
// @access  Private
router.get('/owner/:ownerId', authenticate, async (req, res) => {
  try {
    const { ownerId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Users can only view their own stores unless they're admin
    if (userRole !== 'SYSTEM_ADMIN' && ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own stores.'
      });
    }

    const stores = await prisma.store.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        avgRating: true,
        createdAt: true,
        _count: {
          select: {
            ratings: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { stores }
    });
  } catch (error) {
    console.error('Get stores by owner error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
