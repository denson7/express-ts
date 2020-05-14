import { Request, Response } from 'express';

class IndexController {
  static async Index(req: Request, res: Response) {
    res.send('index-index');
  }
  static async Test(req: Request, res: Response) {
    res.send('index-test');
  }
}

export default IndexController;
