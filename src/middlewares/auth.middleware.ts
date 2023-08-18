import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      res.status(401).send({
        status: 0,
        error: {
          fields: {
            token: "REQUIRED",
          },
          code: "FORMAT_ERROR",
        },
      });
      return;
    }

    jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};
