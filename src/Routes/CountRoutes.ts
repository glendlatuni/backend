import express from "express";

import { countController } from "../Controller/CountController";

const router = express.Router();

const CountController = new countController();

router.get("/member", CountController.controllerGetMemberCount);
router.get("/family", CountController.controllerGetFamilyCount);

export default router;
