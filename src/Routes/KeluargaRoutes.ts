import express from 'express';

import { KeluargaController } from "../Controller/KeluargaController";

const router = express.Router();

const keluargaController = new KeluargaController();


router.post('/', keluargaController.createKeluarga);
router.get ('/', keluargaController.getKeluarga);
router.get ('/:id', keluargaController.getKeluargaById);
router.put ('/:id', keluargaController.updateKeluarga);
router.delete ('/:id', keluargaController.deleteKeluarga);


export default router