import express from "express";
import Server from 'Server';

export abstract class Controller {
  protected readonly router: express.Router;

  protected constructor(protected server: Server) {
    this.router = express.Router();
  }

  abstract route(router: express.Router): void;
}
