const { Common } = require('../../helpers/Common')
const { Messages } = require('../../helpers/Messages')
const { Constants } = require('../../helpers/Constants')
const { verify } = require('../../helpers/Authorization')
const { CreateOrganizationSchema } = require('../../validators/organization')
const { Organization, User } = require('../../models')

/**
 * Creates a new organization and assigns the authenticated user as owner
 * Validates organization data, checks for duplicates, and enforces business rules
 */
const createOrganization = async (event, context) => {
  const { user } = event
  const { userId } = user || {}

  if (!userId) {
    return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_UNAUTHORIZED)
  }

  const payloadData = Common.parseBody(event.body)
  const { error, value } = CreateOrganizationSchema.validate(payloadData)

  if (error) {
    return Common.response(false, Messages.VLD_ERR(error), 0, null, Constants.STATUS_BAD_REQUEST)
  }

  const { name, description, website, industry, companySize, billingEmail } = value

  try {
    // Check if user already owns an organization
    const existingOrganization = await Organization.findOne({
      where: { ownerId: userId, isActive: true }
    })

    if (existingOrganization) {
      return Common.response(
        false, 
        'User already owns an organization', 
        0, 
        null, 
        Constants.STATUS_BAD_REQUEST
      )
    }

    // Check if organization name is already taken
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const nameExists = await Organization.findOne({
      where: { slug, isActive: true }
    })

    if (nameExists) {
      return Common.response(
        false, 
        'Organization name already exists', 
        0, 
        null, 
        Constants.STATUS_BAD_REQUEST
      )
    }

    // Verify user exists and is active
    const userDetail = await User.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'isActive'],
      where: { id: userId, isActive: true }
    })

    if (!userDetail) {
      return Common.response(false, Messages.NO_USER_FOUND, 0, null, Constants.STATUS_NOT_FOUND)
    }

    // Create organization
    const newOrganization = await Organization.create({
      name,
      slug,
      description,
      website,
      industry,
      companySize,
      billingEmail: billingEmail || userDetail.email,
      ownerId: userId,
      subscriptionTier: 'free',
      isActive: true
    })

    // Prepare response data
    const responseData = {
      organization: {
        id: newOrganization.id,
        name: newOrganization.name,
        slug: newOrganization.slug,
        description: newOrganization.description,
        website: newOrganization.website,
        industry: newOrganization.industry,
        companySize: newOrganization.companySize,
        billingEmail: newOrganization.billingEmail,
        subscriptionTier: newOrganization.subscriptionTier,
        isActive: newOrganization.isActive,
        createdAt: newOrganization.createdAt,
        owner: {
          id: userDetail.id,
          email: userDetail.email,
          firstName: userDetail.firstName,
          lastName: userDetail.lastName
        }
      },
      nextSteps: [
        'Invite team members to your organization',
        'Configure organization settings',
        'Start generating gaming keys',
        'Upgrade to premium for advanced features'
      ]
    }

    console.log(`Organization created successfully: ${newOrganization.name} (ID: ${newOrganization.id}) by user ${userId}`)

    return Common.response(
      true, 
      'Organization created successfully', 
      1, 
      responseData, 
      Constants.STATUS_CREATED
    )

  } catch (error) {
    console.error('Create organization error:', error)
    return Common.response(false, Messages.INTERNAL_ERROR, 0, null, Constants.STATUS_INTERNAL_ERROR)
  }
}

module.exports = { handler: verify(createOrganization) }