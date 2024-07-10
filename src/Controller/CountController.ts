import { Request, Response, NextFunction } from "express";

import { countService } from "../Services/CountServices";

const CountService = new countService();

export class countController {
  async getJemaatCount(req: Request, res: Response, next: NextFunction) {
    try {
      const jemaatCount = await CountService.getJemaatCount();
      res.send({ jemaatCount });
    } catch (error) {
      next(error);
    }
  }

  async getKeluargaCount(req: Request, res: Response, next: NextFunction) {
    try {
      const keluargaCount = await CountService.getKeluargaCount();
      res.send({ keluargaCount });
    } catch (error) {
      next(error);
    }
  }

  
}
