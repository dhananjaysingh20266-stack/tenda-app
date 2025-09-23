const bcrypt = require("bcryptjs");
const { User, Organization, UserTypeLookup, OrganizationMember } = require("../../models");
const { loginSchema } = require("../../validators/auth");
const { generateToken } = require("../../utils/jwt");
const { Common } = require("../../helpers/Common");
const { Messages } = require("../../helpers/Messages");
const { Constants } = require("../../helpers/Constants");

const login = async (event, context) => {
  try {
    // Parse request body
    const payloadData = Common.parseBody(event.body);

    // Validate input
    const { error, value } = loginSchema.validate(payloadData);
    if (error) {
      return Common.response(false, Messages.VLD_ERR(error), 0, null, Constants.STATUS_BAD_REQUEST);
    }

    const { email, password, loginType } = value;

    // Find user with user type information
    const user = await User.findOne({
      where: { email, isActive: true },
      include: [
        {
          model: UserTypeLookup,
          as: 'userType',
        }
      ]
    });

    if (!user) {
      return Common.response(false, Messages.USER_NOT_FOUND, 0, null, Constants.STATUS_BAD_REQUEST);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      // Increment login attempts
      await user.increment("loginAttempts");
      if (user.loginAttempts >= 5) {
        await user.update({
          lockedUntil: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        });
      }
      return Common.response(false, Messages.INVALID_CREDENTIALS, 0, null, Constants.STATUS_BAD_REQUEST);
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return Common.response(false, Messages.ACCOUNT_LOCKED, 0, null, Constants.STATUS_LOCKED);
    }

    let organization = null;
    let userTypeInfo = user.userType?.name || null;

    if (loginType === "organization") {
      // Organization login - only owners can login as organization
      if (userTypeInfo !== "Owner") {
        return Common.response(false, "Only organization owners can login as organization", 0, null, Constants.STATUS_FORBIDDEN);
      }
      
      organization = await Organization.findOne({
        where: { ownerId: user.id, isActive: true },
      });

      if (!organization) {
        return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_FORBIDDEN);
      }
    } else if (loginType === "individual") {
      // Individual login - members and owners can login individually
      // For members, get their organization information through membership
      if (userTypeInfo === "Member") {
        const membership = await OrganizationMember.findOne({
          where: { userId: user.id, status: 'active' },
          include: [
            {
              model: Organization,
              as: 'organization',
              where: { isActive: true }
            }
          ]
        });

        if (membership) {
          organization = membership.organization;
        }
      } else if (userTypeInfo === "Owner") {
        // Owner can also login individually
        organization = await Organization.findOne({
          where: { ownerId: user.id, isActive: true },
        });
      }
    }

    // Reset login attempts on successful login
    await user.update({
      loginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date(),
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      organizationId: organization?.id,
      type: loginType,
      userType: userTypeInfo,
    });

    // Remove password hash from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: loginType,
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
    console.error("Login error:", error);
    return Common.response(false, Messages.INTERNAL_ERROR, 0, null, Constants.STATUS_INTERNAL_ERROR);
  }
};

module.exports = { handler: login };
