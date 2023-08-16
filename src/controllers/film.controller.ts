import { Request, Response } from "express";

import FilmService from "@services/film.service";

import { importFilmsDataToDatabase } from "@utils/save-data-in-database";

import {
  IFilmAttributes,
  IFilmCreationAttributes,
} from "@interfaces/film.interface";

class FilmController {
  static async getFilms(_: Request, res: Response): Promise<void> {
    try {
      const films = await FilmService.getFilms();
      res.status(200).send(films);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getFilmById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> {
    try {
      const film = await FilmService.getFilmById(req.params.id);

      res.status(200).send(film || {});
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async getBy(
    req: Request<{}, {}, {}, { title?: string; star?: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { star, title } = req.query;

      if (star) {
        const films = await FilmService.getFilms("stars", star);
        res.status(200).send(films);
      }

      if (title) {
        const films = await FilmService.getFilms("title", title);
        res.status(200).send(films);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async createFilm(
    req: Request<{}, {}, IFilmCreationAttributes>,
    res: Response
  ): Promise<void> {
    try {
      const film = await FilmService.createFilm(req.body);
      res.status(201).send(film);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async updateFilm(
    req: Request<{}, {}, IFilmAttributes>,
    res: Response
  ): Promise<void> {
    try {
      const film = await FilmService.updateFilm(req.body);
      res.status(200).send(film);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async deleteFilm(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> {
    try {
      const result = await FilmService.deleteFilm(req.params.id);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static getTemplate(_: Request, res: Response): void {
    res.render("import-films");
  }

  static getSuccessPage(_: Request, res: Response): void {
    res.render("import-films-success");
  }

  static getFailPage(
    req: Request<{}, {}, {}, { message?: string }>,
    res: Response
  ): void {
    res.render("import-films-fail", {
      message:
        req.query.message || "Something went wrong. Please try again later",
    });
  }

  static async saveImportedData(req: Request, res: Response): Promise<void> {
    if (!req.file)
      res.redirect("/films/import-films-failure?message=Can't find file");

    if (req.file?.mimetype !== "text/plain")
      res.redirect(
        "/films/import-films-failure?message=Bad file format. Require txt"
      );

    if (req.file) {
      try {
        const films = importFilmsDataToDatabase(req.file);
        const createdFilms = await FilmService.bulkCreate(films);

        res.redirect("/films/import-films-success");
      } catch (error) {
        res.redirect("/films/import-films-failure");
      }
    }
  }
}

export default FilmController;
