import { Router } from "express";
import multer from "multer";

import MovieController from "@controllers/movie.controller";

import {
  validateIdParamMiddleware,
  validateCreateMovieDataMiddleware,
  validateUpdateMovieDataMiddleware,
  validateGetMoviesQueryParamsMiddleware,
} from "@middlewares/validation.middleware";

const movieRouter: Router = Router();
const upload = multer({
  dest: "uploads/",
});

movieRouter.post(
  "/",
  validateCreateMovieDataMiddleware,
  MovieController.createMovie
);

movieRouter.delete(
  "/:id",
  validateIdParamMiddleware,
  MovieController.deleteMovie
);

movieRouter.patch(
  "/:id",
  validateUpdateMovieDataMiddleware,
  MovieController.updateMovie
);

movieRouter.get("/import-movies", MovieController.getTemplate);

movieRouter.get(
  "/",
  validateGetMoviesQueryParamsMiddleware,
  MovieController.getMovies
);

movieRouter.get(
  "/:id",
  validateIdParamMiddleware,
  MovieController.getMovieDetails
);

movieRouter.post(
  "/import-movies",
  upload.single("data"),
  MovieController.saveImportedData
);

movieRouter.get("/import-movies-success", MovieController.getSuccessPage);

movieRouter.get("/import-movies-failure", MovieController.getFailPage);

export default movieRouter;
