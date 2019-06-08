import { DockerTracer } from 'tracers/DockerTracer';

export class JavaTracer extends DockerTracer {
  constructor() {
    super('java');
  }
}
