import { MembersControllers } from "../Controller/MembersController";
import express from "express";

const router = express.Router();

const memberControllers = new MembersControllers();

router.post("/", memberControllers.controllerCreateMember);
router.get("/all", memberControllers.controllerGetMember);
router.get("/:id", memberControllers.controllerGetMemberByID);
router.put("/:id", memberControllers.controllerUpdateMember);
router.delete("/:id", memberControllers.controllerDeleteMember);

export default router;
