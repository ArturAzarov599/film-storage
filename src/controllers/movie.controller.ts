import { Request, Response } from "express";

import MovieService from "@services/movie.service";
import ActorService from "@services/actors.service";
import MovieActorService from "@services/movie-actor.service";

import { extractDataFromTxtFile } from "@utils/extractDataFromTxtFile";

import { ICreateMovie, IGetMoviesQuery } from "@interfaces/movie.interface";

class MovieController {
  static async createMovie(
    req: Request<{}, {}, ICreateMovie>,
    res: Response
  ): Promise<void> {
    try {
      const { actors, ...movieData } = req.body;
      const movie = await MovieService.getMovieBySpecificField(
        "title",
        movieData.title
      );

      if (movie) {
        res.status(403).send({
          status: 0,
          error: {
            fields: {
              title: "NOT_UNIQUE",
            },
            code: "MOVIE_EXISTS",
          },
        });
        return;
      }

      const actorNames = actors.map((actor) => ({ name: actor }));
      const listOfActors = await ActorService.createActors(actorNames);
      const data = await MovieService.createMovie(movieData, listOfActors);
      res.status(201).send({
        data,
        status: 1,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async deleteMovie(
    req: Request<{ id: number }>,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const movie = await MovieService.getMovieBySpecificField("id", id);

      if (!movie) {
        res.status(404).send({
          status: 0,
          error: {
            fields: {
              id,
            },
            code: "MOVIE_NOT_FOUND",
          },
        });
        return;
      }

      await MovieService.deleteMovie(id);
      res.status(200).send({ status: 1 });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async updateMovie(
    req: Request<{ id: number }, {}, ICreateMovie>,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const movie = await MovieService.getMovieBySpecificField("id", id);

      if (!movie) {
        res.status(404).send({
          status: 0,
          error: {
            fields: {
              id,
            },
            code: "MOVIE_NOT_FOUND",
          },
        });
        return;
      }

      const movieWithSameTitle = await MovieService.getMovieBySpecificField(
        "title",
        req.body.title
      );

      if (movieWithSameTitle) {
        res.status(404).send({
          status: 0,
          error: {
            fields: {
              id,
            },
            code: "TITLE_NOT_UNIQUE",
          },
        });
        return;
      }

      const { actors, ...movieData } = req.body;
      const actorsList = actors.map((actor) => ({ name: actor }));
      const [actorsObjects] = await Promise.all([
        ActorService.createActors(actorsList),
        MovieService.updateMovie(id, movieData),
        MovieActorService.deleteMoviesByMovieId(id),
      ]);
      await movie.$add("actors", actorsObjects);
      const newActorsList = actorsObjects?.map((aD) => aD.dataValues);

      res.status(200).send({
        data: {
          id,
          ...movieData,
          actors: newActorsList,
        },
        status: 1,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async getMovieDetails(
    req: Request<{ id: number }>,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const movie = await MovieService.getMovie(id);

      if (!movie) {
        res.status(404).send({
          status: 0,
          error: {
            fields: {
              id,
            },
            code: "MOVIE_NOT_FOUND",
          },
        });
        return;
      }

      res.status(200).send({
        data: movie,
        status: 1,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async getMovies(
    req: Request<{}, {}, {}, IGetMoviesQuery>,
    res: Response
  ): Promise<void> {
    try {
      const result = await MovieService.getMovies(req.query);
      const normalizeResult = result.map((record) => record.dataValues);

      res.status(200).send({
        data: normalizeResult,
        meta: {
          total: normalizeResult.length,
        },
        status: 1,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static getTemplate(_: Request, res: Response): void {
    res.render("import-movies");
  }

  static getSuccessPage(_: Request, res: Response): void {
    res.render("import-movies-success");
  }

  static getFailPage(
    req: Request<{}, {}, {}, { message?: string }>,
    res: Response
  ): void {
    res.render("import-movies-fail", {
      message:
        req.query.message || "Something went wrong. Please try again later",
    });
  }

  static async saveImportedData(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.redirect("/api/v1/movie/import-failure?message=Can't find file");
      return;
    }

    if (!req.file?.originalname.endsWith(".txt")) {
      res.redirect(
        "/api/v1/movie/import-failure?message=Bad file format. Require txt"
      );
      return;
    }

    if (req.file) {
      try {
        let createdCount: number = 0;
        const result = extractDataFromTxtFile(req.file);
        const movies = await Promise.all(
          result.validMovies.map(async ({ actors, ...rest }) => {
            try {
              const movie = await MovieService.getMovieBySpecificField(
                "title",
                rest.title
              );

              if (movie) {
                throw new Error(
                  `Movie with title: ${rest.title} already exists`
                );
              }

              const newActors = await ActorService.createActors(actors);
              const newMovie = await MovieService.createMovie(rest, newActors);
              createdCount += 1;
              return newMovie;
            } catch (error) {
              return null;
            }
          })
        );

        res.send({
          data: movies.filter((v) => v),
          meta: {
            total: result.totalCount,
            imported: createdCount,
          },
          status: 1,
        });
        // res.redirect("/api/v1/movies/import-movies-success");
      } catch (error) {
        res.send(error).status(500);
        // res.redirect("/api/v1/movies/import-failure");
      }
    }
  }
}

export default MovieController;
