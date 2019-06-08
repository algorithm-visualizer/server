import express from 'express';
import { Controller } from 'controllers/Controller';
import { NotFound } from 'ts-httpexceptions';
import Server from 'Server';

export class AlgorithmsController extends Controller {
  constructor(server: Server) {
    super(server);
    this.router
      .get('/', this.getHierarchy)
      .get('/:categoryKey/:algorithmKey', this.getAlgorithm)
      .get('/sitemap.txt', this.getSitemap);
  }

  route = (router: express.Router): void => {
    router.use('/algorithms', this.router);
  };

  getHierarchy = (req: express.Request, res: express.Response) => {
    res.json(this.server.hierarchy);
  };

  getAlgorithm = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {categoryKey, algorithmKey} = req.params;
    const algorithm = this.server.hierarchy.find(categoryKey, algorithmKey);
    if (!algorithm) return next(new NotFound('Algorithm not found.'));
    res.json({algorithm});
  };

  getSitemap = (req: express.Request, res: express.Response) => {
    const urls: string[] = [];
    this.server.hierarchy.iterate((category, algorithm) => {
      urls.push(`https://algorithm-visualizer.org/${category.key}/${algorithm.key}`);
    });
    res.set('Content-Type', 'text/plain');
    res.send(urls.join('\n'));
  };
}
