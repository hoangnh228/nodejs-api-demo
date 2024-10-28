import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
import { SubMenu } from "./sub-menu";

interface MasterMenuAttributes {
  id?: number,
  name?: string | null,
  icon?: string | null,
  ordering?: number | null,
  active?: boolean | null,

  createdAt?: Date,
  updatedAt?: Date
}

export interface MasterMenuInput extends Optional<MasterMenuAttributes, 'id'> {}
export interface MasterMenuOutput extends Required<MasterMenuAttributes> {}

class MasterMenu extends Model<MasterMenuAttributes, MasterMenuInput> implements MasterMenuAttributes {
  public id!: number;
  public name!: string | null;
  public icon!: string | null;
  public ordering!: number | null;
  public active!: boolean | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MasterMenu.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ordering: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  sequelize: connection,
  tableName: 'MasterMenus',
  underscored: false,
  timestamps: true,
});

MasterMenu.hasMany(SubMenu);

export default MasterMenu;