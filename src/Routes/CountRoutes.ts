import  express  from "express";

import { countController } from "../Controller/CountController";

const router = express.Router();

const CountController = new countController();

router.get ('/jemaat', CountController.getJemaatCount);
router.get ('/keluarga', CountController.getKeluargaCount);

export default router