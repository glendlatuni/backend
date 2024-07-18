import { Request, Response, NextFunction } from "express";

import { countService } from "../Services/CountServices";

const CountService = new countService();

export class countController {
  async controllerGetMemberCount(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const jemaatCount = await CountService.getMemberCount();
      res.send({ jemaatCount });
    } catch (error) {
      next(error);
    }
  }

  async controllerGetFamilyCount(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const keluargaCount = await CountService.getFamilyCount();
      res.send({ keluargaCount });
    } catch (error) {
      next(error);
    }
  }
}
