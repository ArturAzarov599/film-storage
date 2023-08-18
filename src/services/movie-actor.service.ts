import { Op } from "sequelize";

import MovieModel from "@models/Movie.model";
import ActorModel from "@models/Actor.model";
import MovieActorModel from "@models/MovieActor.model";

import { IGetMoviesQuery } from "@interfaces/movie.interface";

class MovieActorService {
  static deleteMoviesByMovieId(movieId: number): Promise<number> {
    return MovieActorModel.destroy({ where: { movieId } });
  }

  static findMovies({
    limit,
    offset,
    order = "ASC",
    sort = "id",
    actor = "",
    search = "",
    title = "",
  }: IGetMoviesQuery) {
    const [searchTitle, searchActor] = search.split(":");
    const movieTitle = searchTitle || title;
    const movieActor = searchActor || actor;

    return MovieActorModel.findAll({
      include: [
        {
          model: ActorModel,
          where: {
            name: {
              [Op.like]: `%${movieActor}%`,
            },
          },
          attributes: [],
        },
        {
          model: MovieModel,
          where: {
            title: {
              [Op.like]: `%${movieTitle}%`,
            },
          },
          order: [sort, order],
        },
      ],
      limit,
      offset,
      attributes: [],
    });
  }
}

export default MovieActorService;
