import { body, check, param, query } from "express-validator";

import { validationHandler } from "@utils/validationHandler";

import { movieFormats } from "@constants/movie.constants";

const year = new Date().getFullYear();

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
  body("title")
    .isLength({ min: 2 })
    .isString()
    .custom((title) => {
      if (!title.trim()) return false;

      return true;
    })
    .withMessage(`Title must contain numbers and characters!`),
  body(
    "year",
    `Year must be greater than 1900 and smaller than ${year + 1}`
  ).isInt({ min: 1900, max: year }),
  body(
    "format",
    `Wrong movie format. Available values is: "VHS", "DVD", "Blu-Ray"`
  ).isIn(movieFormats),
  body("actors")
    .isArray()
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
    .isIn(["year", "id", "title"])
    .withMessage(`Unexpected sort field. Expected: "year", "id", "title"`),
  query("order")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage(`Unexpected order value. Expected: "ASC", "DESC"`),
  query("limit").optional().isInt({ min: 1 }),
  query("offset").optional().isInt(),
  validationHandler,
];
