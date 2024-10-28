import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";

interface SubMenuAttributes {
  id?: number,
  masterMenuId?: number | null,
  name?: string | null,
  url?: string | null,
  icon?: string | null,
  title?: string | null,
  ordering?: number | null,
  isTargetSelf?: boolean | null,
  active?: boolean | null,

  createdAt?: Date,
  updatedAt?: Date
}

export interface SubMenuInput extends Optional<SubMenuAttributes, 'id'> {}
export interface SubMenuOutput extends Required<SubMenuAttributes> {}

export class SubMenu extends Model<SubMenuAttributes, SubMenuInput> implements SubMenuAttributes {
  public id!: number;
  public masterMenuId!: number | null;
  public name!: string | null;
  public url!: string | null;
  public icon!: string | null;
  public title!: string | null;
  public ordering!: number | null;
  public isTargetSelf!: boolean | null;
  public active!: boolean | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SubMenu.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  masterMenuId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ordering: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  isTargetSelf: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  sequelize: connection,
  tableName: 'Submenus',
  underscored: false,
  timestamps: true,
});