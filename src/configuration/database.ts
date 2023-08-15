import Film from "@models/Film.model";
import { join } from "path";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  database: "some_db",
  dialect: "sqlite",
  storage: "data.sqlite",
  // models: [join(__dirname + "**/**/*.model.js")],
});

sequelize.addModels([Film]);

export default sequelize;
