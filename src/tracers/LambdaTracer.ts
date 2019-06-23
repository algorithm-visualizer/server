import AWS from 'aws-sdk';
import express from 'express';
import { Release, Tracer } from 'tracers/Tracer';
import { awsAccessKeyId, awsSecretAccessKey } from 'config/environments';
import { BadRequest } from 'ts-httpexceptions';

export class LambdaTracer extends Tracer {
  static lambda = new AWS.Lambda({
    region: 'us-east-2',
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  });

  async build(release: Release) {
  }

  route(router: express.Router) {
    router.post(`/${this.lang}`, (req, res, next) => {
      const {code} = req.body;
      LambdaTracer.lambda.invoke({
        FunctionName: `extractor-${this.lang}`,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(code),
      }, function (err, data) {
        if (err) return next(err);
        if (typeof data.Payload !== 'string') return next(new Error('Unexpected Payload Type'));
        const payload = JSON.parse(data.Payload);
        if (!payload.success) return next(new BadRequest(payload.errorMessage));
        res.send(payload.commands);
      });
    });
  }
}
