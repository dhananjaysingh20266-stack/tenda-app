const { User, Organization, LoginRequest, UserTypeLookup } = require("../../models");
const { Common } = require("../../helpers/Common");
const { Messages } = require("../../helpers/Messages");
const { Constants } = require("../../helpers/Constants");
const { authenticate, requireOrganizationAccess } = require("../../helpers/auth");

const getPendingLoginRequests = async (event, context) => {
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

    // Get pending login requests for users with userType "Member" in the organization
    const pendingRequests = await LoginRequest.findAll({
      where: {
        organizationId: event.user.organizationId,
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'user',
          required: true, // This ensures only login requests with matching users are returned
          include: [
            {
              model: UserTypeLookup,
              as: 'userType',
              where: {
                name: 'Member'
              },
              required: true // This ensures only users with userType "Member" are included
            }
          ],
          attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt']
        },
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform the data to match the expected client interface
    const transformedRequests = pendingRequests.map(request => ({
      id: request.id,
      userId: request.userId,
      organizationId: request.organizationId,
      deviceFingerprint: request.deviceFingerprint,
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
      status: request.status,
      approvedBy: request.approvedBy,
      rejectionReason: request.rejectionReason,
      expiresAt: request.expiresAt,
      createdAt: request.createdAt,
      user: request.user,
      organization: request.organization
    }));

    return Common.response(true, "Pending login requests retrieved successfully", transformedRequests.length, transformedRequests, Constants.STATUS_SUCCESS);
  } catch (error) {
    console.error("Get pending login requests error:", error);
    return Common.response(false, Messages.INTERNAL_ERROR, 0, null, Constants.STATUS_INTERNAL_ERROR);
  }
};

module.exports = { handler: getPendingLoginRequests };