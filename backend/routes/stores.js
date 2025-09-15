const express = require('express');
const prisma = require('../config/database');

const router = express.Router();

/**
 * @route   GET /api/stores/test
 * @desc    Simple test route
 * @access  Public
 */
router.get('/test', (req, res) => {
  console.log("✅ Test route hit!");
  res.json({ success: true, message: "Stores route is working" });
});

/**
 * @route   GET /api/stores
 * @desc    Get all stores (no auth/validation for testing)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    console.log("✅ GET /api/stores called with query:", req.query);

    let { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // Build search condition
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch stores
    const stores = await prisma.store.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        avgRating: true,
        createdAt: true,
        owner: {
          select: { id: true, name: true }
        },
        _count: {
          select: { ratings: true }
        }
      }
    });

    // Total count for pagination
    const total = await prisma.store.count({ where });

    console.log(`📊 Found ${stores.length} stores, total: ${total}`);
    console.log("📋 Store data:", JSON.stringify(stores, null, 2));

    res.json({
      success: true,
      data: {
        stores,
        total,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error("❌ GET /api/stores error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @route   GET /api/stores/:id
 * @desc    Get store by ID (no auth for now)
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

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
          select: { id: true, name: true }
        },
        _count: {
          select: { ratings: true }
        }
      }
    });

    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    res.json({ success: true, data: { store } });
  } catch (error) {
    console.error("❌ GET /api/stores/:id error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
