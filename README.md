# Complete Project Setup Documentation

## Project Architecture Overview

```
gaming-key-platform/
├── client/                 # React.js Frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
└── server/                 # Serverless Backend
    ├── functions/          # Lambda functions
    ├── models/            # Sequelize models
    ├── middleware/        # Auth, validation middleware
    ├── utils/             # Helper functions
    ├── config/            # Database and environment config
    ├── migrations/        # Database migrations
    ├── seeders/           # Database seeders
    ├── serverless.yml     # Serverless configuration
    └── package.json
```

---

# Frontend Documentation (React.js)

## Technology Stack

### Core Libraries
- **React 18** - Main framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **React Query (TanStack Query)** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Unstyled accessible components
- **React Hook Form** - Form handling
- **Zod** - Client-side validation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files

## Client Setup Instructions

### 1. Initialize React Project

```bash
# Navigate to project root
cd gaming-key-platform

# Create React app with Vite
npm create vite@latest client -- --template react-ts
cd client

# Install core dependencies
npm install react-router-dom @tanstack/react-query axios zustand

# Install UI libraries
npm install tailwindcss postcss autoprefixer @headlessui/react
npm install react-hook-form @hookform/resolvers zod
npm install react-hot-toast lucide-react framer-motion

# Install dev dependencies
npm install -D @types/node eslint prettier husky lint-staged
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-react eslint-plugin-react-hooks

# Initialize Tailwind CSS
npx tailwindcss init -p
```

### 2. Project Structure

```
client/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/           # Reusable components
│   │   ├── ui/              # Basic UI components
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components
│   │   └── common/          # Common components
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── services/        # Service pages
│   │   └── organization/    # Organization pages
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand stores
│   ├── api/                 # API functions
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   ├── constants/           # Application constants
│   ├── styles/              # Global styles
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── .eslintrc.json
└── .prettierrc
```

### 3. Configuration Files

#### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
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
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### `.eslintrc.json`
```json
{
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react-refresh", "@typescript-eslint"],
  "rules": {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

#### `package.json` scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx}\"",
    "type-check": "tsc --noEmit"
  }
}
```

### 4. Key Implementation Files

#### `src/main.tsx`
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

#### `src/App.tsx`
```typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Layout from '@/components/layout/Layout'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ServicesPage from '@/pages/services/ServicesPage'
import KeyGenerationPage from '@/pages/services/KeyGenerationPage'
import OrganizationPage from '@/pages/organization/OrganizationPage'
import ProtectedRoute from '@/components/common/ProtectedRoute'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to={user?.type === 'organization' ? '/dashboard' : '/services'} /> : 
          <LoginPage />
        } 
      />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route 
          index 
          element={
            <Navigate to={user?.type === 'organization' ? '/dashboard' : '/services'} />
          } 
        />
        
        {/* Organization Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/organization" element={<OrganizationPage />} />
        
        {/* Individual User Routes */}
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/key-generation" element={<KeyGenerationPage />} />
      </Route>
    </Routes>
  )
}

export default App
```

#### `src/types/index.ts`
```typescript
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  type: 'organization' | 'individual'
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: number
  name: string
  slug: string
  description?: string
  ownerId: number
  logoUrl?: string
  website?: string
  industry?: string
  companySize?: string
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise'
  billingEmail?: string
  createdAt: string
  updatedAt: string
}

export interface ApiKey {
  id: number
  keyId: string
  name: string
  description?: string
  serviceId: number
  gameId?: number
  maxDevices: number
  durationHours: number
  costPerDevice: number
  totalCost: number
  currency: string
  isActive: boolean
  expiresAt: string
  lastUsedAt?: string
  usageCount: number
  deviceUsageCount: number
  createdAt: string
}

export interface Game {
  id: number
  name: string
  slug: string
  iconUrl?: string
  isActive: boolean
}

export interface PricingTier {
  id: number
  serviceId: number
  gameId?: number
  durationHours: number
  pricePerDevice: number
  currency: string
}

export interface LoginRequest {
  id: number
  userId: number
  organizationId: number
  deviceFingerprint: string
  ipAddress: string
  userAgent: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  approvedBy?: number
  rejectionReason?: string
  expiresAt: string
  createdAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  loginType: 'organization' | 'individual'
}

export interface KeyGenerationForm {
  gameId: number
  maxDevices: number
  durationHours: number
  bulkQuantity: number
  customKey?: string
  description?: string
}
```

#### `src/store/authStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Organization } from '@/types'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  organization: Organization | null
  token: string | null
  setAuth: (user: User, organization: Organization | null, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      organization: null,
      token: null,
      
      setAuth: (user, organization, token) => {
        set({
          isAuthenticated: true,
          user,
          organization,
          token,
        })
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          organization: null,
          token: null,
        })
      },
      
      updateUser: (userData) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...userData } })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        organization: state.organization,
        token: state.token,
      }),
    }
  )
)
```

#### `src/api/client.ts`
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const { token } = useAuthStore.getState()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const { status } = error.response || {}
        
        if (status === 401) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
          toast.error('Session expired. Please login again.')
        } else if (status === 403) {
          toast.error('Access denied')
        } else if (status >= 500) {
          toast.error('Server error. Please try again later.')
        }
        
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()
```

#### `src/hooks/useAuth.ts`
```typescript
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { LoginForm } from '@/types'
import toast from 'react-hot-toast'

export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: LoginForm) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.organization, response.token)
      toast.success('Login successful')
      
      // Redirect based on user type
      if (response.user.type === 'organization') {
        navigate('/dashboard')
      } else {
        navigate('/services')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout()
      navigate('/login')
      toast.success('Logged out successfully')
    },
  })
}
```

---

# Backend Documentation (Serverless)

## Technology Stack

### Core Technologies
- **Node.js 18+** - Runtime
- **TypeScript** - Type safety
- **AWS Lambda** - Serverless functions
- **Serverless Framework** - Deployment and management
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **Joi** - Payload validation

### Supporting Libraries
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin requests
- **helmet** - Security headers
- **express** - Lambda handler framework
- **aws-lambda-express** - Express adapter for Lambda
- **dotenv** - Environment variables

## Server Setup Instructions

### 1. Initialize Serverless Project

```bash
# Navigate to project root
cd gaming-key-platform

# Create server directory
mkdir server && cd server

# Initialize package.json
npm init -y

# Install Serverless Framework globally
npm install -g serverless

# Install core dependencies
npm install express aws-serverless-express
npm install sequelize pg pg-hstore
npm install joi jsonwebtoken bcryptjs cors helmet
npm install dotenv uuid crypto-js

# Install TypeScript dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/jsonwebtoken @types/bcryptjs @types/cors
npm install -D @types/uuid serverless-plugin-typescript
npm install -D serverless-offline serverless-dotenv-plugin

# Initialize TypeScript
npx tsc --init
```

### 2. Project Structure

```
server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # Database configuration
│   │   ├── jwt.ts          # JWT configuration
│   │   └── constants.ts     # Application constants
│   ├── models/              # Sequelize models
│   │   ├── index.ts        # Model exports
│   │   ├── User.ts         # User model
│   │   ├── Organization.ts  # Organization model
│   │   ├── ApiKey.ts       # API Key model
│   │   └── ...             # Other models
│   ├── functions/           # Lambda functions
│   │   ├── auth/           # Authentication functions
│   │   ├── users/          # User management functions
│   │   ├── organizations/   # Organization functions
│   │   ├── keys/           # API key functions
│   │   └── services/       # Service functions
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts         # Authentication middleware
│   │   ├── validation.ts    # Joi validation middleware
│   │   ├── cors.ts         # CORS middleware
│   │   └── errorHandler.ts  # Error handling middleware
│   ├── utils/               # Utility functions
│   │   ├── jwt.ts          # JWT utilities
│   │   ├── hash.ts         # Password hashing
│   │   ├── fingerprint.ts   # Browser fingerprinting
│   │   └── response.ts      # API response utilities
│   ├── validators/          # Joi validation schemas
│   │   ├── auth.ts         # Auth validation schemas
│   │   ├── user.ts         # User validation schemas
│   │   ├── organization.ts  # Organization schemas
│   │   └── keys.ts         # API key schemas
│   ├── migrations/          # Database migrations
│   └── seeders/            # Database seeders
├── serverless.yml          # Serverless configuration
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### 3. Configuration Files

#### `serverless.yml`
```yaml
service: gaming-key-platform-api
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  stage: ${opt:stage, 'dev'}
  region: ${opt:region, 'us-east-1'}
  environment:
    NODE_ENV: ${self:provider.stage}
    DB_HOST: ${env:DB_HOST}
    DB_PORT: ${env:DB_PORT}
    DB_NAME: ${env:DB_NAME}
    DB_USER: ${env:DB_USER}
    DB_PASSWORD: ${env:DB_PASSWORD}
    JWT_SECRET: ${env:JWT_SECRET}
    JWT_EXPIRES_IN: ${env:JWT_EXPIRES_IN}
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - rds:*
          Resource: "*"

plugins:
  - serverless-plugin-typescript
  - serverless-offline
  - serverless-dotenv-plugin

functions:
  # Authentication
  login:
    handler: src/functions/auth/login.handler
    events:
      - http:
          path: /auth/login
          method: post
          cors: true

  register:
    handler: src/functions/auth/register.handler
    events:
      - http:
          path: /auth/register
          method: post
          cors: true

  # Users
  getUsers:
    handler: src/functions/users/getUsers.handler
    events:
      - http:
          path: /users
          method: get
          cors: true

  createUser:
    handler: src/functions/users/createUser.handler
    events:
      - http:
          path: /users
          method: post
          cors: true

  updateUser:
    handler: src/functions/users/updateUser.handler
    events:
      - http:
          path: /users/{id}
          method: put
          cors: true

  # Organizations
  getOrganization:
    handler: src/functions/organizations/getOrganization.handler
    events:
      - http:
          path: /organizations/profile
          method: get
          cors: true

  updateOrganization:
    handler: src/functions/organizations/updateOrganization.handler
    events:
      - http:
          path: /organizations/profile
          method: put
          cors: true

  # API Keys
  generateKeys:
    handler: src/functions/keys/generateKeys.handler
    events:
      - http:
          path: /key-generation/generate
          method: post
          cors: true

  getUserKeys:
    handler: src/functions/keys/getUserKeys.handler
    events:
      - http:
          path: /my-keys
          method: get
          cors: true

  # Services
  getGames:
    handler: src/functions/services/getGames.handler
    events:
      - http:
          path: /games
          method: get
          cors: true

  getPricing:
    handler: src/functions/services/getPricing.handler
    events:
      - http:
          path: /games/{gameId}/pricing
          method: get
          cors: true

custom:
  serverless-offline:
    httpPort: 3001
  dotenv:
    path: .env
```

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
    "declaration": false,
    "sourceMap": false,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

#### `.env.example`
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gaming_key_platform
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development

# AWS (for production)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

### 4. Core Implementation Files

#### `src/config/database.ts`
```typescript
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'gaming_key_platform',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

export default sequelize
```

#### `src/models/User.ts`
```typescript
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '@/config/database'

interface UserAttributes {
  id: number
  email: string
  passwordHash: string
  firstName?: string
  lastName?: string
  isActive: boolean
  emailVerified: boolean
  emailVerificationToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  lastLogin?: Date
  loginAttempts: number
  lockedUntil?: Date
  createdAt: Date
  updatedAt: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public email!: string
  public passwordHash!: string
  public firstName?: string
  public lastName?: string
  public isActive!: boolean
  public emailVerified!: boolean
  public emailVerificationToken?: string
  public passwordResetToken?: string
  public passwordResetExpires?: Date
  public lastLogin?: Date
  public loginAttempts!: number
  public lockedUntil?: Date
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
)

export default User
```

#### `src/validators/auth.ts`
```typescript
import Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
  loginType: Joi.string()
    .valid('organization', 'individual')
    .required()
    .messages({
      'any.only': 'Login type must be either organization or individual',
      'any.required': 'Login type is required',
    }),
  fingerprint: Joi.string()
    .optional()
    .messages({
      'string.base': 'Fingerprint must be a string',
    }),
  deviceInfo: Joi.object({
    browser: Joi.string().optional(),
    os: Joi.string().optional(),
    screen: Joi.string().optional(),
    timezone: Joi.string().optional(),
  }).optional(),
})

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
      'any.required': 'Password is required',
    }),
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required',
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required',
    }),
  organizationName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Organization name must be at least 3 characters',
      'string.max': 'Organization name cannot exceed 100 characters',
      'any.required': 'Organization name is required',
    }),
})

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required',
    }),
})
```

#### `src/validators/keys.ts`
```typescript
import Joi from 'joi'

export const generateKeysSchema = Joi.object({
  gameId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Game ID must be a number',
      'number.integer': 'Game ID must be an integer',
      'number.positive': 'Game ID must be positive',
      'any.required': 'Game ID is required',
    }),
  maxDevices: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.base': 'Max devices must be a number',
      'number.integer': 'Max devices must be an integer',
      'number.min': 'Max devices must be at least 1',
      'number.max': 'Max devices cannot exceed 10',
      'any.required': 'Max devices is required',
    }),
  durationHours: Joi.number()
    .integer()
    .valid(1, 3, 5, 12, 24, 168) // 1h, 3h, 5h, 12h, 24h, 1week
    .required()
    .messages({
      'number.base': 'Duration must be a number',
      'any.only': 'Duration must be 1, 3, 5, 12, 24, or 168 hours',
      'any.required': 'Duration is required',
    }),
  bulkQuantity: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(1)
    .messages({
      'number.base': 'Bulk quantity must be a number',
      'number.integer': 'Bulk quantity must be an integer',
      'number.min': 'Bulk quantity must be at least 1',
      'number.max': 'Bulk quantity cannot exceed 100',
    }),
  customKey: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-z0-9_-]+$/)
    .optional()
    .messages({
      'string.min': 'Custom key must be at least 3 characters',
      'string.max': 'Custom key cannot exceed 50 characters',
      'string.pattern.base': 'Custom key can only contain letters, numbers, underscores, and hyphens',
    }),
  description: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 255 characters',
    }),
})

export const previewCostSchema = Joi.object({
  gameId: Joi.number()
    .integer()
    .positive()
    .required(),
  maxDevices: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .required(),
  durationHours: Joi.number()
    .integer()
    .valid(1, 3, 5, 12, 24, 168)
    .required(),
  bulkQuantity: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(1),
  customKey: Joi.boolean()
    .default(false),
})
```

#### `src/middleware/auth.ts`
```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, Organization, OrganizationMember } from '@/models'
import { ApiResponse } from '@/utils/response'

interface AuthenticatedRequest extends Request {
  user?: User
  organization?: Organization
  member?: OrganizationMember
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      res.status(401).json(ApiResponse.error('Access token required'))
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['passwordHash'] }
    })

    if (!user || !user.isActive) {
      res.status(401).json(ApiResponse.error('Invalid token'))
      return
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json(ApiResponse.error('Invalid token'))
  }
}

export const requireOrganizationAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(ApiResponse.error('Authentication required'))
      return
    }

    // Check if user is organization owner
    const organization = await Organization.findOne({
      where: { ownerId: req.user.id }
    })

    if (organization) {
      req.organization = organization
      next()
      return
    }

    // Check if user is organization member with admin role
    const member = await OrganizationMember.findOne({
      where: {
        userId: req.user.id,
        roleType: ['owner', 'admin'],
        status: 'active'
      },
      include: [Organization]
    })

    if (!member) {
      res.status(403).json(ApiResponse.error('Organization access required'))
      return
    }

    req.organization = member.Organization
    req.member = member
    next()
  } catch (error) {
    res.status(500).json(ApiResponse.error('Internal server error'))
  }
}

export const requireIndividualAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(ApiResponse.error('Authentication required'))
      return
    }

    // Check if user is individual member
    const member = await OrganizationMember.findOne({
      where: {
        userId: req.user.id,
        status: 'active'
      },
      include: [Organization]
    })

    if (!member) {
      res.status(403).json(ApiResponse.error('Organization membership required'))
      return
    }

    req.organization = member.Organization
    req.member = member
    next()
  } catch (error) {
    res.status(500).json(ApiResponse.error('Internal server error'))
  }
}
```

#### `src/middleware/validation.ts`
```typescript
import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { ApiResponse } from '@/utils/response'

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map(detail => detail.message)
      res.status(400).json(ApiResponse.error('Validation failed', errors))
      return
    }

    req.body = value
    next()
  }
}

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map(detail => detail.message)
      res.status(400).json(ApiResponse.error('Query validation failed', errors))
      return
    }

    req.query = value
    next()
  }
}

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map(detail => detail.message)
      res.status(400).json(ApiResponse.error('Parameter validation failed', errors))
      return
    }

    req.params = value
    next()
  }
}
```

#### `src/utils/response.ts`
```typescript
export interface ApiResponseData<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class ApiResponse {
  static success<T>(data?: T, message?: string): ApiResponseData<T> {
    return {
      success: true,
      data,
      message,
    }
  }

  static error(message: string, errors?: string[]): ApiResponseData {
    return {
      success: false,
      message,
      errors,
    }
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): ApiResponseData<T[]> {
    return {
      success: true,
      data,
      message,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}
```

#### `src/functions/auth/login.ts`
```typescript
import { APIGatewayProxyHandler } from 'aws-lambda'
import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, Organization, OrganizationMember, LoginRequest, DeviceFingerprint } from '@/models'
import { validate } from '@/middleware/validation'
import { loginSchema } from '@/validators/auth'
import { ApiResponse } from '@/utils/response'

const app = express()

app.use(cors())
app.use(express.json())

app.post('/auth/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password, loginType, fingerprint, deviceInfo } = req.body

    // Find user
    const user = await User.findOne({
      where: { email, isActive: true }
    })

    if (!user) {
      return res.status(401).json(ApiResponse.error('Invalid credentials'))
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      // Increment login attempts
      await user.increment('loginAttempts')
      if (user.loginAttempts >= 5) {
        await user.update({
          lockedUntil: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        })
      }
      return res.status(401).json(ApiResponse.error('Invalid credentials'))
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(423).json(ApiResponse.error('Account temporarily locked'))
    }

    let organization: Organization | null = null
    let member: OrganizationMember | null = null

    if (loginType === 'organization') {
      // Organization login
      organization = await Organization.findOne({
        where: { ownerId: user.id, isActive: true }
      })

      if (!organization) {
        return res.status(403).json(ApiResponse.error('Organization access denied'))
      }
    } else {
      // Individual login - requires approval
      member = await OrganizationMember.findOne({
        where: {
          userId: user.id,
          status: 'active'
        },
        include: [Organization]
      })

      if (!member) {
        return res.status(403).json(ApiResponse.error('Organization membership required'))
      }

      organization = member.Organization

      // Check if approval is required
      if (member.requiresApproval) {
        // Check browser fingerprint
        let deviceFingerprint: DeviceFingerprint | null = null
        if (fingerprint) {
          deviceFingerprint = await DeviceFingerprint.findOne({
            where: {
              userId: user.id,
              fingerprintHash: fingerprint
            }
          })
        }

        // If new device or requires approval, create login request
        if (!deviceFingerprint || !deviceFingerprint.isTrusted) {
          const loginRequest = await LoginRequest.create({
            userId: user.id,
            organizationId: organization.id,
            deviceFingerprint: fingerprint || '',
            ipAddress: req.ip || '',
            userAgent: req.get('User-Agent') || '',
            browserInfo: deviceInfo || {},
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          })

          // TODO: Send notification to organization admins

          return res.status(202).json({
            success: true,
            message: 'Login request sent to organization for approval',
            requestId: loginRequest.id
          })
        }
      }

      // Check session limits
      const activeSessionCount = await UserSession.count({
        where: {
          userId: user.id,
          organizationId: organization.id,
          isActive: true,
          expiresAt: { [Op.gt]: new Date() }
        }
      })

      if (activeSessionCount >= member.maxSessions) {
        return res.status(429).json(ApiResponse.error('Maximum sessions exceeded'))
      }
    }

    // Reset login attempts on successful login
    await user.update({
      loginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date()
    })

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        organizationId: organization?.id,
        type: loginType
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Create session
    const session = await UserSession.create({
      sessionToken: token,
      userId: user.id,
      organizationId: organization?.id,
      deviceFingerprint: fingerprint,
      ipAddress: req.ip || '',
      userAgent: req.get('User-Agent') || '',
      browserInfo: deviceInfo || {},
      isActive: true,
      isApproved: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })

    // Update or create device fingerprint
    if (fingerprint) {
      await DeviceFingerprint.upsert({
        userId: user.id,
        fingerprintHash: fingerprint,
        ...deviceInfo,
        lastSeen: new Date()
      })
    }

    // Remove password hash from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: loginType,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    res.json(ApiResponse.success({
      user: userResponse,
      organization,
      token,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    }, 'Login successful'))

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json(ApiResponse.error('Internal server error'))
  }
})

export const handler: APIGatewayProxyHandler = serverless(app)
```

#### `src/functions/keys/generateKeys.ts`
```typescript
import { APIGatewayProxyHandler } from 'aws-lambda'
import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import { ApiKey, Game, PricingTier, Service } from '@/models'
import { authenticate, requireIndividualAccess } from '@/middleware/auth'
import { validate } from '@/middleware/validation'
import { generateKeysSchema } from '@/validators/keys'
import { ApiResponse } from '@/utils/response'

const app = express()

app.use(cors())
app.use(express.json())

interface AuthenticatedRequest extends express.Request {
  user?: any
  organization?: any
  member?: any
}

app.post('/key-generation/generate', 
  authenticate,
  requireIndividualAccess,
  validate(generateKeysSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const {
        gameId,
        maxDevices,
        durationHours,
        bulkQuantity = 1,
        customKey,
        description
      } = req.body

      // Validate game exists
      const game = await Game.findByPk(gameId, {
        where: { isActive: true }
      })

      if (!game) {
        return res.status(404).json(ApiResponse.error('Game not found'))
      }

      // Get service (assuming key generation service has ID 1)
      const service = await Service.findByPk(1)
      if (!service) {
        return res.status(404).json(ApiResponse.error('Service not available'))
      }

      // Get pricing
      const pricingTier = await PricingTier.findOne({
        where: {
          serviceId: service.id,
          gameId: gameId,
          durationHours: durationHours,
          isActive: true
        }
      })

      if (!pricingTier) {
        return res.status(404).json(ApiResponse.error('Pricing not available'))
      }

      // Calculate costs
      const costPerDevice = pricingTier.pricePerDevice
      const totalCostPerKey = costPerDevice * maxDevices
      const totalCost = totalCostPerKey * bulkQuantity

      // Generate batch ID for bulk operations
      const batchId = bulkQuantity > 1 ? `batch_${uuidv4().slice(0, 8)}` : null

      const generatedKeys = []
      const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000)

      // Generate keys
      for (let i = 0; i < bulkQuantity; i++) {
        let keyValue: string
        if (customKey) {
          keyValue = bulkQuantity > 1 ? `${customKey}_${String(i + 1).padStart(3, '0')}` : customKey
        } else {
          keyValue = `${game.slug.toUpperCase()}_${crypto.randomBytes(8).toString('hex').toUpperCase()}`
        }

        // Hash the key for storage
        const keyHash = crypto.createHash('sha256').update(keyValue).digest('hex')

        const apiKey = await ApiKey.create({
          keyId: `key_${uuidv4().slice(0, 8)}`,
          keyHash,
          customKey: keyValue,
          name: description || `${game.name} - ${durationHours}h Key`,
          description,
          serviceId: service.id,
          gameId: gameId,
          organizationId: req.organization.id,
          createdBy: req.user.id,
          maxDevices,
          durationHours,
          costPerDevice,
          totalCost: totalCostPerKey,
          currency: pricingTier.currency,
          isActive: true,
          isBulkGenerated: bulkQuantity > 1,
          bulkBatchId: batchId,
          expiresAt
        })

        generatedKeys.push({
          id: apiKey.keyId,
          key: keyValue, // Return actual key only once
          maxDevices,
          expiresAt: apiKey.expiresAt,
          cost: totalCostPerKey
        })
      }

      // Log activity
      await ActivityLog.create({
        userId: req.user.id,
        organizationId: req.organization.id,
        action: 'KEYS_GENERATED',
        entityType: 'API_KEY',
        description: `Generated ${bulkQuantity} ${game.name} key(s)`,
        metadata: {
          gameId,
          bulkQuantity,
          totalCost,
          batchId
        },
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || ''
      })

      const response = {
        batchId,
        totalGenerated: bulkQuantity,
        totalCost,
        currency: pricingTier.currency,
        expiresAt,
        keys: generatedKeys,
        ...(bulkQuantity > 1 && {
          downloadUrl: `/api/keys/batch/${batchId}/export`
        })
      }

      res.json(ApiResponse.success(response, `Successfully generated ${bulkQuantity} key(s)`))

    } catch (error) {
      console.error('Key generation error:', error)
      res.status(500).json(ApiResponse.error('Failed to generate keys'))
    }
  }
)

export const handler: APIGatewayProxyHandler = serverless(app)
```

### 5. Database Setup

#### Database Migration Command
```bash
# Install sequelize CLI globally
npm install -g sequelize-cli

# Create database (make sure PostgreSQL is running)
createdb gaming_key_platform

# Run migrations
npx sequelize-cli db:migrate

# Seed initial data
npx sequelize-cli db:seed:all
```

#### Sample Migration File: `migrations/20240101000001-create-users.js`
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      email_verification_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      password_reset_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      password_reset_expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      login_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      locked_until: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('users', ['email'], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
```

#### Sample Seeder File: `seeders/20240101000001-games.js`
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('games', [
      {
        id: 1,
        name: 'PUBG Mobile',
        slug: 'pubg-mobile',
        icon_url: 'https://example.com/icons/pubg-mobile.png',
        is_active: true,
        created_at: new Date(),
      },
      {
        id: 2,
        name: 'Free Fire',
        slug: 'free-fire',
        icon_url: 'https://example.com/icons/free-fire.png',
        is_active: true,
        created_at: new Date(),
      },
      {
        id: 3,
        name: 'Call of Duty Mobile',
        slug: 'cod-mobile',
        icon_url: 'https://example.com/icons/cod-mobile.png',
        is_active: true,
        created_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('services', [
      {
        id: 1,
        name: 'Key Generation',
        slug: 'key-generation',
        description: 'Generate gaming access keys with device limits and duration',
        category: 'gaming',
        is_active: true,
        pricing_model: 'per_device',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('pricing_tiers', [
      // PUBG Mobile Pricing
      { service_id: 1, game_id: 1, duration_hours: 1, price_per_device: 10.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 1, duration_hours: 3, price_per_device: 25.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 1, duration_hours: 5, price_per_device: 50.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 1, duration_hours: 12, price_per_device: 100.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 1, duration_hours: 24, price_per_device: 180.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 1, duration_hours: 168, price_per_device: 1000.00, currency: 'INR', is_active: true, created_at: new Date() },
      
      // Free Fire Pricing
      { service_id: 1, game_id: 2, duration_hours: 1, price_per_device: 8.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 2, duration_hours: 3, price_per_device: 20.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 2, duration_hours: 5, price_per_device: 40.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 2, duration_hours: 12, price_per_device: 80.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 2, duration_hours: 24, price_per_device: 150.00, currency: 'INR', is_active: true, created_at: new Date() },
      { service_id: 1, game_id: 2, duration_hours: 168, price_per_device: 800.00, currency: 'INR', is_active: true, created_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pricing_tiers', null, {});
    await queryInterface.bulkDelete('services', null, {});
    await queryInterface.bulkDelete('games', null, {});
  }
};
```

### 6. Development Scripts

#### `package.json` (Server)
```json
{
  "name": "gaming-key-platform-api",
  "version": "1.0.0",
  "description": "Serverless API for Gaming Key Platform",
  "scripts": {
    "dev": "serverless offline --stage dev",
    "build": "tsc",
    "deploy:dev": "serverless deploy --stage dev",
    "deploy:prod": "serverless deploy --stage prod",
    "db:migrate": "sequelize-cli db:migrate",
    "db:seed": "sequelize-cli db:seed:all",
    "db:reset": "sequelize-cli db:migrate:undo:all && npm run db:migrate && npm run db:seed",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write \"src/**/*.{ts,js}\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.18.2",
    "serverless-http": "^3.2.0",
    "sequelize": "^6.32.1",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "joi": "^17.9.2",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.0",
    "crypto-js": "^4.1.1"
  },
  "devDependencies": {
    "typescript": "^5.1.6",
    "@types/node": "^20.4.5",
    "@types/express": "^4.17.17",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/bcryptjs": "^2.4.2",
    "@types/cors": "^2.8.13",
    "@types/uuid": "^9.0.2",
    "serverless": "^3.34.0",
    "serverless-plugin-typescript": "^2.1.4",
    "serverless-offline": "^12.0.4",
    "serverless-dotenv-plugin": "^6.0.0",
    "sequelize-cli": "^6.6.1",
    "@typescript-eslint/eslint-plugin": "^6.2.1",
    "@typescript-eslint/parser": "^6.2.1",
    "eslint": "^8.46.0",
    "prettier": "^3.0.0",
    "jest": "^29.6.2",
    "@types/jest": "^29.5.3"
  }
}
```

### 7. Environment Configuration

#### `.env.development`
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gaming_key_platform_dev
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-development-key
JWT_EXPIRES_IN=7d
```

#### `.env.production`
```env
NODE_ENV=production
DB_HOST=your-prod-db-host
DB_PORT=5432
DB_NAME=gaming_key_platform_prod
DB_USER=your_prod_db_user
DB_PASSWORD=your_prod_db_password
JWT_SECRET=your-super-secret-production-key-very-long-and-secure
JWT_EXPIRES_IN=7d
AWS_REGION=us-east-1
```

---

# Deployment Instructions

## Local Development Setup

### Prerequisites
1. **Node.js 18+** installed
2. **PostgreSQL** installed and running
3. **AWS CLI** configured (for serverless deployment)
4. **Git** for version control

### Step-by-Step Setup

```bash
# 1. Clone/create project
mkdir gaming-key-platform
cd gaming-key-platform

# 2. Setup Frontend
npm create vite@latest client -- --template react-ts
cd client
# Install all frontend dependencies as mentioned above
npm install react-router-dom @tanstack/react-query axios zustand tailwindcss postcss autoprefixer @headlessui/react react-hook-form @hookform/resolvers zod react-hot-toast lucide-react framer-motion
npm install -D @types/node eslint prettier husky lint-staged @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks
npx tailwindcss init -p

# 3. Setup Backend
cd ../
mkdir server && cd server
npm init -y
# Install all backend dependencies as mentioned above
npm install express serverless-http sequelize pg pg-hstore joi jsonwebtoken bcryptjs cors helmet dotenv uuid crypto-js
npm install -D typescript @types/node @types/express @types/jsonwebtoken @types/bcryptjs @types/cors @types/uuid serverless serverless-plugin-typescript serverless-offline serverless-dotenv-plugin sequelize-cli

# 4. Initialize TypeScript
npx tsc --init

# 5. Setup Database
createdb gaming_key_platform_dev
cp .env.example .env
# Edit .env with your database credentials
npm run db:migrate
npm run db:seed

# 6. Start Development Servers
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd ../client
npm run dev
```

## Production Deployment

### AWS Setup
```bash
# 1. Configure AWS CLI
aws configure
# Enter your AWS credentials

# 2. Deploy to AWS Lambda
cd server
npm run deploy:prod

# 3. Build and deploy frontend (to S3/CloudFront)
cd ../client
npm run build
# Upload dist/ folder to S3 or your hosting service
```

### Environment Variables for Production
```bash
# Set production environment variables in AWS Lambda
serverless deploy --stage prod \
  --param="DB_HOST=your-prod-db-host" \
  --param="DB_PASSWORD=your-secure-password" \
  --param="JWT_SECRET=your-super-secure-jwt-secret"
```

---

# Development Guidelines

## Code Structure Best Practices

### Frontend (React)
1. **Component Organization**
   - Keep components small and focused
   - Use TypeScript interfaces for all props
   - Implement proper error boundaries
   - Use React Hook Form for all forms

2. **State Management**
   - Use Zustand for global state
   - Use React Query for server state
   - Keep local state in components when possible

3. **API Integration**
   - All API calls through the centralized API client
   - Implement proper error handling
   - Use React Query mutations for state-changing operations

### Backend (Serverless)
1. **Function Organization**
   - One function per endpoint
   - Keep functions small and focused
   - Use middleware for common functionality
   - Implement proper error handling

2. **Database**
   - Use Sequelize ORM for all database operations
   - Implement proper migrations
   - Use transactions for multi-table operations
   - Add proper indexes for performance

3. **Validation**
   - Use Joi for all input validation
   - Validate at multiple levels (client and server)
   - Sanitize user inputs
   - Implement rate limiting

## Security Best Practices

### Authentication & Authorization
1. **JWT Implementation**
   - Use strong, unique secrets
   - Implement token refresh mechanism
   - Store tokens securely on client
   - Validate tokens on every request

2. **Password Security**
   - Hash passwords with bcrypt
   - Implement password complexity requirements
   - Add rate limiting for login attempts
   - Lock accounts after failed attempts

### Data Protection
1. **Input Validation**
   - Validate all inputs with Joi
   - Sanitize data before database operations
   - Use parameterized queries (Sequelize handles this)
   - Implement CSRF protection

2. **API Security**
   - Use HTTPS only
   - Implement CORS properly
   - Add security headers with Helmet
   - Rate limit API endpoints

## Testing Strategy

### Frontend Testing
```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom

# Run tests
npm run test
```

### Backend Testing
```bash
# Install testing dependencies
npm install -D jest supertest @types/supertest

# Run tests
npm run test
```

### Sample Test Files

#### Frontend Test: `src/components/__tests__/LoginForm.test.tsx`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from '../LoginForm'

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('LoginForm', () => {
  test('should render login form fields', () => {
    renderWithProviders(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test('should show validation errors for invalid inputs', async () => {
    renderWithProviders(<LoginForm />)
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })
})
```

#### Backend Test: `src/functions/__tests__/auth.test.ts`
```typescript
import request from 'supertest'
import { app } from '../auth/login'
import { User, Organization } from '../../models'

describe('POST /auth/login', () => {
  beforeEach(async () => {
    // Setup test data
    await User.destroy({ where: {}, force: true })
    await Organization.destroy({ where: {}, force: true })
  })

  test('should login successfully with valid credentials', async () => {
    // Create test user
    const user = await User.create({
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
      emailVerified: true
    })

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
        loginType: 'organization'
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.user.email).toBe('test@example.com')
    expect(response.body.data.token).toBeDefined()
  })

  test('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
        loginType: 'organization'
      })

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
  })
})
```

## Performance Optimization

### Frontend
1. **Code Splitting**
   - Use React.lazy for route-based splitting
   - Implement component-level lazy loading
   - Bundle analysis and optimization

2. **Caching**
   - Implement React Query caching
   - Use service workers for static assets
   - Optimize image loading

### Backend
1. **Database Optimization**
   - Add proper database indexes
   - Use connection pooling
   - Implement query optimization
   - Use read replicas for analytics

2. **Lambda Optimization**
   - Minimize cold starts
   - Optimize bundle size
   - Use connection reuse
   - Implement proper caching

## Monitoring & Logging

### Application Monitoring
1. **Frontend Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - User analytics
   - Real-time alerts

2. **Backend Monitoring**
   - AWS CloudWatch logs
   - Database performance monitoring
   - API response time tracking
   - Error rate monitoring

### Logging Best Practices
```typescript
// Structured logging example
const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }))
  },
  error: (message: string, error?: Error, meta?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...meta
    }))
  }
}
```

---

# Final Project Checklist

## Pre-Development Setup ✅
- [ ] Set up project structure
- [ ] Install all dependencies
- [ ] Configure TypeScript
- [ ] Set up database
- [ ] Configure environment variables
- [ ] Set up linting and formatting

## Core Features Implementation ✅
- [ ] User authentication system
- [ ] Organization management
- [ ] API key generation service
- [ ] Browser fingerprinting
- [ ] Session management
- [ ] CSRF protection
- [ ] Login approval workflow

## Frontend Components ✅
- [ ] Login/Registration forms
- [ ] Dashboard layouts
- [ ] Key generation form
- [ ] User management interface
- [ ] Session management UI
- [ ] Responsive design implementation

## Backend APIs ✅
- [ ] Authentication endpoints
- [ ] User management APIs
- [ ] Key generation APIs
- [ ] Organization management
- [ ] Session management
- [ ] Activity logging

## Security Implementation ✅
- [ ] JWT authentication
- [ ] Password hashing
- [ ] Input validation
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Security headers

## Testing ✅
- [ ] Unit tests for components
- [ ] API endpoint tests
- [ ] Integration tests
- [ ] End-to-end tests
- [ ] Security testing

## Deployment ✅
- [ ] Local development setup
- [ ] AWS Lambda deployment
- [ ] Database migration scripts
- [ ] Environment configuration
- [ ] CI/CD pipeline setup

## Documentation ✅
- [ ] API documentation
- [ ] Component documentation
- [ ] Deployment guides
- [ ] Development guidelines
- [ ] Security best practices

This comprehensive documentation provides your copilot with everything needed to build the complete gaming key platform with React.js frontend and serverless backend using the specified technology stack.
