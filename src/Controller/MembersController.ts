import { Request, Response, NextFunction } from "express";

import { membersService } from "../Services/MemberServices";

const MemberServices = new membersService();

export class MembersControllers {
  async createMembers(req: Request, res: Response, next: NextFunction) {
    const { data } = req.body;
    try {
      const member = await MemberServices.createMember(data);
      res.send(member);
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const member = await MemberServices.getMember();
      res.send(member);
    } catch (error) {
      next(error);
    }
  }

  async getMembersById(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Accessing getJemaatById endpoint");
      const member = await MemberServices.getMemberById(String(req.params.id));
      res.send(member);
    } catch (error) {
      next(error);
    }
  }

  async updateMembers(req: Request, res: Response, next: NextFunction) {
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

  async deleteMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const members = await MemberServices.deleteMember(String(req.params.id));
      res.send(members);
      console.log(`${members?.FullName} has been deleted`);
    } catch (error) {
      next(error);
    }
  }
}
