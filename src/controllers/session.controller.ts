import { Request, Response } from "express";

import UserService from "@services/user.service";

import { getToken } from "@utils/jwtHelper";

class SessionController {
  static async createSession(
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response
  ) {
    try {
      const user = await UserService.getUser(req.body.email);

      if (user === null) {
        res.status(400).send({
          status: 0,
          error: {
            fields: {
              email: "AUTHENTICATION_FAILED",
              password: "AUTHENTICATION_FAILED",
            },
            code: "AUTHENTICATION_FAILED",
          },
        });
        return;
      }

      const isPasswordMatch = req.body.password === user?.password;

      if (!isPasswordMatch) {
        res.status(400).send({
          status: 0,
          error: {
            fields: {
              email: "AUTHENTICATION_FAILED",
              password: "AUTHENTICATION_FAILED",
            },
            code: "AUTHENTICATION_FAILED",
          },
        });
        return;
      }

      const token = getToken(user.email);

      res.status(200).send({ token, status: 1 });
      return;
    } catch (error) {
      res.status(500).send(error);
      return;
    }
  }
}

export default SessionController;
