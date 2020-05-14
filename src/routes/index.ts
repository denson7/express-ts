import { Application } from 'express';
import { upload } from '../utils/helper';
import test from './test';
import demo from './demo';

const routeLoader = (app: Application): void => {
  app.use('/test', upload.single('logo'), test);
  app.use(demo);
};

export default routeLoader;
