import { MembersControllers } from "../Controller/MembersController";
import express from "express";

const router = express.Router();

const memberControllers = new MembersControllers();

router.post("/", memberControllers.createMembers);
router.get("/all", memberControllers.getMembers);
router.get("/:id", memberControllers.getMembersById);
router.put("/:id", memberControllers.updateMembers);
router.delete("/:id", memberControllers.deleteMembers);

export default router;
