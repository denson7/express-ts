import express from 'express';
import TestController from '../controllers/test';
import AuthControl from '../middleware/auth';
import CheckParams from '../middleware/checkParams';
import Validator, { validateUserName, validateDeviceRequest } from '../validator/test';

const router = express.Router();
router.get('/', TestController.Index);
router.get('/test', TestController.Test);
router.post('/post', AuthControl, TestController.Post);
router.post('/postImg', TestController.PostFile);
router.post('/del', Validator.checkDelParams, CheckParams, validateUserName, validateDeviceRequest, TestController.Test);


export default router;
