import { IDefaultModel } from "@interfaces/default-model.interface";

export interface IUser {
  email: string;
  name: string;
  password: string;
}

export interface ICreateUser extends IUser {
  confirmPassword: string;
}

export interface IUserModel extends IUser, IDefaultModel {}
