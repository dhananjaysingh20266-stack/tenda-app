const { LoginRequest, User, Organization } = require("../../models");
const { Common } = require("../../helpers/Common");
const { Messages } = require("../../helpers/Messages");
const { Constants } = require("../../helpers/Constants");
const { authenticate, requireOrganizationAccess } = require("../../helpers/auth");

const approveLoginRequest = async (event, context) => {
  try {
    // Authenticate the user
    const authResult = await authenticate(event);
    if (!authResult || authResult.statusCode) {
      return authResult; // Return auth error response
    }

    // Require organization access
    const orgAccessResult = await requireOrganizationAccess(event);
    if (!orgAccessResult || orgAccessResult.statusCode) {
      return orgAccessResult; // Return org access error response
    }

    const requestId = event.pathParameters?.requestId;
    if (!requestId) {
      return Common.response(false, "Request ID is required", 0, null, Constants.STATUS_BAD_REQUEST);
    }

    // Find the login request
    const loginRequest = await LoginRequest.findOne({
      where: { 
        id: requestId,
        organizationId: event.user.organizationId,
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        }
      ]
    });

    if (!loginRequest) {
      return Common.response(false, "Login request not found or already processed", 0, null, Constants.STATUS_NOT_FOUND);
    }

    // Check if request has expired
    if (new Date() > new Date(loginRequest.expiresAt)) {
      await loginRequest.update({
        status: 'expired',
        updatedAt: new Date()
      });
      return Common.response(false, "Login request has expired", 0, null, Constants.STATUS_BAD_REQUEST);
    }

    // Approve the login request
    await loginRequest.update({
      status: 'approved',
      approvedBy: event.user.userId,
      updatedAt: new Date()
    });

    return Common.response(true, "Login request approved successfully", 1, {
      requestId: loginRequest.id,
      userId: loginRequest.userId,
      user: loginRequest.user,
      approvedBy: event.user.userId,
      approvedAt: new Date()
    }, Constants.STATUS_SUCCESS);
  } catch (error) {
    console.error("Approve login request error:", error);
    return Common.response(false, Messages.INTERNAL_ERROR, 0, null, Constants.STATUS_INTERNAL_ERROR);
  }
};

module.exports = { handler: approveLoginRequest };