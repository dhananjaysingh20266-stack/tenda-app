const jwt = require("jsonwebtoken");
const { User, Organization } = require("../models");
const { Common } = require("./Common");
const { Messages } = require("./Messages");
const { Constants } = require("./Constants");

// Lambda-compatible authentication: attaches user to event, returns error response if unauthorized
const authenticate = async (event) => {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  if (!authHeader) {
    return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_UNAUTHORIZED);
  }
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!token) {
    return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_UNAUTHORIZED);
  }
  const jwtSecret = process.env.JWT_SECRET || "your-super-secret-jwt-key";
  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (error) {
    return Common.response(false, Messages.INVALID_TOKEN, 0, null, Constants.STATUS_UNAUTHORIZED);
  }
  const user = await User.findByPk(decoded.userId, {
    attributes: ["id", "email", "firstName", "lastName", "isActive", "organizationId"],
  });
  if (!user || !user.isActive) {
    return Common.response(false, Messages.USER_NOT_FOUND, 0, null, Constants.STATUS_UNAUTHORIZED);
  }
  // Attach user info to event
  event.user = {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    organizationId: user.organizationId || decoded.organizationId,
    type: decoded.type,
  };
  return event.user;
};

// Lambda-compatible org access check
const requireOrganizationAccess = async (event) => {
  if (!event.user?.organizationId) {
    return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_FORBIDDEN);
  }
  const organization = await Organization.findByPk(event.user.organizationId);
  if (!organization) {
    return Common.response(false, Messages.ORG_NOT_FOUND, 0, null, Constants.STATUS_FORBIDDEN);
  }
  event.organization = organization;
  return organization;
};

// Lambda-compatible individual access check
const requireIndividualAccess = async (event) => {
  if (event.user?.type !== "individual") {
    return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_FORBIDDEN);
  }
  return true;
};

module.exports = {
  authenticate,
  requireOrganizationAccess,
  requireIndividualAccess,
};
