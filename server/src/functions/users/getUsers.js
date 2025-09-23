const { User, OrganizationMember } = require("../../models");
const { ApiResponse } = require("../../utils/response");
const { authenticate, requireOrganizationAccess } = require("../../helpers/auth");
const { createResponse } = require("../../utils/lambda");
const { Op } = require("sequelize");

module.exports.handler = async (event) => {
  try {
    // Authenticate and authorize (implement these helpers for Lambda event)
    const user = await authenticate(event);
    await requireOrganizationAccess(user);

    const { organizationId } = user;
    const query = event.queryStringParameters || {};
    const { status, role, search } = query;

    let whereClause = { organizationId };

    if (status && status !== "all") {
      whereClause.status = status;
    }

    if (role && role !== "all") {
      whereClause.role = role;
    }

    // Build search conditions for user fields
    let userWhereClause = {};
    if (search) {
      userWhereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const members = await OrganizationMember.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          where: userWhereClause,
          attributes: ["id", "email", "firstName", "lastName", "isActive", "emailVerified", "createdAt"]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    const transformedMembers = members.map((member) => ({
      id: member.user.id,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      email: member.user.email,
      role: member.role,
      status: member.status,
      lastActive: getTimeAgo(member.lastActive),
      joinedAt: member.joinedAt || member.createdAt,
      permissions: member.permissions || getDefaultPermissions(member.role),
    }));

    return createResponse(200, ApiResponse.success(transformedMembers, "Members retrieved successfully"));
  } catch (error) {
    console.error("Get users error:", error);
    return createResponse(500, ApiResponse.error("Failed to retrieve members"));
  }
};

// Helper functions
function getDefaultPermissions(role) {
  switch (role) {
    case 'admin':
      return ['manage_users', 'manage_keys', 'view_analytics', 'manage_organization'];
    case 'member':
      return ['manage_keys', 'view_analytics'];
    case 'viewer':
      return ['view_analytics'];
    default:
      return [];
  }
}

function getTimeAgo(date) {
  if (!date) return 'Never';
  
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}
