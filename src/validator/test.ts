import validator, { check, body, oneOf, query, validationResult, CustomValidator } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import responseJson from '../utils/responseJson';
import { checkIsMobileRequest } from '../utils/helper';
import {getCategoryInfoByUuid} from '../models/test'
import { errCode } from '../errorCode';

const requiredBody = (key: string) => body(key).not().isEmpty().withMessage(`${key} is required`);
const requiredQuery = (key: string) => query(key).not().isEmpty().withMessage(`${key} is required`);
const requiredParams = (key: string) => check(key).not().isEmpty().withMessage(`${key} is required`);

const checkUuid = requiredParams('uuid');

export default {
  checkDelParams: [checkUuid],
};


export const validateUserName = async (req: Request, res: Response, next: NextFunction) => {
  const { id, userName } = req.body;
  const { name } = await getCategoryInfoByUuid(id);
  if (name === 'demo') {
    const data: any = {};
    // check meal plan
    if (!userName) {
      data.userName = {
        msg: 'userName is required!',
        param: 'userName',
        location: 'body',
      };
    }
    if (Object.keys(data).length) {
      return responseJson(res, errCode.PARAMS_ERROR, data, '');
    }
  }
  next();
};

export const validateDeviceRequest = (req: Request, res: Response, next: NextFunction) => {
  const { uuid } = req.query;
  const isMobile = checkIsMobileRequest(req);
  if (!isMobile) {
    const data: any = {};
    if (!uuid) {
      data.uuid = {
        msg: 'uuid is required!',
        param: 'uuid',
        location: 'body',
      };
    }
    if (Object.keys(data).length) {
      return responseJson(res, errCode.PARAMS_ERROR, data, '');
    }
  }
  next();
};
