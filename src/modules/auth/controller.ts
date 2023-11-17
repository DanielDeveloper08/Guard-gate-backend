import { Request, Response } from 'express';

export class AuthController {
  constructor() {}

  greeting(req: Request, res: Response) {
    return res.json({
      message: 'Auth Controller',
    });
  }
}
