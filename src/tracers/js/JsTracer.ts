import path from 'path';
import { download } from 'utils/misc';
import { Release, Tracer } from 'tracers/Tracer';
import express from 'express';
import { publicDir } from 'config/paths';

export class JsTracer extends Tracer {
  readonly tracerPath: string;
  readonly workerPath: string;

  constructor() {
    super('js');
    this.tracerPath = path.resolve(publicDir, 'algorithm-visualizer.js');
    this.workerPath = path.resolve(__dirname, 'worker.js');
  }

  build(release: Release) {
    const {tag_name} = release;
    return download(`https://github.com/algorithm-visualizer/tracers.js/releases/download/${tag_name}/algorithm-visualizer.js`, this.tracerPath);
  }

  route(router: express.Router) {
    router.get(`/${this.lang}`, (req, res) => res.sendFile(this.tracerPath));
    router.get(`/${this.lang}/worker`, (req, res) => res.sendFile(this.workerPath));
  }
}
