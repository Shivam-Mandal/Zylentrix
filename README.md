# Zylentrix Task Management Application

A full-stack task management application built with React, Node.js, Express, and MongoDB. Features secure authentication, task CRUD operations, and real-time updates.

## Features

- 🔐 Secure Authentication with JWT and HTTP-only cookies
- 📝 Task Management (Create, Read, Update, Delete)
- 🔄 Auto Token Refresh
- 📱 Responsive Design with Tailwind CSS
- 🎯 Task Filtering & Sorting
- 📅 Task Deadlines
- 🚦 Task Status Tracking

## Tech Stack

### Frontend
- React 19.1
- Vite 7.1
- React Router v7
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js with Express 5.1
- MongoDB with Mongoose 8.19
- JWT for authentication
- bcrypt for password hashing
- Cookie-based token management

## Project Structure

```
├── backend/                # Backend server
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middlewares/      # Custom middlewares
│   ├── models/           # Database models
│   └── routes/           # API routes
│
└── frontend/             # Frontend application
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── context/      # React Context
    │   ├── pages/        # Page components
    │   └── utils/        # Utility functions
    └── public/           # Static files
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd Zylentrix
\`\`\`

2. Install backend dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

3. Set up environment variables:
   - Copy `.env.sample` to `.env`
   - Update MongoDB URI and other secrets

4. Install frontend dependencies:
\`\`\`bash
cd ../frontend
npm install
\`\`\`

5. Set up frontend environment:
   - Copy `.env.example` to `.env`
   - Update API URL if needed

### Running the Application

1. Start the backend server:
\`\`\`bash
cd backend
npm run dev
\`\`\`

2. Start the frontend development server:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication Routes
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/refresh` - Refresh access token
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user

### Task Routes
All task routes require authentication:
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create new task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

## Security Features

- HTTP-only cookies for token storage
- JWT token refresh mechanism
- Password hashing with bcrypt
- CORS configuration
- Protected routes with authentication middleware

## Frontend Features

### Components
- **TaskCard**: Displays individual task with edit/delete options
- **TaskModal**: Form for creating/editing tasks
- **Navbar**: Navigation and auth status display

### Pages
- **Login**: User login form
- **Signup**: New user registration
- **Tasks**: Main task management interface

### State Management
- Uses React Context for auth state
- Axios interceptors for token refresh
- Protected routes with auth checks

## Testing

The project includes test scripts for both API and end-to-end testing:

- `test_auth.ps1`: Tests authentication flow
- `test_all_functions.ps1`: Comprehensive API testing

## Deployment Considerations

1. Set appropriate environment variables
2. Configure CORS for production domains
3. Update cookie settings for production
4. Set up MongoDB Atlas production cluster
5. Configure proper security headers
6. Set up proper error logging

## Development Guidelines

1. Follow the established code structure
2. Use controllers for business logic
3. Keep routes simple and focused
4. Use proper error handling
5. Maintain consistent naming conventions
6. Document new features and APIs

## Error Handling

The application implements consistent error handling:
- Frontend: Axios interceptors for API errors
- Backend: Try-catch blocks with proper status codes
- Authentication: Token validation and refresh logic

## Future Enhancements

1. Task categories/labels
2. Task priority levels
3. Team collaboration features
4. File attachments
5. Task comments
6. Email notifications
7. Dark mode support

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

