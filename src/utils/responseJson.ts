import httpRequestContext from 'http-request-context';
import { Response } from 'express';
import { errMsg } from '../errorCode';

/**
 * @param res
 * @param code
 * @param result
 * @param msg
 */
const responseJson = (res: Response, code = 200, data: any, msg = '') => {
  let message = msg;
  if (!msg) {
    message = errMsg[code];
  }
  const success = code === 200;
  const requestId = httpRequestContext.get('RequestId') || '';
  res.send({
    success,
    code,
    message,
    data,
    requestId,
  });
};

export default responseJson;
