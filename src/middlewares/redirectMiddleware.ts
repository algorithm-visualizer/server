import { NextFunction, Request, Response } from 'express';

export function redirectMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.hostname === 'algo-visualizer.jasonpark.me') {
      res.redirect(301, 'https://algorithm-visualizer.org/');
    } else {
      next();
    }
  };
}
