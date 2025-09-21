import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '@/config/database'

interface GameAttributes {
  id: number
  name: string
  slug: string
  iconUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface GameCreationAttributes extends Optional<GameAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public id!: number
  public name!: string
  public slug!: string
  public iconUrl?: string
  public isActive!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Game.init(
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
    iconUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
    tableName: 'games',
    indexes: [
      {
        unique: true,
        fields: ['slug'],
      },
    ],
  }
)

export default Game