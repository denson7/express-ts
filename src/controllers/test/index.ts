import { Request, Response } from 'express';
import logger from '../../utils/logger';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

class TestController {
  static async Index(req: Request, res: Response) {
    res.send('tetst-index');
  }
  static async Test(req: Request, res: Response) {
    res.send('test-test');
  }

  static async Post(req: Request, res: Response) {
    const { body } = req;
    console.log(moment.utc().format('YYYY-MM-DD'));
    console.log(uuid());
    res.send(body);
  }

  static async PostFile(req: Request, res: Response) {
    const { body } = req;
    logger.info('XXXXXXXXXX', body, req.file);
    res.send(body);
  }
}

export default TestController;
