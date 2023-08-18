import MovieModel from "@models/Movie.model";
import ActorModel from "@models/Actor.model";

import {
  IMovie,
  IMovieModel,
  IMovieFullData,
} from "@interfaces/movie.interface";
import { IActorModel } from "@interfaces/actor.interface";

class MovieService {
  static getMovieBySpecificField(
    field: keyof IMovieModel,
    value: string | number
  ): Promise<MovieModel | null> {
    return MovieModel.findOne({ where: { [field]: value } });
  }

  static async createMovie(
    data: IMovie,
    actors: ActorModel[]
  ): Promise<IMovieFullData> {
    const movie = await MovieModel.create(data);
    await movie.$add("actors", actors);
    const actorsData: IActorModel[] = actors.map((star) => star.dataValues);

    return {
      ...movie.dataValues,
      actors: actorsData,
    };
  }

  static deleteMovie(id: number): Promise<number> {
    return MovieModel.destroy({ where: { id: +id } });
  }

  static async updateMovie(id: number, data: IMovie): Promise<[number]> {
    return MovieModel.update(data, { where: { id } });
  }

  static async getMovie(id: number) {
    const movie = await MovieModel.findOne({
      where: { id },
      include: [
        {
          model: ActorModel,
        },
      ],
    });

    if (!movie) return null;

    return {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      format: movie.format,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
      actors: movie.actors.map((actor) => ({
        id: actor.id,
        name: actor.name,
        createdAt: actor.createdAt,
        updatedAt: actor.updatedAt,
      })),
    };
  }
}

export default MovieService;
