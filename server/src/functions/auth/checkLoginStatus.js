const { LoginRequest, User, Organization } = require("../../models");
const { Common } = require("../../helpers/Common");
const { Messages } = require("../../helpers/Messages");
const { Constants } = require("../../helpers/Constants");

const checkLoginStatus = async (event, context) => {
  try {
    const requestId = event.pathParameters?.requestId;
    if (!requestId) {
      return Common.response(false, "Request ID is required", 0, null, Constants.STATUS_BAD_REQUEST);
    }

    // Find the login request
    const loginRequest = await LoginRequest.findOne({
      where: { id: requestId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        },
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!loginRequest) {
      return Common.response(false, "Login request not found", 0, null, Constants.STATUS_NOT_FOUND);
    }

    let status = loginRequest.status;

    // Check if request has expired but not marked as expired
    if (status === 'pending' && new Date() > new Date(loginRequest.expiresAt)) {
      // Mark as expired
      await loginRequest.update({
        status: 'expired',
        updatedAt: new Date()
      });
      status = 'expired';
    }

    const responseData = {
      requestId: loginRequest.id,
      status: status,
      userId: loginRequest.userId,
      organizationId: loginRequest.organizationId,
      expiresAt: loginRequest.expiresAt,
      createdAt: loginRequest.createdAt,
      user: loginRequest.user,
      organization: loginRequest.organization
    };

    // Include additional info based on status
    if (status === 'approved') {
      responseData.approvedBy = loginRequest.approvedBy;
      responseData.approvedAt = loginRequest.updatedAt;
    } else if (status === 'rejected') {
      responseData.rejectedBy = loginRequest.approvedBy;
      responseData.rejectionReason = loginRequest.rejectionReason;
      responseData.rejectedAt = loginRequest.updatedAt;
    }

    return Common.response(true, "Login status retrieved successfully", 1, responseData, Constants.STATUS_SUCCESS);
  } catch (error) {
    console.error("Check login status error:", error);
    return Common.response(false, Messages.INTERNAL_ERROR, 0, null, Constants.STATUS_INTERNAL_ERROR);
  }
};

module.exports = { handler: checkLoginStatus };