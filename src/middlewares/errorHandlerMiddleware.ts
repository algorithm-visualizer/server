import { NextFunction, Request, Response } from 'express';
import { Exception, InternalServerError } from 'ts-httpexceptions';

export function errorHandlerMiddleware() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof Exception)) {
      console.error(err);
      err = new InternalServerError(err.message, err);
    }

    const {message, status} = err;
    res.status(status).send(message);
  };
}
