import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs-extra';
import url from 'url';
import Server from 'Server';
import { frontendBuiltDir } from 'config/paths';

const packageJson = require('../../package.json');

export function frontendMiddleware(server: Server) {
  const staticMiddleware = express.static(frontendBuiltDir, {index: false});

  if (!fs.pathExistsSync(frontendBuiltDir)) {
    server.updateFrontend().catch(console.error);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    staticMiddleware(req, res, err => {
      if (err) return next(err);
      if (req.method !== 'GET') return next();

      const filePath = path.resolve(frontendBuiltDir, 'index.html');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return next(err);

        const {pathname} = url.parse(req.originalUrl);
        if (!pathname) return next(new Error('Failed to get `pathname`.'));
        const [, categoryKey, algorithmKey] = pathname.split('/');
        let {title, description} = packageJson;
        let algorithm = undefined;
        if (categoryKey && categoryKey !== 'scratch-paper') {
          algorithm = server.hierarchy.find(categoryKey, algorithmKey) || null;
          if (algorithm) {
            title = [algorithm.categoryName, algorithm.algorithmName].join(' - ');
            description = algorithm.description;
          } else {
            res.status(404);
            return;
          }
        }

        const indexFile = data
          .replace(/\$TITLE/g, title)
          .replace(/\$DESCRIPTION/g, description)
          .replace(/\$ALGORITHM/g, algorithm === undefined ? 'undefined' :
            JSON.stringify(algorithm).replace(/</g, '\\u003c'));
        res.send(indexFile);
      });
    });
  };
}
