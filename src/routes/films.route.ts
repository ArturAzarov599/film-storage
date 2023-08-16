import { Router } from "express";
import multer from "multer";

import FilmController from "@controllers/film.controller";

const filmsRouter = Router();
const upload = multer({
  dest: "uploads/",
});

filmsRouter.get("/", FilmController.getFilms);

filmsRouter.get("/single-film/:id", FilmController.getFilmById);

filmsRouter.get("/find-by", FilmController.getBy);

filmsRouter.post("/", FilmController.createFilm);

filmsRouter.put("/", FilmController.updateFilm);

filmsRouter.delete("/:id", FilmController.deleteFilm);

filmsRouter.get("/import-films", FilmController.getTemplate);

filmsRouter.post(
  "/import-films",
  upload.single("data"),
  FilmController.saveImportedData
);

filmsRouter.get("/import-films-success", FilmController.getSuccessPage);

filmsRouter.get("/import-films-failure", FilmController.getFailPage);

export default filmsRouter;
