# Store Rating Platform

A fullstack MVP web application for a store rating platform built with React.js, Express.js, Prisma ORM, and Neon DB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (Neon DB recommended)
- npm or yarn

### One-Command Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd store-rating-platform

# Install all dependencies and setup database
npm run setup
```

This will:
- Install all backend and frontend dependencies
- Generate Prisma client
- Push database schema to your database
- Seed the database with sample data

### Manual Setup

#### 1. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install separately
npm run backend:install
npm run frontend:install
```

#### 2. Database Setup
```bash
# Copy environment file
cp backend/env.example backend/.env

# Update backend/.env with your database URL
# DATABASE_URL="your-neon-db-connection-string"

# Generate Prisma client
npm run backend:db:generate

# Push schema to database
npm run backend:db:push

# Seed the database
npm run backend:db:seed
```

#### 3. Start Development Servers
```bash
# Start both backend and frontend
npm run dev

# Or start separately
npm run backend:dev    # Backend on http://localhost:5000
npm run frontend:start # Frontend on http://localhost:3000
```

## 📁 Project Structure

```
store-rating-platform/
├── backend/                 # Express.js API server
│   ├── config/
│   │   └── database.js     # Prisma database connection
│   ├── middleware/
│   │   └── auth.js         # Authentication middleware
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.js         # Database seeding script
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management routes
│   │   ├── stores.js       # Store management routes
│   │   ├── ratings.js      # Rating management routes
│   │   └── admin.js        # Admin-specific routes
│   ├── utils/
│   │   ├── auth.js         # Authentication utilities
│   │   └── validation.js   # Validation schemas
│   ├── package.json
│   ├── server.js           # Main server file
│   └── env.example         # Environment variables template
├── frontend/               # React.js frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React Context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── App.js          # Main App component
│   │   ├── index.js        # Entry point
│   │   └── index.css       # Global styles
│   └── package.json
├── package.json            # Root package.json with scripts
└── README.md
```

## 🔧 Available Scripts

### Root Level Scripts
- `npm run dev` - Start both backend and frontend in development mode
- `npm run setup` - Complete setup (install + database setup + seed)
- `npm run install:all` - Install all dependencies
- `npm run build` - Build frontend for production
- `npm start` - Start backend in production mode

### Backend Scripts
- `npm run backend:dev` - Start backend in development mode
- `npm run backend:start` - Start backend in production mode
- `npm run backend:install` - Install backend dependencies
- `npm run backend:db:generate` - Generate Prisma client
- `npm run backend:db:push` - Push schema to database
- `npm run backend:db:seed` - Seed database with sample data

### Frontend Scripts
- `npm run frontend:start` - Start frontend development server
- `npm run frontend:build` - Build frontend for production
- `npm run frontend:install` - Install frontend dependencies

## 🌟 Features

### Authentication & Roles
- JWT-based authentication
- Three user roles: System Administrator, Normal User, Store Owner
- Password validation (8-16 chars, uppercase + special character)
- Email validation

### System Administrator Features
- Dashboard with statistics (total users, stores, ratings)
- Add new stores, users, and admin users
- View and manage all users and stores
- Apply filters and sorting
- Analytics and reporting

### Normal User Features
- Browse and search stores
- Rate stores (1-5 stars)
- Update personal profile and password
- View store ratings and details

### Store Owner Features
- Dashboard showing store analytics
- View ratings and feedback for their stores
- Rating distribution and statistics
- Store performance metrics

## 🔑 Demo Credentials

After running the seed script, you can use these credentials:

### System Administrator
- **Email:** admin@storeplatform.com
- **Password:** Admin123!

### Store Owner
- **Email:** owner@mystore.com
- **Password:** Owner123!

### Normal User
- **Email:** alice@example.com
- **Password:** User123!

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **Prisma ORM** for database operations
- **PostgreSQL** (Neon DB)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for validation

### Frontend
- **React.js** with functional components and hooks
- **React Router** for navigation
- **React Hook Form** for form handling
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📊 Database Schema

```sql
-- Users table
users (
  id, name, email, password, address, role, createdAt, updatedAt
)

-- Stores table
stores (
  id, name, email, address, ownerId, avgRating, createdAt, updatedAt
)

-- Ratings table
ratings (
  id, userId, storeId, rating, createdAt, updatedAt
)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/password` - Update user password
- `DELETE /api/users/:id` - Delete user (Admin only)

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create store (Admin only)
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store (Admin only)
- `GET /api/stores/owner/:ownerId` - Get stores by owner

### Ratings
- `POST /api/ratings` - Create/update rating (Normal User only)
- `GET /api/ratings/store/:storeId` - Get store ratings
- `GET /api/ratings/user/:userId` - Get user ratings
- `DELETE /api/ratings/:id` - Delete rating

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data
- `POST /api/admin/users` - Create user (Admin only)
- `POST /api/admin/stores` - Create store (Admin only)
- `PUT /api/admin/users/:id/role` - Update user role (Admin only)
- `GET /api/admin/analytics` - Get analytics data

## 🚀 Deployment

### Backend Deployment
1. Set up your production database
2. Update `backend/.env` with production values
3. Run `npm run backend:db:push` to create tables
4. Run `npm run backend:db:seed` to seed data
5. Deploy to your hosting platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Run `npm run frontend:build` to build the frontend
2. Deploy the `frontend/build` folder to your hosting platform
3. Update API URLs in production

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

## 📝 Validation Rules

### User Registration/Update
- **Name:** 20-60 characters
- **Email:** Valid email format
- **Password:** 8-16 characters, at least one uppercase letter and one special character
- **Address:** Maximum 400 characters

### Store Creation/Update
- **Name:** 20-60 characters
- **Email:** Valid email format
- **Address:** Maximum 400 characters

### Rating
- **Rating:** Integer between 1-5

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development purposes.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**Happy Coding! 🎉**