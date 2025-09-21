import { APIGatewayProxyHandler } from 'aws-lambda'
import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import { authenticate, requireOrganizationAccess } from '@/middleware/auth'
import Organization from '@/models/Organization'
import { ApiResponse } from '@/utils/response'

const app = express()

app.use(cors())
app.use(express.json())

interface AuthenticatedRequest extends express.Request {
  user?: any
  organization?: any
}

app.put('/organizations/profile', 
  authenticate,
  requireOrganizationAccess,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { name, description, website, industry, companySize, billingEmail } = req.body

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
          where: { id: req.organization.id },
          returning: true,
        }
      )

      res.json(ApiResponse.success(updatedOrganization[1][0], 'Organization updated successfully'))
    } catch (error) {
      console.error('Update organization error:', error)
      res.status(500).json(ApiResponse.error('Internal server error'))
    }
  }
)

export const handler = serverless(app) as any