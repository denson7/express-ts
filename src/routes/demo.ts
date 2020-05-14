import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/ping', (req: Request, res: Response) => {
  return res.status(200).json('ok');
});

router.post('/test2', (req: Request, res: Response) => {
  console.log(req.body);
  res.json(req.body);
});

export default router;
