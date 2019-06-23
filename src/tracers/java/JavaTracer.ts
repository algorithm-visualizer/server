import { LambdaTracer } from 'tracers/LambdaTracer';

export class JavaTracer extends LambdaTracer {
  constructor() {
    super('java');
  }
}
