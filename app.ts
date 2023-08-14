import express from "express";
import dotenv from "dotenv";

import type { Request, Response, Express } from "express";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response, next) => {
  res.send("Express + TS Server + Changes");
});

app.listen(port, () => {
  console.log(`[server]: server is running on port: ${port}`);
});
