import  express  from "express";

import { JemaatController } from "../Controller/JemaatController";


const router = express.Router();

const jemaatController = new JemaatController();


router.post('/', jemaatController.createJemaat);
router.get ('/', jemaatController.getJemaat);
router.get ('/:id', jemaatController.getJemaatById);
router.put ('/:id', jemaatController.updateJemaat);
router.delete ('/:id', jemaatController.deleteJemaat);


export default router