import { DockerTracer } from 'tracers/DockerTracer';

export class CppTracer extends DockerTracer {
  constructor() {
    super('cpp');
  }
}
