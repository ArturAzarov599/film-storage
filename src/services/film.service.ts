import { Op } from "sequelize";

import FilmModel from "@models/Film.model";

import {
  IFilmAttributes,
  IFilmCreationAttributes,
} from "@interfaces/film.interface";

class FilmService {
  static getFilms(
    field?: keyof IFilmAttributes,
    value?: string
  ): Promise<FilmModel[]> {
    if (field && value) {
      return FilmModel.findAll({
        where: { [field]: { [Op.like]: `%${value}%` } },
        order: [["title", "ASC"]],
        attributes: ["id", "title"],
      });
    }

    return FilmModel.findAll({
      order: [["title", "ASC"]],
      attributes: ["id", "title"],
    });
  }

  static getFilmById(id: string): Promise<FilmModel | null> {
    return FilmModel.findOne({ where: { id: +id } });
  }

  static createFilm(data: IFilmCreationAttributes): Promise<FilmModel> {
    return FilmModel.create(data);
  }

  static updateFilm(data: IFilmAttributes): Promise<[number]> {
    return FilmModel.update(data, { where: { id: data.id } });
  }

  static deleteFilm(id: string): Promise<number> {
    return FilmModel.destroy({ where: { id: +id } });
  }

  static bulkCreate(films: IFilmCreationAttributes[]): Promise<FilmModel[]> {
    return FilmModel.bulkCreate(films);
  }

  // static getFilmById(id: number): Promise<FilmModel | null> {
  //   return Film.findByPk(id);
  // }
}

export default FilmService;
