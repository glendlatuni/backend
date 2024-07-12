import express from "express";

import { familyControllers } from "../Controller/FamilyController";

const router = express.Router();

const FamilyControllers = new familyControllers();

router.post("/", FamilyControllers.createKeluarga);
router.get("/all", FamilyControllers.getKeluarga);
router.get("/:id", FamilyControllers.getKeluargaById);
router.put("/:id", FamilyControllers.updateKeluarga);
router.delete("/:id", FamilyControllers.deleteKeluarga);

export default router;
