import { Router } from "express";

import SessionController from "@controllers/session.controller";

import { validateSessionCreationDataMiddleware } from "@middlewares/validation.middleware";

const sessionRouter: Router = Router();

sessionRouter.post(
  "/",
  validateSessionCreationDataMiddleware,
  SessionController.createSession
);

export default sessionRouter;
