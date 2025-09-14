const express = require('express');
const { ratingValidation, queryValidation, validate } = require('../utils/validation');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../config/database');

const router = express.Router();

// @route   POST /api/ratings
// @desc    Create or update rating
// @access  Private (Normal User)
router.post('/', 
  authenticate, 
  authorize('NORMAL_USER'), 
  validate(ratingValidation.create), 
  async (req, res) => {
    try {
      const { storeId, rating, comment } = req.body;
      const userId = req.user.id;

      // Check if store exists
      const store = await prisma.store.findUnique({
        where: { id: storeId }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      // Check if user already rated this store
      const existingRating = await prisma.rating.findUnique({
        where: {
          userId_storeId: {
            userId,
            storeId
          }
        }
      });

      let ratingRecord;
      let message;

      if (existingRating) {
        // Update existing rating
        ratingRecord = await prisma.rating.update({
          where: {
            userId_storeId: {
              userId,
              storeId
            }
          },
          data: { 
            rating,
            comment: comment || null
          },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, name: true } },
            store: { select: { id: true, name: true } }
          }
        });
        message = 'Rating updated successfully';
      } else {
        // Create new rating
        ratingRecord = await prisma.rating.create({
          data: {
            userId,
            storeId,
            rating,
            comment: comment || null
          },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, name: true } },
            store: { select: { id: true, name: true } }
          }
        });
        message = 'Rating created successfully';
      }

      // Update store's average rating
      await updateStoreAverageRating(storeId);

      res.status(201).json({
        success: true,
        message,
        data: { rating: ratingRecord, comment: comment || null }
      });
    } catch (error) {
      console.error('Create/Update rating error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// @route   GET /api/ratings/store/:storeId
// @desc    Get ratings for a specific store
// @access  Private
router.get('/store/:storeId', 
  authenticate, 
  validate(queryValidation.pagination, 'query'),
  async (req, res) => {
    try {
      const { storeId } = req.params;
      const { page, limit, sortBy, sortOrder } = req.query;
      const skip = (page - 1) * limit;

      // Check if store exists
      const store = await prisma.store.findUnique({
        where: { id: storeId },
        select: { id: true, name: true }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      // Get ratings with pagination
      const [ratings, total] = await Promise.all([
        prisma.rating.findMany({
          where: { storeId },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        prisma.rating.count({ where: { storeId } })
      ]);

      res.json({
        success: true,
        data: {
          store,
          ratings,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get store ratings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// @route   GET /api/ratings/user/:userId
// @desc    Get ratings by a specific user
// @access  Private
router.get('/user/:userId', 
  authenticate, 
  validate(queryValidation.pagination, 'query'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { page, limit, sortBy, sortOrder } = req.query;
      const skip = (page - 1) * limit;
      const currentUserId = req.user.id;
      const userRole = req.user.role;

      // Users can only view their own ratings unless they're admin
      if (userRole !== 'SYSTEM_ADMIN' && userId !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own ratings.'
        });
      }

      // Get ratings with pagination
      const [ratings, total] = await Promise.all([
        prisma.rating.findMany({
          where: { userId },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            store: {
              select: {
                id: true,
                name: true,
                address: true,
                avgRating: true
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        prisma.rating.count({ where: { userId } })
      ]);

      res.json({
        success: true,
        data: {
          ratings,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get user ratings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// @route   DELETE /api/ratings/:id
// @desc    Delete rating
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get rating
    const rating = await prisma.rating.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        storeId: true
      }
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Users can only delete their own ratings unless they're admin
    if (userRole !== 'SYSTEM_ADMIN' && rating.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own ratings.'
      });
    }

    // Delete rating
    await prisma.rating.delete({
      where: { id }
    });

    // Update store's average rating
    await updateStoreAverageRating(rating.storeId);

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to update store's average rating
async function updateStoreAverageRating(storeId) {
  try {
    const result = await prisma.rating.aggregate({
      where: { storeId },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    const avgRating = result._avg.rating || 0;
    const ratingCount = result._count.rating;

    await prisma.store.update({
      where: { id: storeId },
      data: { avgRating: Math.round(avgRating * 100) / 100 } // Round to 2 decimal places
    });
  } catch (error) {
    console.error('Error updating store average rating:', error);
  }
}

module.exports = router;
