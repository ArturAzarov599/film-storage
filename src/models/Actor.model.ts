import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  HasMany,
  Unique,
  DataType,
} from "sequelize-typescript";

import MovieModel from "@models/Movie.model";
import MovieActorModel from "@models/MovieActor.model";

import { IActor, IActorModel } from "@interfaces/actor.interface";

@Table({
  tableName: "actors",
})
class ActorModel extends Model<IActorModel, IActor> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  name: string;

  @BelongsToMany(() => MovieModel, {
    through: { model: () => MovieActorModel },
  })
  movies: MovieModel[];

  @HasMany(() => MovieActorModel, {
    onDelete: "CASCADE",
  })
  movieActor: MovieActorModel[];
}

export default ActorModel;
