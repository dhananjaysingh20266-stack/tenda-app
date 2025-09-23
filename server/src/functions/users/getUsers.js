const { User } = require("../../models");
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
    const { status, search } = query;

    let whereClause = { organizationId };

    if (status && status !== "all") {
      whereClause.isActive = status === "active";
    }

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ["id", "email", "firstName", "lastName", "isActive", "emailVerified", "createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });

    const transformedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.id === user.userId ? "admin" : "member",
      status: user.isActive ? "active" : "inactive",
      lastActive: "2 hours ago",
      joinedAt: user.createdAt,
      permissions: user.id === user.userId ? ["manage_users", "manage_keys", "view_analytics"] : ["manage_keys", "view_analytics"],
    }));

    return createResponse(200, ApiResponse.success(transformedUsers, "Members retrieved successfully"));
  } catch (error) {
    console.error("Get users error:", error);
    return createResponse(500, ApiResponse.error("Failed to retrieve members"));
  }
};
