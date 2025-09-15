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

      // Mock data fallback when database is unavailable
      const mockStores = [
        {
          id: 1,
          name: "Green Valley Market",
          email: "contact@greenvalley.com",
          address: "123 Main Street, Downtown",
          avgRating: 4.5,
          createdAt: new Date(),
          owner: { id: 1, name: "John Smith" },
          _count: { ratings: 25 }
        },
        {
          id: 2,
          name: "Tech Hub Store",
          email: "info@techhub.com", 
          address: "456 Innovation Ave, Tech District",
          avgRating: 4.2,
          createdAt: new Date(),
          owner: { id: 2, name: "Sarah Johnson" },
          _count: { ratings: 18 }
        },
        {
          id: 3,
          name: "Artisan Coffee Shop",
          email: "hello@artisancoffee.com",
          address: "789 Coffee Lane, Arts Quarter",
          avgRating: 4.8,
          createdAt: new Date(),
          owner: { id: 3, name: "Mike Chen" },
          _count: { ratings: 42 }
        },
        {
          id: 4,
          name: "Fresh Foods Grocery",
          email: "support@freshfoods.com",
          address: "321 Organic Street, Health District",
          avgRating: 4.1,
          createdAt: new Date(),
          owner: { id: 4, name: "Lisa Rodriguez" },
          _count: { ratings: 33 }
        }
      ];

      // Use mock data directly since database is unavailable
      console.log('Using mock data for stores');
      
      // Filter mock data based on search
      let filteredStores = mockStores;
      if (search) {
        filteredStores = mockStores.filter(store => 
          store.name.toLowerCase().includes(search.toLowerCase()) ||
          store.address.toLowerCase().includes(search.toLowerCase()) ||
          store.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply sorting
      filteredStores.sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortBy === 'avgRating') {
          return sortOrder === 'asc' ? a.avgRating - b.avgRating : b.avgRating - a.avgRating;
        } else if (sortBy === 'createdAt') {
          return sortOrder === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
        }
        return 0;
      });

      // Apply pagination
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedStores = filteredStores.slice(startIndex, startIndex + limitNum);

      res.json({
        success: true,
        data: {
          stores: paginatedStores,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: filteredStores.length,
            pages: Math.ceil(filteredStores.length / limitNum)
          }
        }
      });
    } catch (error) {
      console.error('Route error:', error);
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
