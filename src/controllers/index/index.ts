import { Request, Response } from 'express';
import responseJson from '../../utils/responseJson';
import { errCode } from '../../errorCode';
import { getCategoryInfoByUuid } from '../../models/test';
class IndexController {
  static async Index(req: Request, res: Response) {
    res.send('index-index');
  }
  static async Test(req: Request, res: Response) {
    const { categoryUuid } = req.query;
    const result = await getCategoryInfoByUuid(categoryUuid as string);
    responseJson(res, result.code, result.data, result.message);
  }
}

export default IndexController;
