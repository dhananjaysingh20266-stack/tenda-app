const { Organization } = require('../../models')
const { ApiResponse } = require('../../utils/response')
const { createResponse } = require('../../utils/lambda')
const { authenticate, requireOrganizationAccess } = require('../../utils/auth')

const updateOrganization = async (event, context) => {
  try {
    // Authenticate user
    const authResult = await authenticate(event)
    if (!authResult.success) {
      return createResponse(authResult.statusCode || 401, ApiResponse.error(authResult.error || 'Authentication failed'))
    }

    // Check organization access
    const orgResult = await requireOrganizationAccess(authResult.user)
    if (!orgResult.success) {
      return createResponse(orgResult.statusCode || 403, ApiResponse.error(orgResult.error || 'Access denied'))
    }

    // Parse request body
    const payloadData = event.body ? JSON.parse(event.body) : {}
    const { name, description, website, industry, companySize, billingEmail } = payloadData

    const updatedOrganization = await Organization.update(
      {
        name,
        description,
        website,
        industry,
        companySize,
        billingEmail,
      },
      {
        where: { id: orgResult.organization.id },
        returning: true,
      }
    )

    return createResponse(200, ApiResponse.success(updatedOrganization[1][0], 'Organization updated successfully'))
  } catch (error) {
    console.error('Update organization error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

module.exports = { handler: updateOrganization }