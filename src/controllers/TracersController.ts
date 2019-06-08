import express from 'express';
import { Controller } from 'controllers/Controller';
import Server from 'Server';

export class TracersController extends Controller {
  constructor(server: Server) {
    super(server);
    this.server.tracers.forEach(tracer => tracer.route(this.router));
  }

  route = (router: express.Router): void => {
    router.use('/tracers', this.router);
  };
}
