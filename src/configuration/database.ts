import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

import Film from "@models/Film.model";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DATABASE_NAME,
  dialect: "sqlite",
  storage: process.env.DATABASE_STORAGE_NAME,
});

sequelize.addModels([Film]);

export default sequelize;
