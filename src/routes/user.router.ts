import { Router } from "express";

import UserController from "@controllers/user.controller";

import { validateUserCreationDataMiddleware } from "@middlewares/validation.middleware";

const usersRouter: Router = Router();

usersRouter.post(
  "/",
  validateUserCreationDataMiddleware,
  UserController.createUser
);

export default usersRouter;
