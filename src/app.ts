import express, { Express } from "express";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import sequelize from "@configuration/database";

import movieRouter from "@routes/movie.router";
import userRouter from "@routes/user.router";
import sessionRouter from "@routes/session.router";

import AppController from "@controllers/app.controller";
import { authMiddleware } from "@middlewares/auth.middleware";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT;

const prefix = "/api/v1/";

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  `${prefix}movies`,
  //  authMiddleware,
  movieRouter
);
app.use(`${prefix}users`, userRouter);
app.use(`${prefix}sessions`, sessionRouter);

app.use("*", AppController.get404Page);

const initDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync();
    console.log("Models sync completed successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

initDatabase().then(() =>
  app.listen(port, () => {
    console.log(`[server]: server is running on port: ${port}`);
  })
);
