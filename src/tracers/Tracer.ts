import express from 'express';
import { GitHubApi } from 'utils/apis';

export type Release = {
  tag_name: string;
}

export abstract class Tracer {
  protected constructor(public lang: string) {
    this.update().catch(console.error);
  }

  abstract build(release: Release): Promise<any>;

  abstract route(router: express.Router): void;

  async update(release?: Release) {
    if (release) {
      return this.build(release);
    }
    const {data} = await GitHubApi.getLatestRelease('algorithm-visualizer', `tracers.${this.lang}`);
    return this.build(data);
  }
}
