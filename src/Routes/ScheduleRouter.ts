import { scheduleController } from "./../Controller/ScheduleController";
import express from "express";

const router = express.Router();

const ScheduleController = new scheduleController();

router.post("/", ScheduleController.controllerCreateSchedule);

router.get("/all", ScheduleController.controllerGetSchedule);

router.get("/:id", ScheduleController.controllerGetScheduleByMemberID);

router.delete("/:id", ScheduleController.controllerDeleteSchedule);

router.put("/:id", ScheduleController.controllerUpdateSchedule);

export default router;
