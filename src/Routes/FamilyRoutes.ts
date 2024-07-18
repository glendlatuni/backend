import express from "express";

import { familyControllers } from "../Controller/FamilyController";

const router = express.Router();

const FamilyControllers = new familyControllers();

router.post("/", FamilyControllers.ControllerCreateFamily);
router.get("/all", FamilyControllers.controllerGetFamily);
router.get("/:id", FamilyControllers.controllerGetFamilyByID);
router.put("/:id", FamilyControllers.controllerUpdateFamily);
router.delete("/:id", FamilyControllers.controllerDeleteFamily);

export default router;
