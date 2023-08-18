import {
  Table,
  Model,
  Column,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";

import MovieModel from "@models/Movie.model";
import ActorModel from "@models/Actor.model";

import { IMovieActor } from "@interfaces/movie-actor.interface";

@Table({
  tableName: "movie_actor",
})
class MovieActorModel extends Model<IMovieActor, IMovieActor> {
  @BelongsTo(() => MovieModel)
  movie: MovieModel;

  @ForeignKey(() => MovieModel)
  @PrimaryKey
  @Column
  movieId: number;

  @BelongsTo(() => ActorModel)
  actor: ActorModel;

  @ForeignKey(() => ActorModel)
  @PrimaryKey
  @Column
  actorId: number;
}

export default MovieActorModel;
