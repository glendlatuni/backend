import  express  from "express";

import { countController } from "../Controller/CountController";

const router = express.Router();

const CountController = new countController();

router.get ('/member', CountController.getJemaatCount);
router.get ('/family', CountController.getKeluargaCount);

export default router