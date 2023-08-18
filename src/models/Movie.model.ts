import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";

import ActorModel from "@models/Actor.model";
import MovieActorModel from "@models/MovieActor.model";

import { IMovie, IMovieModel } from "@interfaces/movie.interface";

import { TMovieFormat } from "@customTypes/movie.types";

@Table({
  tableName: "movies",
})
class MovieModel extends Model<IMovieModel, IMovie> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  title: string;

  @Column
  year: number;

  @Column
  format: TMovieFormat;

  @BelongsToMany(() => ActorModel, {
    through: { model: () => MovieActorModel },
  })
  actors: ActorModel[];

  @HasMany(() => MovieActorModel, {
    onDelete: "CASCADE",
  })
  movieActor: MovieActorModel[];
}

export default MovieModel;
