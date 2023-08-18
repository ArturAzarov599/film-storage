import { body, param, query } from "express-validator";

import { validationHandler } from "@utils/validationHandler";

import { movieFormats } from "@constants/movie.constants";

// user router
export const validateUserCreationDataMiddleware = [
  body("email").isEmail().exists({ checkFalsy: true }),
  body("name").isString().isLength({ min: 5 }).exists({ checkFalsy: true }),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword")
    .isString()
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password does not match");
      }
      return true;
    })
    .withMessage("Passwords must match"),
  validationHandler,
];

// session router
export const validateSessionCreationDataMiddleware = [
  body("email").isEmail(),
  body("password").isString().isLength({ min: 8 }),
  validationHandler,
];

// movie router
const validationIdParam = param("id").isInt({ min: 1 }).toInt();
const createMovieDataValidation = [
  body("title").exists().isLength({ min: 2 }).isString(),
  body("year").exists().isInt(),
  body("format")
    .isString()
    .custom((format) => movieFormats.find((mF) => mF === format))
    .withMessage(
      `Wrong movie format. Available values is: "VHS", "DVD", "Blu-Ray"`
    ),
  body("actors")
    .isArray()
    .exists()
    .custom((actors) => actors.every((actor: any) => typeof actor === "string"))
    .withMessage("Wrong actor/actors data type. Expected strings"),
];

export const validateIdParamMiddleware = [validationIdParam, validationHandler];

export const validateCreateMovieDataMiddleware = [
  ...createMovieDataValidation,
  validationHandler,
];

export const validateUpdateMovieDataMiddleware = [
  validationIdParam,
  ...validateCreateMovieDataMiddleware,
];

export const validateGetMoviesQueryParamsMiddleware = [
  query("actor").isString().optional().isLength({ min: 2 }),
  query("title").isString().optional().isLength({ min: 2 }),
  query("search")
    .isString()
    .optional()
    .custom((value) => value.split(":").length === 2)
    .withMessage(
      `Wrong form for search parameter, expected form - title:actor`
    ),
  query("sort")
    .optional()
    .custom((sort: string) =>
      ["year", "id", "title"].find((value) => value === sort)
    )
    .withMessage(`Unexpected sort field. Expected: "year", "id", "title"`),
  query("order")
    .optional()
    .custom((order: string) => ["ASC", "DESC"].find((value) => value === order))
    .withMessage(`Unexpected order value. Expected: "ASC", "DESC"`),
  query("limit").optional().isInt({ min: 1 }),
  query("offset").optional().isInt(),
  validationHandler,
];
