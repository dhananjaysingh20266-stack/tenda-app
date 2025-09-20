const { AuditLog } = require('../models');

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log the request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  
  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    // Log API calls to audit log (async, don't block response)
    if (req.user && req.path.startsWith('/api/')) {
      AuditLog.create({
        organization_id: req.organizationId,
        user_id: req.userId,
        action: 'api_call',
        resource_type: 'api',
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        metadata: {
          method: req.method,
          path: req.path,
          status_code: res.statusCode,
          duration_ms: duration,
          query: req.query,
        },
        severity: res.statusCode >= 400 ? 'medium' : 'low',
      }).catch(error => {
        console.error('Failed to create audit log:', error);
      });
    }
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = requestLogger;