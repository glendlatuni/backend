import { Request, Response, NextFunction } from "express";

import { membersService } from "../Services/MemberServices";

const MemberServices = new membersService();

export class MembersControllers {
  async controllerCreateMember(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { data } = req.body;
    try {
      const member = await MemberServices.createMember(data);
      res.send(member);
    } catch (error) {
      next(error);
    }
  }

  async controllerGetMember(_req: Request, res: Response, next: NextFunction) {
    try {
      const member = await MemberServices.getMember();
      res.send(member);
    } catch (error) {
      next(error);
    }
  }

  async controllerGetMemberByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("Accessing getJemaatById endpoint");
      const member = await MemberServices.getMemberById(String(req.params.id));
      res.send(member);
    } catch (error) {
      next(error);
    }
  }

  async controllerUpdateMember(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { data } = req.body;
    try {
      const member = await MemberServices.updateMember(
        String(req.params.id),
        data
      );
      res.send(member);
    } catch (error) {
      next(error);
    }
  }

  async controllerDeleteMember(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const members = await MemberServices.deleteMember(String(req.params.id));
      res.send(members);
      console.log(`${members?.FullName} has been deleted`);
    } catch (error) {
      next(error);
    }
  }
}
