import { scheduleController } from './../Controller/ScheduleController';
import express from "express";

const router = express.Router();

const ScheduleController = new scheduleController();


router.post("/", ScheduleController.createSchedule);

router.get("/all", ScheduleController.getSchedule);

router.get("/:id", ScheduleController.getScheduleByMemberId);

router.delete("/:id", ScheduleController.deleteSchedule);

router.put("/:id", ScheduleController.updateSchedule);


export default router