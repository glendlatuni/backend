import { Request, Response, NextFunction } from "express";

import { scheduleServices } from "../Services/ScheduleServices";

const ScheduleService = new scheduleServices();

export class scheduleController {
  async createSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.createSchedule(req.body);

      res
        .status(201)
        .json({ message: `${schedule?.Members_id} has been created` });
    } catch {
      next(Error);
    }
  }

  async getSchedule(_req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.getSchedule();
      res.status(200).json(schedule);
    } catch (error) {
      next(error);
    }
  }

  async getScheduleByMemberId(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.getScheduleByMemberId(
        req.params.id
      );
      res.status(200).json(schedule);
    } catch (error) {
      next(error);
    }
  }

  async deleteSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.deleteSchedule(req.params.id);
      res.status(200).json(schedule);
    } catch (error) {
      next(error);
    }
  }

  async updateSchedule(req: Request, res: Response, next: NextFunction) {

    
    try {
      const schedule = await ScheduleService.updateSchedule(
        req.params.id,
        req.body
      );
      res.status(200).json(schedule);
    } catch (error) {
      next(error);
    }
  }


}
