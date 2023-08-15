import { readFileSync } from "fs";

import { IFilmCreationAttributes } from "@interfaces/film.interface";
import path from "path";

interface ICreateFilm extends IFilmCreationAttributes {
  [key: string]: string | number;
}

const validateFilm = (film: IFilmCreationAttributes): boolean => {
  try {
    if (film.title && film.release_year && film.stars && film.format) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const importFilmsDataToDatabase = (
  file: Express.Multer.File
): IFilmCreationAttributes[] => {
  const stringifyData = readFileSync(
    path.join(__dirname, "../../uploads/", file.filename)
  );

  if (!stringifyData.length)
    throw new Error(`Can't parse data from empty file`);

  let film: Partial<ICreateFilm> = {};
  const fullFilms: IFilmCreationAttributes[] = [];

  stringifyData
    .toString()
    .split(/\r?\n/)
    .forEach((data) => {
      if (data === "") {
        if (validateFilm(film as IFilmCreationAttributes)) {
          fullFilms.push(film as IFilmCreationAttributes);
        } else {
          console.log(`Not full data error:`, film);
        }

        film = {};
      }

      if (data !== "") {
        const [originalKey, ...originalValue] = data.split(":");
        const key: string = originalKey.toLowerCase();
        const value = originalValue.join(":").trim();

        if (key.split(" ").length === 2) {
          film[key.split(" ").join("_")] = +value;
        } else if (key === "stars") {
          film[key] = JSON.stringify(
            value.split(",").map((star) => star.trim())
          );
        } else {
          film[key] = value;
        }
      }
    });

  return fullFilms;
};
