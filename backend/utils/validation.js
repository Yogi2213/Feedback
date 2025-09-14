const Joi = require('joi');

// User validation schemas
const userValidation = {
  signup: Joi.object({
    name: Joi.string().min(20).max(60).required().messages({
      'string.min': 'Name must be at least 20 characters long',
      'string.max': 'Name must not exceed 60 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string()
      .min(8)
      .max(16)
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])'), 'password complexity')
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must not exceed 16 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter and one special character',
        'any.required': 'Password is required'
      }),
    address: Joi.string().max(400).required().messages({
      'string.max': 'Address must not exceed 400 characters',
      'any.required': 'Address is required'
    }),
    role: Joi.string().valid('NORMAL_USER', 'STORE_OWNER', 'SYSTEM_ADMIN').optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('SYSTEM_ADMIN', 'STORE_OWNER', 'NORMAL_USER').optional()
  }),

  updatePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    newPassword: Joi.string()
      .min(8)
      .max(16)
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])'), 'password complexity')
      .required()
      .messages({
        'string.min': 'New password must be at least 8 characters long',
        'string.max': 'New password must not exceed 16 characters',
        'string.pattern.base': 'New password must contain at least one uppercase letter and one special character',
        'any.required': 'New password is required'
      })
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(60).optional().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 60 characters'
    }),
    address: Joi.string().max(400).optional().messages({
      'string.max': 'Address must not exceed 400 characters'
    })
  })
};

// Store validation schemas
const storeValidation = {
  create: Joi.object({
    name: Joi.string().min(20).max(60).required().messages({
      'string.min': 'Store name must be at least 20 characters long',
      'string.max': 'Store name must not exceed 60 characters',
      'any.required': 'Store name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    address: Joi.string().max(400).required().messages({
      'string.max': 'Address must not exceed 400 characters',
      'any.required': 'Address is required'
    }),
    ownerId: Joi.string().required().messages({
      'any.required': 'Owner ID is required'
    })
  }),

  update: Joi.object({
    name: Joi.string().min(20).max(60).optional().messages({
      'string.min': 'Store name must be at least 20 characters long',
      'string.max': 'Store name must not exceed 60 characters'
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email address'
    }),
    address: Joi.string().max(400).optional().messages({
      'string.max': 'Address must not exceed 400 characters'
    })
  })
};

// Rating validation schemas
const ratingValidation = {
  create: Joi.object({
    storeId: Joi.string().required().messages({
      'any.required': 'Store ID is required'
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must not exceed 5',
      'any.required': 'Rating is required'
    }),
    comment: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Comment must not exceed 500 characters'
    })
  }),

  update: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must not exceed 5',
      'any.required': 'Rating is required'
    }),
    comment: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Comment must not exceed 500 characters'
    })
  })
};

// Query validation schemas
const queryValidation = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1).optional(),
    limit: Joi.number().integer().min(1).max(100).default(10).optional(),
    sortBy: Joi.string().valid('name', 'email', 'address', 'createdAt', 'avgRating').default('createdAt').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc').optional()
  }).unknown(true),

  search: Joi.object({
    search: Joi.string().max(100).optional().allow(''),
    role: Joi.string().valid('SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER').optional()
  }).unknown(true)
};

// Validation middleware
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    req[property] = value;
    next();
  };
};

module.exports = {
  userValidation,
  storeValidation,
  ratingValidation,
  queryValidation,
  validate
};
