import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const jwtSecret: string = process.env.JWT_SECRET as string;
const expiresIn = process.env.JWT_EXPIRE_TIME || "1h";

export const getToken = (email: string): string =>
  jwt.sign({ email }, jwtSecret, {
    expiresIn,
  });
