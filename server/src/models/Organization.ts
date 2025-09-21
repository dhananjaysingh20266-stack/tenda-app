import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '@/config/database'
import User from './User'

interface OrganizationAttributes {
  id: number
  name: string
  slug: string
  description?: string
  ownerId: number
  logoUrl?: string
  website?: string
  industry?: string
  companySize?: string
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise'
  billingEmail?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface OrganizationCreationAttributes extends Optional<OrganizationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Organization extends Model<OrganizationAttributes, OrganizationCreationAttributes> implements OrganizationAttributes {
  public id!: number
  public name!: string
  public slug!: string
  public description?: string
  public ownerId!: number
  public logoUrl?: string
  public website?: string
  public industry?: string
  public companySize?: string
  public subscriptionTier!: 'free' | 'basic' | 'premium' | 'enterprise'
  public billingEmail?: string
  public isActive!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Organization.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    logoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    companySize: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    subscriptionTier: {
      type: DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'),
      allowNull: false,
      defaultValue: 'free',
    },
    billingEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'organizations',
    indexes: [
      {
        unique: true,
        fields: ['slug'],
      },
      {
        fields: ['ownerId'],
      },
    ],
  }
)

// Define associations
Organization.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' })
User.hasOne(Organization, { foreignKey: 'ownerId', as: 'ownedOrganization' })

export default Organization