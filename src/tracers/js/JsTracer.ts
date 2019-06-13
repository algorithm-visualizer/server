import path from 'path';
import { Release, Tracer } from 'tracers/Tracer';
import express from 'express';

export class JsTracer extends Tracer {
  readonly workerPath: string;
  tagName?: string;

  constructor() {
    super('js');
    this.workerPath = path.resolve(__dirname, 'worker.js');
  }

  async build(release: Release) {
    const {tag_name} = release;
    this.tagName = tag_name;
  }

  route(router: express.Router) {
    router.get(`/${this.lang}`, (req, res) => {
      if (!this.tagName) throw new Error('JsTracer has not been built yet.');
      const version = this.tagName.slice(1);
      res.redirect(`https://unpkg.com/algorithm-visualizer@${version}/dist/algorithm-visualizer.umd.js`);
    });
    router.get(`/${this.lang}/worker`, (req, res) => res.sendFile(this.workerPath));
  }
}
