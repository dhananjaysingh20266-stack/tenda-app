require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    csrfSecret: process.env.CSRF_SECRET || 'fallback-csrf-secret',
    sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    deviceFingerprintingEnabled: process.env.DEVICE_FINGERPRINTING_ENABLED === 'true',
    loginApprovalRequired: process.env.LOGIN_APPROVAL_REQUIRED === 'true',
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutDurationMinutes: parseInt(process.env.LOCKOUT_DURATION_MINUTES) || 30,
  },
  
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  
  notifications: {
    emailServiceApiKey: process.env.EMAIL_SERVICE_API_KEY,
    smsServiceApiKey: process.env.SMS_SERVICE_API_KEY,
  },
  
  analytics: {
    enabled: process.env.ANALYTICS_ENABLED === 'true',
    batchSize: parseInt(process.env.ANALYTICS_BATCH_SIZE) || 100,
  },
};