import express, { Express } from "express";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import sequelize from "@configuration/database";

import filmsRouter from "@routes/films";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/films", filmsRouter);

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

initDatabase();

app.listen(port, () => {
  console.log(`[server]: server is running on port: ${port}`);
});
