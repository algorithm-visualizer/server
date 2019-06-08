import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import * as Controllers from 'controllers';
import { NotFound } from 'ts-httpexceptions';
import compression from 'compression';
import { __PROD__, credentials, httpPort, httpsPort, webhookOptions } from 'config/environments';
import http from 'http';
import https from 'https';
import { Hierarchy } from 'models';
import * as Tracers from 'tracers';
import { errorHandlerMiddleware, frontendMiddleware, redirectMiddleware } from 'middlewares';
import { execute, pull } from 'utils/misc';
import { frontendBuildDir, frontendBuiltDir, frontendDir, rootDir } from 'config/paths';

const Webhook = require('express-github-webhook');

export default class Server {
  private readonly app = express();
  readonly hierarchy = new Hierarchy();
  readonly tracers = Object.values(Tracers).map(Tracer => new Tracer());
  private readonly webhook = webhookOptions && Webhook(webhookOptions);

  constructor() {
    this.app
      .use(compression())
      .use(morgan(__PROD__ ? 'tiny' : 'dev'))
      .use(redirectMiddleware())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({extended: true}))
      .use('/api', this.getApiRouter())
      .use(frontendMiddleware(this));
    if (this.webhook) {
      this.app.use(this.webhook);
    }
    this.app.use(errorHandlerMiddleware());

    if (this.webhook) {
      this.webhook.on('push', async (repo: string, data: any) => {
        const {ref, head_commit} = data;
        if (ref !== 'refs/heads/master') return;
        if (!head_commit) throw new Error('The `head_commit` is empty.');

        switch (repo) {
          case 'server':
            await this.update(head_commit.id);
            break;
          case 'algorithm-visualizer':
            await this.updateFrontend(head_commit.id);
            break;
          case 'algorithms':
            await this.hierarchy.update(head_commit.id);
            break;
          default:
            throw new Error(`Webhook from unknown repository '${repo}'.`);
        }
      });

      this.webhook.on('release', async (repo: string, data: any) => {
        const tracer = this.tracers.find(tracer => repo === `tracers.${tracer.lang}`);
        if (!tracer) throw new Error(`Tracer not found for repository '${repo}'.`);
        await tracer.update(data.release);
      });
    }
  }

  getApiRouter() {
    const router = express.Router();
    Object.values(Controllers).forEach(Controller => new Controller(this).route(router));
    router.use((req: Request, res: Response, next: NextFunction) => {
      next(new NotFound('API not found.'));
    });
    return router;
  };

  async update(commit?: string) {
    await pull(rootDir, 'server', commit);
    await execute('npm install', {
      cwd: rootDir,
      stdout: process.stdout,
      stderr: process.stderr,
    });
    process.exit(0);
  };

  async updateFrontend(commit?: string) {
    await pull(frontendDir, 'algorithm-visualizer', commit);
    await execute([
      'npm install',
      'npm run build',
      `rm -rf ${frontendBuiltDir}`,
      `mv ${frontendBuildDir} ${frontendBuiltDir}`,
    ].join(' && '), {
      cwd: frontendDir,
      stdout: process.stdout,
      stderr: process.stderr,
    });
  }

  start() {
    const httpServer = http.createServer(this.app);
    httpServer.listen(httpPort);
    console.info(`http: listening on port ${httpPort}`);

    if (credentials) {
      const httpsServer = https.createServer(credentials, this.app);
      httpsServer.listen(httpsPort);
      console.info(`https: listening on port ${httpsPort}`);
    }
  }
}
