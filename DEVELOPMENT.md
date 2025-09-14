# Development Guide

This guide will help you set up and develop the Store Rating Platform locally.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (Neon DB recommended)
- Git

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd store-rating-platform

# Complete setup (installs dependencies, sets up database, seeds data)
npm run setup
```

### 2. Start Development
```bash
# Start both backend and frontend
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000

## 🛠 Development Workflow

### Backend Development

The backend is located in the `backend/` directory and uses:
- Express.js for the web framework
- Prisma ORM for database operations
- PostgreSQL as the database
- JWT for authentication

#### Key Files:
- `backend/server.js` - Main server file
- `backend/prisma/schema.prisma` - Database schema
- `backend/routes/` - API route handlers
- `backend/middleware/` - Custom middleware
- `backend/utils/` - Utility functions

#### Common Backend Commands:
```bash
# Start backend in development mode
npm run backend:dev

# Generate Prisma client after schema changes
npm run backend:db:generate

# Push schema changes to database
npm run backend:db:push

# Seed database with sample data
npm run backend:db:seed

# Open Prisma Studio (database GUI)
cd backend && npm run db:studio
```

### Frontend Development

The frontend is located in the `frontend/` directory and uses:
- React.js with hooks
- React Router for navigation
- React Hook Form for form handling
- Axios for API calls

#### Key Files:
- `frontend/src/App.js` - Main App component with routing
- `frontend/src/context/AuthContext.js` - Authentication context
- `frontend/src/pages/` - Page components
- `frontend/src/components/` - Reusable components
- `frontend/src/services/api.js` - API service functions

#### Common Frontend Commands:
```bash
# Start frontend in development mode
npm run frontend:start

# Build frontend for production
npm run frontend:build
```

## 🗄 Database Development

### Schema Changes
1. Edit `backend/prisma/schema.prisma`
2. Run `npm run backend:db:generate` to generate Prisma client
3. Run `npm run backend:db:push` to apply changes to database

### Adding Sample Data
- Edit `backend/prisma/seed.js` to add more sample data
- Run `npm run backend:db:seed` to seed the database

### Database GUI
```bash
cd backend && npm run db:studio
```
This opens Prisma Studio in your browser for easy database management.

## 🔧 Environment Configuration

### Backend Environment
Create `backend/.env` from `backend/env.example`:
```env
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend Environment
The frontend uses the proxy setting in `package.json` to connect to the backend.

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Code Style

### Backend
- Use ES6+ features
- Follow Express.js best practices
- Use async/await for database operations
- Implement proper error handling
- Use Joi for validation

### Frontend
- Use functional components with hooks
- Follow React best practices
- Use TypeScript-style prop validation
- Implement proper error boundaries
- Use semantic HTML

## 🐛 Debugging

### Backend Debugging
- Use `console.log()` for debugging
- Check server logs in terminal
- Use Prisma Studio to inspect database
- Use Postman or similar tool to test API endpoints

### Frontend Debugging
- Use React Developer Tools browser extension
- Check browser console for errors
- Use `console.log()` for debugging
- Check Network tab for API calls

## 📦 Adding Dependencies

### Backend Dependencies
```bash
cd backend
npm install <package-name>
```

### Frontend Dependencies
```bash
cd frontend
npm install <package-name>
```

## 🚀 Deployment

### Backend Deployment
1. Set up production database
2. Update environment variables
3. Run database migrations
4. Deploy to hosting platform

### Frontend Deployment
1. Build the frontend: `npm run frontend:build`
2. Deploy the `build` folder to hosting platform
3. Update API URLs for production

## 🔍 Common Issues

### Database Connection Issues
- Check DATABASE_URL in backend/.env
- Ensure database is accessible
- Run `npm run backend:db:push` to create tables

### CORS Issues
- Check FRONTEND_URL in backend/.env
- Ensure frontend is running on correct port

### Authentication Issues
- Check JWT_SECRET in backend/.env
- Clear browser localStorage
- Check token expiration

### Build Issues
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [React Router Documentation](https://reactrouter.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📞 Support

If you encounter any issues:
1. Check this development guide
2. Check the main README.md
3. Open an issue on GitHub
4. Contact the development team

Happy coding! 🎉
