import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

import MovieModel from "@models/Movie.model";
import UserModel from "@models/User.model";
import ActorModel from "@models/Actor.model";
import MovieActorModel from "@models/MovieActor.model";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DATABASE_NAME,
  dialect: "sqlite",
  storage: process.env.DATABASE_STORAGE_NAME,
});

sequelize.addModels([MovieModel, UserModel, ActorModel, MovieActorModel]);

export default sequelize;
