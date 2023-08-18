import { Request, Response } from "express";

import UserService from "@services/user.service";

import { getToken } from "@utils/jwtHelper";

import { ICreateUser } from "@interfaces/user.interface";

class UserController {
  static async createUser(
    req: Request<{}, {}, ICreateUser>,
    res: Response
  ): Promise<void> {
    try {
      const { confirmPassword, ...userData } = req.body;
      const user = await UserService.getUser(userData.email);

      if (user) {
        res.status(400).send({
          status: 0,
          error: {
            fields: {
              email: "NOT_UNIQUE",
            },
            code: "EMAIL_NOT_UNIQUE",
          },
        });
        return;
      }

      const newUser = await UserService.createUser(userData);
      const token = getToken(newUser.email);

      res.status(200).send({
        token,
        status: 1,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default UserController;
