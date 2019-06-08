import { NextFunction, Request, Response } from 'express';
import { credentials } from 'config/environments';

export function redirectMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.hostname === 'algo-visualizer.jasonpark.me') {
      res.redirect(301, 'https://algorithm-visualizer.org/');
    } else if (credentials && !req.secure) {
      res.redirect(301, `https://${req.hostname}${req.url}`);
    } else {
      next();
    }
  };
}
