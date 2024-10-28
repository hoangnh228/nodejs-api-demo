import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
import { SubMenu } from "./sub-menu";
import Role from "./role";

interface RoleMenuAccessAttributes {
  id?: number,
  roleId?: number | null,
  submenuId?: number | null,
  active?: boolean | null,

  createdAt?: Date,
  updatedAt?: Date
}

export interface RoleMenuAccessInput extends Optional<RoleMenuAccessAttributes, 'id'> {}
export interface RoleMenuAccessOutput extends Required<RoleMenuAccessAttributes> {}

class RoleMenuAccess extends Model<RoleMenuAccessAttributes, RoleMenuAccessInput> implements RoleMenuAccessAttributes {
  public id!: number;
  public roleId!: number | null;
  public submenuId!: number | null;
  public active!: boolean | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoleMenuAccess.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  submenuId: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  sequelize: connection,
  tableName: 'RoleMenuAccesses',
  underscored: false,
  timestamps: true,
});

RoleMenuAccess.belongsTo(SubMenu, { foreignKey: 'submenuId' });
RoleMenuAccess.belongsTo(Role, { foreignKey: 'roleId' });

export default RoleMenuAccess;