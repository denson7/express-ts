import express from 'express';
import TestController from '../controllers/test';
import AuthControl from '../middleware/auth';

const router = express.Router();
router.get('/', TestController.Index);
router.get('/test', TestController.Test);
router.post('/post', AuthControl, TestController.Post);
router.post('/postImg', TestController.PostFile);

export default router;
