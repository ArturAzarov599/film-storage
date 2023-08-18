import { Table, Model, Column, PrimaryKey } from "sequelize-typescript";

import { IUser } from "@interfaces/user.interface";

@Table({
  tableName: "users",
})
class UserModel extends Model<IUser, IUser> {
  @PrimaryKey
  @Column
  email: string;

  @Column
  name: string;

  @Column
  password: string;
}

export default UserModel;
