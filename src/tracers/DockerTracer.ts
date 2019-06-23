import path from 'path';
import { Release, Tracer } from 'tracers/Tracer';
import express from 'express';
import uuid from 'uuid';
import fs from 'fs-extra';
import { memoryLimit, timeLimit } from 'config/constants';
import { codesDir } from 'config/paths';
import { execute } from 'utils/misc';

export class DockerTracer extends Tracer {
  private readonly directory: string;
  private readonly imageName: string;

  constructor(lang: string) {
    super(lang);
    this.directory = path.resolve(__dirname, lang);
    this.imageName = `tracer-${this.lang}`;
  }

  build(release: Release) {
    const {tag_name} = release;
    return execute(`docker build -t ${this.imageName} . --build-arg tag_name=${tag_name}`, {
      cwd: this.directory,
      stdout: process.stdout,
      stderr: process.stderr,
    });
  }

  route(router: express.Router) {
    router.post(`/${this.lang}`, (req, res, next) => {
      const {code} = req.body;
      const tempPath = path.resolve(codesDir, uuid.v4());
      fs.outputFile(path.resolve(tempPath, `Main.${this.lang}`), code)
        .then(() => {
          const containerName = uuid.v4();
          let killed = false;
          const timer = setTimeout(() => {
            execute(`docker kill ${containerName}`).then(() => {
              killed = true;
            });
          }, timeLimit);
          return execute([
            'docker run --rm',
            `--name=${containerName}`,
            '-w=/usr/visualization',
            `-v=${tempPath}:/usr/visualization:rw`,
            `-m=${memoryLimit}m`,
            '-e ALGORITHM_VISUALIZER=1',
            this.imageName,
          ].join(' ')).catch(error => {
            if (killed) throw new Error('Time Limit Exceeded');
            throw error;
          }).finally(() => clearTimeout(timer));
        })
        .then(() => new Promise((resolve, reject) => {
          const visualizationPath = path.resolve(tempPath, 'visualization.json');
          res.sendFile(visualizationPath, (err: any) => {
            if (err) return reject(new Error('Visualization Not Found'));
            resolve();
          });
        }))
        .catch(next)
        .finally(() => fs.remove(tempPath));
    });
  }
}
