import { Request, Response, NextFunction } from 'express';

const AuthControl = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('authorization');
  if (token == '123') {
    next();
  } else {
    res.status(403).json('İzin verilmedi');
  }
};

export default AuthControl;
