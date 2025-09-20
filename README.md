# Gaming Key Platform (Tenda App)

A comprehensive digital marketplace and distribution system for gaming keys, designed to facilitate secure transactions between publishers, distributors, and end users.

## Overview

The Gaming Key Platform is a scalable, cloud-native solution built with modern web technologies to handle high-volume gaming key transactions. It provides a secure environment for digital game key distribution with real-time inventory management, analytics, and fraud protection.

## Key Features

- **Secure Key Distribution**: End-to-end encrypted gaming key management
- **Multi-Role Support**: Publishers, distributors, retailers, and end users
- **Real-time Analytics**: Comprehensive sales tracking and business intelligence
- **Payment Integration**: Multiple payment gateways with fraud detection
- **Scalable Infrastructure**: AWS-based serverless architecture

## Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Redux Toolkit** for state management
- **Material-UI** for component library
- **Vite** for build tooling

### Backend
- **Node.js** with TypeScript
- **AWS Lambda** for serverless functions
- **PostgreSQL** with Sequelize ORM
- **Redis** for caching and sessions
- **AWS API Gateway** for API management

### Infrastructure
- **AWS CloudFormation/CDK** for Infrastructure as Code
- **AWS S3** for file storage
- **AWS CloudFront** for CDN
- **AWS RDS** for managed PostgreSQL

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- AWS CLI (for deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhananjaysingh20266-stack/tenda-app.git
   cd tenda-app
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your configuration
   ```

3. **Install dependencies and start development servers**
   ```bash
   # Start backend
   cd backend
   npm install
   npm run dev
   
   # Start frontend (in another terminal)
   cd frontend  
   npm install
   npm run dev
   ```

## Documentation

- **[Project Overview](./project_overview_docs.md)**: Comprehensive platform architecture and features
- **[Setup Guide](./project_setup_docs.md)**: Complete development and deployment instructions
- **API Documentation**: Available at `/api/docs` when running the development server

## Project Structure

```
tenda-app/
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js TypeScript backend
├── lambda/            # AWS Lambda functions
├── docs/              # Additional documentation
└── infrastructure/    # AWS CloudFormation templates
```

## Development Workflow

1. **Feature Development**: Create feature branch from `main`
2. **Code Quality**: Automated linting, formatting, and type checking
3. **Testing**: Unit and integration tests required
4. **Deployment**: Automated CI/CD pipeline with AWS

## Contributing

1. Review the [Project Overview](./project_overview_docs.md) and [Setup Guide](./project_setup_docs.md)
2. Follow the established code style and patterns
3. Include tests for new features
4. Update documentation as needed

## Security

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Input validation and sanitization
- Payment Card Industry (PCI) compliance
- GDPR compliance for data protection

## Support

For questions, issues, or feature requests, please:
1. Check existing documentation
2. Search existing issues
3. Create a new issue with detailed information

## License

This project is proprietary software. All rights reserved.