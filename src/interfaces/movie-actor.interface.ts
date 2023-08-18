import ActorModel from "@models/Actor.model";
import MovieModel from "@models/Movie.model";

export interface IMovieActor {
  movie: MovieModel;
  movieId: number;
  actor: ActorModel;
  actorId: number;
}
