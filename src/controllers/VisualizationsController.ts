import express from 'express';
import path from 'path';
import uuid from 'uuid';
import fs from 'fs-extra';
import { Controller } from 'controllers/Controller';
import Server from 'Server';
import { visualizationsDir } from 'config/paths';

export class VisualizationsController extends Controller {
  constructor(server: Server) {
    super(server);
    this.router
      .post('/', this.uploadVisualization)
      .get('/:visualizationId', this.getVisualization);

    fs.remove(visualizationsDir).catch(console.error);
  }

  route = (router: express.Router): void => {
    router.use('/visualizations', this.router);
  };

  uploadVisualization = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {content} = req.body;
    const visualizationId = uuid.v4();
    const visualizationPath = path.resolve(visualizationsDir, `${visualizationId}.json`);
    const url = `https://algorithm-visualizer.org/scratch-paper/new?visualizationId=${visualizationId}`;
    fs.outputFile(visualizationPath, content)
      .then(() => res.send(url))
      .catch(next);
  };

  getVisualization = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {visualizationId} = req.params;
    const visualizationPath = path.resolve(visualizationsDir, `${visualizationId}.json`);
    res.sendFile(visualizationPath, err => {
      if (err) next(new Error('Visualization Expired'));
      fs.remove(visualizationPath);
    });
  };
}
