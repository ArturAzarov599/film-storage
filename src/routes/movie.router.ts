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

movieRouter.get(
  "/",
  validateGetMoviesQueryParamsMiddleware,
  MovieController.getMovies
);

movieRouter.post(
  "/import",
  upload.single("movies"),
  MovieController.saveImportedData
);

movieRouter.get(
  "/:id",
  validateIdParamMiddleware,
  MovieController.getMovieDetails
);

movieRouter.get("/import", MovieController.getTemplate);

movieRouter.get("/import-success", MovieController.getSuccessPage);

movieRouter.get("/import-failure", MovieController.getFailPage);

export default movieRouter;
