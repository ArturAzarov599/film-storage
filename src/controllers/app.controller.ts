import { Request, Response } from "express";

class AppController {
  static get404Page(_: Request, res: Response): void {
    res.render("404");
  }
}

export default AppController;
