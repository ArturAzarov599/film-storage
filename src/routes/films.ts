import { Router, Request, Response } from "express";
import { Op } from "sequelize";
import multer from "multer";

import Film from "@models/Film.model";

import { importFilmsDataToDatabase } from "@utils/save-data-in-database";

import { IFilmAttributes } from "@interfaces/film.interface";

const filmsRouter = Router();
const upload = multer({
  dest: "uploads/",
});

filmsRouter.get("/", async (_: Request, res: Response) => {
  const films: Film[] = await Film.findAll({
    order: [["title", "ASC"]],
    attributes: ["id", "title"],
  });

  return res.status(200).send(films);
});

filmsRouter.get(
  "/single-film/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const film = await Film.findOne({ where: { id: req.params.id } });

    return res.status(200).send(film);
  }
);

filmsRouter.get(
  "/find-by",
  async (
    req: Request<{}, {}, {}, { title?: string; star?: string }>,
    res: Response
  ) => {
    const { star, title } = req.query;

    if (star) {
      const films = await Film.findAll({
        where: { stars: { [Op.like]: `%${star}%` } },
      });
      return res.status(200).send(films);
    }

    if (title) {
      const films = await Film.findAll({
        where: { title: { [Op.like]: `%${title}%` } },
        order: [["release_year", "ASC"]],
      });
      return res.status(200).send(films);
    }

    return res.status(204).send();
  }
);

filmsRouter.post(
  "/",
  async (req: Request<{}, {}, Omit<IFilmAttributes, "id">>, res: Response) => {
    const film = await Film.create(req.body);

    return res.status(201).send(film);
  }
);

filmsRouter.put(
  "/",
  async (req: Request<{}, {}, IFilmAttributes>, res: Response) => {
    const film = await Film.update(req.body, { where: { id: req.body.id } });

    return res.status(200).send(film);
  }
);

filmsRouter.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    await Film.destroy({ where: { id: req.params.id } });
    return res.status(200).send(true);
  }
);

// import films
filmsRouter.get("/import-films", (_: Request, res: Response) => {
  res.render("import-films", {
    title: "Import films page",
    description: "In this page you can upload from `.text` file films",
  });
});

filmsRouter.post(
  "/import-films",
  upload.single("data"),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(404).send("Can't find file");

    if (req.file?.mimetype !== "text/plain")
      return res.status(400).send("Bad file format. Require txt");

    if (req.file) {
      const films = importFilmsDataToDatabase(req.file);

      try {
        await Film.bulkCreate(films);

        return res.status(201).send(films);
      } catch (error) {
        return res.status(500).send(error);
      }
    }

    // return res.render("import-films", {
    //   title: "Import films page",
    //   description: "In this page you can upload from `.text` file films",
    // });
  }
);

export default filmsRouter;
