# Gaming Key Platform - Project Setup Guide

## Prerequisites

### System Requirements
- **Node.js**: v18+ (LTS recommended)
- **npm**: v8+ or **yarn**: v1.22+
- **PostgreSQL**: v14+
- **Redis**: v6+ (for caching and sessions)
- **AWS CLI**: v2+ (for deployment)
- **Git**: v2.30+

### Development Tools
- **IDE**: VSCode (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Prettier - Code formatter
  - ESLint
  - GitLens
  - Thunder Client (for API testing)

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/dhananjaysingh20266-stack/tenda-app.git
cd tenda-app
```

### 2. Environment Configuration
Create environment files for different stages:

#### `.env.development`
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/tenda_gaming_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tenda_gaming_dev
DB_USER=username
DB_PASSWORD=password

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-development
JWT_EXPIRE_TIME=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# AWS Configuration (Development)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=tenda-gaming-dev-bucket

# Payment Gateway (Stripe Test)
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# API Configuration
API_BASE_URL=http://localhost:3001/api
CORS_ORIGIN=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### `.env.production`
```env
# Production environment variables
DATABASE_URL=${RDS_CONNECTION_STRING}
REDIS_URL=${ELASTICACHE_CONNECTION_STRING}
JWT_SECRET=${JWT_SECRET_PRODUCTION}
# ... other production configurations
```

## Frontend Setup (React/TypeScript)

### 1. Project Structure
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── keys/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── KeyManagement.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── keys.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   └── keysSlice.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── keys.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validation.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

### 2. Initialize Frontend
```bash
# Create React app with TypeScript
cd frontend
npm create vite@latest . -- --template react-ts
npm install

# Install additional dependencies
npm install @reduxjs/toolkit react-redux
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom
npm install axios
npm install @hookform/resolvers react-hook-form yup
npm install date-fns
npm install recharts

# Install development dependencies
npm install -D @types/node
npm install -D tailwindcss postcss autoprefixer
npm install -D @vitejs/plugin-react
```

### 3. Frontend Configuration Files

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/pages/*": ["src/pages/*"],
      "@/services/*": ["src/services/*"],
      "@/store/*": ["src/store/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

## Backend Setup (Node.js/AWS Lambda)

### 1. Project Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── keyController.ts
│   │   └── paymentController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── rateLimit.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── GameKey.ts
│   │   ├── Order.ts
│   │   └── Transaction.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── keys.ts
│   │   └── payments.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── keyService.ts
│   │   ├── paymentService.ts
│   │   └── emailService.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── jwt.ts
│   │   └── validators.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── aws.ts
│   ├── migrations/
│   └── seeders/
├── lambda/
│   ├── api.ts
│   ├── auth.ts
│   └── payments.ts
├── package.json
├── tsconfig.json
├── serverless.yml
└── webpack.config.js
```

### 2. Initialize Backend
```bash
# Navigate to backend directory
cd backend
npm init -y

# Install production dependencies
npm install express
npm install sequelize pg pg-hstore
npm install jsonwebtoken bcryptjs
npm install cors helmet morgan
npm install dotenv
npm install redis
npm install stripe
npm install nodemailer
npm install aws-sdk
npm install joi
npm install serverless-http

# Install development dependencies
npm install -D @types/node @types/express
npm install -D @types/jsonwebtoken @types/bcryptjs
npm install -D @types/cors @types/morgan
npm install -D @types/nodemailer
npm install -D typescript ts-node nodemon
npm install -D sequelize-cli
npm install -D serverless serverless-webpack
npm install -D webpack webpack-cli ts-loader
```

### 3. Backend Configuration Files

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/controllers/*": ["src/controllers/*"],
      "@/models/*": ["src/models/*"],
      "@/services/*": ["src/services/*"],
      "@/utils/*": ["src/utils/*"],
      "@/config/*": ["src/config/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "lambda"]
}
```

#### `serverless.yml`
```yaml
service: tenda-gaming-platform

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  region: ${opt:region, 'us-east-1'}
  stage: ${opt:stage, 'dev'}
  environment:
    DATABASE_URL: ${env:DATABASE_URL}
    JWT_SECRET: ${env:JWT_SECRET}
    REDIS_URL: ${env:REDIS_URL}
    STRIPE_SECRET_KEY: ${env:STRIPE_SECRET_KEY}
  
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - rds:DescribeDBInstances
            - elasticache:DescribeReplicationGroups
          Resource: '*'

plugins:
  - serverless-webpack
  - serverless-offline

custom:
  webpack:
    webpackConfig: ./webpack.config.js
    includeModules: true

functions:
  api:
    handler: lambda/api.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
    
  auth:
    handler: lambda/auth.handler
    events:
      - http:
          path: /auth/{proxy+}
          method: ANY
          cors: true

  payments:
    handler: lambda/payments.handler
    events:
      - http:
          path: /payments/{proxy+}
          method: ANY
          cors: true

resources:
  Resources:
    # RDS PostgreSQL Instance
    GameKeyDB:
      Type: AWS::RDS::DBInstance
      Properties:
        DBInstanceIdentifier: tenda-gaming-${self:provider.stage}
        DBInstanceClass: db.t3.micro
        Engine: postgres
        MasterUsername: ${env:DB_USER}
        MasterUserPassword: ${env:DB_PASSWORD}
        AllocatedStorage: 20
        VPCSecurityGroups:
          - !Ref DatabaseSecurityGroup
        
    # ElastiCache Redis
    RedisCluster:
      Type: AWS::ElastiCache::ReplicationGroup
      Properties:
        ReplicationGroupId: tenda-redis-${self:provider.stage}
        Description: Redis cluster for Gaming Key Platform
        NodeType: cache.t3.micro
        NumCacheClusters: 1
        Engine: redis
        SecurityGroupIds:
          - !Ref RedisSecurityGroup
```

## Database Setup

### 1. Database Configuration

#### `src/config/database.ts`
```typescript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://localhost:5432/tenda_gaming_dev',
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
```

### 2. Database Models

#### `src/models/User.ts`
```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PUBLISHER' | 'DISTRIBUTOR' | 'USER';
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: 'ADMIN' | 'PUBLISHER' | 'DISTRIBUTOR' | 'USER';
  public isVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'PUBLISHER', 'DISTRIBUTOR', 'USER'),
      defaultValue: 'USER',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
```

### 3. Migrations

#### Create migration files:
```bash
# Initialize Sequelize CLI
npx sequelize-cli init

# Create migrations
npx sequelize-cli migration:generate --name create-users-table
npx sequelize-cli migration:generate --name create-game-keys-table
npx sequelize-cli migration:generate --name create-orders-table
npx sequelize-cli migration:generate --name create-transactions-table
```

#### Example migration: `migrations/001-create-users-table.js`
```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'PUBLISHER', 'DISTRIBUTOR', 'USER'),
        defaultValue: 'USER'
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
```

### 4. Seeders

#### Create development seed data:
```bash
npx sequelize-cli seed:generate --name demo-users
npx sequelize-cli seed:generate --name demo-game-keys
```

## Development Workflow

### 1. Package.json Scripts

#### Frontend `package.json`:
```json
{
  "name": "tenda-gaming-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "format": "prettier --write src/**/*.{ts,tsx}"
  }
}
```

#### Backend `package.json`:
```json
{
  "name": "tenda-gaming-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "deploy": "serverless deploy",
    "deploy:dev": "serverless deploy --stage dev",
    "deploy:prod": "serverless deploy --stage prod",
    "db:migrate": "sequelize-cli db:migrate",
    "db:seed": "sequelize-cli db:seed:all",
    "db:reset": "sequelize-cli db:migrate:undo:all && npm run db:migrate && npm run db:seed",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  }
}
```

### 2. Development Commands

#### Start Development Environment:
```bash
# Terminal 1: Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

#### Database Operations:
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

### 3. Testing Setup

#### Frontend Testing (Vitest):
```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @vitejs/plugin-react jsdom
```

#### Backend Testing (Jest):
```bash
# Install testing dependencies
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

## Deployment

### 1. AWS Infrastructure Setup
```bash
# Install AWS CLI and configure
aws configure

# Deploy backend infrastructure
cd backend
npm run deploy:dev  # Development
npm run deploy:prod # Production
```

### 2. Frontend Deployment
```bash
# Build frontend for production
cd frontend
npm run build

# Deploy to S3 + CloudFront
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 3. Database Deployment
```bash
# Run production migrations
NODE_ENV=production npm run db:migrate
```

## Best Practices

### Code Quality
- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured for React and Node.js best practices
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for pre-commit checks

### Security
- **Input Validation**: Joi schema validation for all inputs
- **Authentication**: JWT with refresh tokens
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configured for specific origins only

### Performance
- **Database Indexing**: Proper indexing for query performance
- **Caching**: Redis for session and data caching
- **CDN**: CloudFront for static asset delivery
- **Code Splitting**: Frontend code splitting for better loading

### Monitoring
- **Logging**: Structured logging with Winston
- **Error Tracking**: Sentry integration for error monitoring
- **Performance Monitoring**: New Relic or similar APM tools
- **Health Checks**: API health check endpoints

## Troubleshooting

### Common Issues
1. **Database Connection**: Check PostgreSQL service and connection string
2. **Redis Connection**: Ensure Redis server is running
3. **CORS Errors**: Verify CORS configuration in backend
4. **Build Errors**: Check TypeScript configuration and dependencies
5. **Deployment Failures**: Verify AWS credentials and permissions

### Debug Commands
```bash
# Check database connection
npm run db:test-connection

# View application logs
npm run logs

# Test API endpoints
npm run test:api

# Check environment variables
npm run env:check
```

This setup guide provides a comprehensive foundation for developing the Gaming Key Platform with a modern, scalable architecture.