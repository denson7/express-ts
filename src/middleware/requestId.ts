import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import httpRequestContext from 'http-request-context';

const RequestId = (req: Request, res: Response, next: NextFunction) => {
  const _uuid = uuid();
  httpRequestContext.set('RequestId', _uuid);
  next();
};

export default RequestId;
