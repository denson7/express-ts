import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import responseJson from '../utils/responseJson';
import { errCode } from '../errorCode';
import { trimObj } from '../utils/helper';

const checkParams = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responseJson(res, errCode.PARAMS_ERROR, errors.mapped(), '');
  }
  // remove space
  req.body = trimObj(req.body);
  next();
};

export default checkParams;
