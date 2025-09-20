# Gaming Key Platform

A secure platform for managing gaming keys and user access with comprehensive analytics and security features.

## Features

- **User Management**: Organization-based user management with role-based access control
- **Gaming Key Generation**: Bulk key generation with pricing tiers and device limits  
- **Security Systems**: Device fingerprinting, login approval workflows, and session management
- **Analytics & Reporting**: Comprehensive analytics dashboard with real-time monitoring
- **Multi-layer Authentication**: JWT authentication with refresh tokens and CSRF protection
- **Audit Logging**: Complete activity tracking and security event logging

## Architecture

- **Frontend**: React.js with TypeScript, Tailwind CSS, Zustand state management, React Query
- **Backend**: Node.js/Express with PostgreSQL database, Sequelize ORM, JWT authentication
- **Security**: Multi-layer security with device fingerprinting, session limits, and approval workflows
- **Database**: 23-table PostgreSQL schema supporting all platform workflows

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 12+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tenda-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database and security configuration
   
   # Frontend (optional)
   cp frontend/.env.example frontend/.env.local
   ```

4. **Set up the database**
   ```bash
   cd backend
   npm run migrate
   npm run seed
   cd ..
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts both the backend API server (port 3000) and frontend development server (port 5173).

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run test` - Run tests for both frontend and backend
- `npm run lint` - Run linting for both frontend and backend

### Individual Service Commands

**Backend:**
- `npm run dev:backend` - Start backend API server only
- `npm run build:backend` - Build backend for production
- `npm run test:backend` - Run backend tests

**Frontend:**
- `npm run dev:frontend` - Start frontend development server only  
- `npm run build:frontend` - Build frontend for production
- `npm run test:frontend` - Run frontend tests

## API Documentation

The backend API provides the following main endpoints:

- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/users` - List organization users
- `GET /api/v1/gaming-keys` - List gaming keys
- `POST /api/v1/gaming-keys/generate` - Generate new keys
- `GET /api/v1/analytics` - Analytics data

## Database Schema

The platform uses a comprehensive 23-table PostgreSQL schema including:

- **User Management**: Organizations, Users, Roles, Permissions
- **Gaming Keys**: Games, Services, GamingKeys, KeyBatches, PricingTiers
- **Security**: DeviceFingerprints, LoginSessions, LoginApprovals, LoginAttempts
- **System**: AuditLogs, Notifications, Analytics, SystemConfiguration
- **Authentication**: ApiKeys, RefreshTokens

## Security Features

- **Multi-layer Authentication**: JWT tokens with refresh token rotation
- **Device Fingerprinting**: Comprehensive device identification and tracking
- **Login Approval Workflow**: Admin approval required for new device logins
- **Session Management**: Session limits and concurrent session control
- **CSRF Protection**: Cross-site request forgery protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Audit Logging**: Complete activity and security event logging

## Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- React Query for API state management
- React Hook Form for form handling
- Lucide React for icons

**Backend:**
- Node.js with Express framework
- PostgreSQL database with Sequelize ORM
- JWT for authentication
- Joi for input validation
- Helmet for security headers
- Winston for logging

## Development

### Project Structure

```
tenda-app/
├── backend/              # Backend API server
│   ├── src/
│   │   ├── models/       # Sequelize database models
│   │   ├── routes/       # API route handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── services/     # Business logic services
│   │   └── config/       # Configuration files
├── frontend/             # Frontend React application  
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand state stores
│   │   ├── services/     # API service functions
│   │   └── types/        # TypeScript type definitions
└── package.json          # Root package.json with workspace config
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.