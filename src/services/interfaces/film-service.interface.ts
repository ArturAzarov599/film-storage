import { IFilmCreationAttributes } from "@interfaces/film.interface";
import Film from "@models/Film.model";

export abstract class IFilmService {
  abstract findAll(): Film[];
  abstract findOne(id: number): Film;
  abstract findBy(star: string, title: string): Film[];
  abstract create(data: IFilmCreationAttributes): Film;
  abstract update(data: IFilmCreationAttributes): Film;
  abstract delete(id: number): boolean;
  abstract importFilms(films: Film[]): Film[];
}
