import { TFilmFormat } from "@customTypes/film-format.type";

export interface IFilmAttributes {
  id: number;
  title: string;
  release_year: number;
  format: TFilmFormat;
  stars: string;
}

export interface IFilmCreationAttributes
  extends Omit<IFilmAttributes, "id" | "createdAt" | "updatedAt"> {}
