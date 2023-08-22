import { readFileSync } from "fs";
import { join } from "path";

import { movieFormats } from "@constants/movie.constants";

import { IMovie } from "@interfaces/movie.interface";

import { TMovieFormat } from "@customTypes/movie.types";

interface IExtractDataFromTxtFile {
  totalCount: number;
  validMovies: IPreparedMovieData[];
}

interface IPreparedMovieData extends IMovie {
  actors: { name: string }[];
}

const validateMovie = (movie: IPreparedMovieData): boolean => {
  try {
    if (movie?.title && movie?.year && movie?.format && movie?.actors) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

export const extractDataFromTxtFile = (
  file: Express.Multer.File
): IExtractDataFromTxtFile => {
  try {
    const stringifyData = readFileSync(
      join(__dirname, "../../uploads/", file.filename)
    );

    if (!stringifyData.length)
      throw new Error(`Can't parse data from empty file`);

    let totalCount = 0;
    let movie: Partial<IPreparedMovieData> = {};
    const validMovies: IPreparedMovieData[] = [];

    stringifyData
      .toString()
      .split(/\r?\n/)
      .forEach((data) => {
        if (data === "") {
          if (
            Object.keys(movie).length === 4 &&
            validateMovie(movie as IPreparedMovieData)
          ) {
            totalCount++;
            validMovies.push(movie as IPreparedMovieData);
          }

          movie = {};
        } else {
          const [key, ...originalValue] = data.split(":");
          const value = originalValue.join(":").trim();

          if (key === "Title") movie.title = value;

          if (key === "Release Year") movie.year = +value;

          if (
            key === "Format" &&
            movieFormats.find((format) => format === value)
          )
            movie.format = value as TMovieFormat;

          if (key === "Stars") {
            movie.actors = value
              .split(",")
              .map((star) => ({ name: star.trim() }));
          }
        }
      });

    return {
      totalCount,
      validMovies,
    };
  } catch (error) {
    throw error;
  }
};
