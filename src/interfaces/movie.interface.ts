import { IActorModel } from "@interfaces/actor.interface";
import { IDefaultModel } from "@interfaces/default-model.interface";

import { TMovieFormat } from "@customTypes/movie.types";

export interface IMovie {
  title: string;
  year: number;
  format: TMovieFormat;
}

export interface ICreateMovie extends IMovie {
  actors: string[];
}

export interface IMovieModel extends IMovie, IDefaultModel {}

export interface IMovieFullData extends IMovieModel {
  actors: IActorModel[];
}

export interface IGetMoviesQuery {
  actor?: string;
  title?: string;
  search?: string;
  sort?: "year" | "id" | "title";
  order?: "ASC" | "DESC";
  limit?: number;
  offset?: number;
}
