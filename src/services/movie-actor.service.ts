import MovieActorModel from "@models/MovieActor.model";

class MovieActorService {
  static deleteMoviesByMovieId(movieId: number): Promise<number> {
    return MovieActorModel.destroy({ where: { movieId } });
  }
}

export default MovieActorService;
