import { Request, Response, NextFunction } from "express";

import { familyServices } from "../Services/FamilyServices";

const FamilyService = new familyServices();

export class familyControllers {
  async ControllerCreateFamily(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const family = await FamilyService.createFamily(req.body);

      res
        .status(201)
        .json({ message: `${family?.FamilyName} has been created` });
      console.log(`${family?.FamilyName} has been created`);
    } catch (error) {
      next(error);
    }
  }

  async controllerGetFamily(_req: Request, res: Response, next: NextFunction) {
    try {
      const Family = await FamilyService.getFamily();
      res.status(200).json(Family);
      console.log(Family);
    } catch (error) {
      next(error);
    }
  }

  async controllerGetFamilyByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const Family = await FamilyService.getFamilyByID(String(req.params.id));
      res.status(200).json(Family);
      console.log(`You are looking for ${Family?.FamilyName}`);
    } catch (error) {
      next(error);
    }
  }

  async controllerUpdateFamily(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const Family = await FamilyService.updateFamily(
        String(req.params.id),
        req.body
      );
      res
        .status(200)
        .json({ message: `${Family?.FamilyName} has been updated` });
      console.log(`${Family?.FamilyName} has been updated`);
    } catch (error) {
      next(error);
    }
  }

  async controllerDeleteFamily(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const Family = await FamilyService.deleteFamily(String(req.params.id));
      res
        .status(200)
        .json({ message: `${Family?.FamilyName} has been deleted` });
      console.log(`${Family?.FamilyName} has been deleted`);
    } catch (error) {
      next(error);
    }
  }
}
