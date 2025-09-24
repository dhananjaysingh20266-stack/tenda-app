const jwt = require("jsonwebtoken");
const { Common } = require("../../helpers/Common");
const { Messages } = require("../../helpers/Messages");
const { Constants } = require("../../helpers/Constants");

const logout = async (event, context) => {
  try {
    // Simple JWT validation without database lookup
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader) {
      return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_UNAUTHORIZED);
    }
    
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    if (!token) {
      return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_UNAUTHORIZED);
    }
    
    const jwtSecret = process.env.JWT_SECRET || "your-super-secret-jwt-key";
    
    try {
      // Just verify the token is valid, don't need to check database
      jwt.verify(token, jwtSecret);
    } catch (error) {
      return Common.response(false, Messages.INVALID_TOKEN, 0, null, Constants.STATUS_UNAUTHORIZED);
    }

    // In a JWT-based system, logout is typically handled on the client-side
    // by simply removing the token. We return a success response to acknowledge
    // the logout request.
    
    // Note: In a more sophisticated system, you might want to:
    // 1. Blacklist the token (requires token storage/caching)
    // 2. Update user's last logout time
    // 3. Clean up any server-side sessions
    // 4. Log the logout event for security purposes

    return Common.response(
      true, 
      Messages.LOGOUT_SUCCESS, 
      0, 
      null, 
      Constants.STATUS_SUCCESS
    );
  } catch (error) {
    console.error("Logout error:", error);
    return Common.response(
      false, 
      Messages.INTERNAL_ERROR, 
      0, 
      null, 
      Constants.STATUS_INTERNAL_ERROR
    );
  }
};

module.exports = { handler: logout };