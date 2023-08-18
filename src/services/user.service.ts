import UserModel from "@models/User.model";

import { IUser } from "@interfaces/user.interface";

class UserService {
  static createUser(user: IUser): Promise<UserModel> {
    return UserModel.create(user);
  }

  static getUser(email: string): Promise<UserModel | null> {
    return UserModel.findOne({ where: { email } });
  }
}

export default UserService;
