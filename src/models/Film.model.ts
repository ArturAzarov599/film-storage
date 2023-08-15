import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

import {
  IFilmAttributes,
  IFilmCreationAttributes,
} from "@interfaces/film.interface";
import { TFilmFormat } from "@customTypes/film-format.type";

@Table({
  tableName: "films",
})
class Film extends Model<IFilmAttributes, IFilmCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  title: string;

  @Column
  release_year: number;

  @Column
  format: TFilmFormat;

  @Column
  stars: string;
}

export default Film;
