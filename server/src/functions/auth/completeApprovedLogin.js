const { User, Organization, LoginRequest, UserTypeLookup, OrganizationMember } = require("../../models");
const { generateToken } = require("../../utils/jwt");
const { Common } = require("../../helpers/Common");
const { Messages } = require("../../helpers/Messages");
const { Constants } = require("../../helpers/Constants");

const completeApprovedLogin = async (event, context) => {
  try {
    const requestId = event.pathParameters?.requestId;
    if (!requestId) {
      return Common.response(false, "Request ID is required", 0, null, Constants.STATUS_BAD_REQUEST);
    }

    // Find the approved login request
    const loginRequest = await LoginRequest.findOne({
      where: { 
        id: requestId,
        status: 'approved'
      },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: UserTypeLookup,
              as: 'userType'
            }
          ]
        },
        {
          model: Organization,
          as: 'organization'
        }
      ]
    });

    if (!loginRequest) {
      return Common.response(false, "Approved login request not found", 0, null, Constants.STATUS_NOT_FOUND);
    }

    // Check if request has expired (even if approved, there should be a reasonable time limit)
    const approvalExpiryTime = new Date(loginRequest.updatedAt.getTime() + 10 * 60 * 1000); // 10 minutes after approval
    if (new Date() > approvalExpiryTime) {
      await loginRequest.update({
        status: 'expired',
        updatedAt: new Date()
      });
      return Common.response(false, "Approved login request has expired", 0, null, Constants.STATUS_BAD_REQUEST);
    }

    const user = loginRequest.user;
    const organization = loginRequest.organization;
    const userTypeInfo = user.userType?.name || null;

    // Update user's last login
    await user.update({
      lastLogin: new Date(),
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      organizationId: organization?.id,
      type: 'individual',
      userType: userTypeInfo,
    });

    // Mark login request as used/completed
    await loginRequest.update({
      status: 'completed',
      updatedAt: new Date()
    });

    // Remove password hash from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: 'individual',
      userType: userTypeInfo,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const responseData = {
      user: userResponse,
      organization,
      token,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    };

    return Common.response(true, Messages.LOGIN_SUCCESS, 1, responseData, Constants.STATUS_SUCCESS);
  } catch (error) {
    console.error("Complete approved login error:", error);
    return Common.response(false, Messages.INTERNAL_ERROR, 0, null, Constants.STATUS_INTERNAL_ERROR);
  }
};

module.exports = { handler: completeApprovedLogin };