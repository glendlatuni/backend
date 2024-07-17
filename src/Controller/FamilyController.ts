
import { Request, Response, NextFunction } from "express";

import { familyServices } from "../Services/FamilyServices";





const FamilyService = new familyServices();

export class familyControllers {

    async createKeluarga(req: Request, res: Response, next: NextFunction) {
        try {
            const family = await FamilyService.createKeluarga(req.body);

            res.status(201).json({message: `${family?.FamilyName} has been created`});
            console.log(`${family?.FamilyName} has been created`)
        } catch (error) {
            next(error);
        }
    }

    async getKeluarga(_req: Request, res: Response, next: NextFunction) {
        try {
            const Family = await FamilyService.getKeluarga();
            res.status(200).json(Family);
            console.log(Family);
            

        } catch (error) {
            next(error);
        }
    }

    async getKeluargaById (req: Request, res: Response, next: NextFunction) {
        try {
            const Family = await FamilyService.getKeluargaById(String(req.params.id));
            res.status(200).json(Family);
            console.log(`You are looking for ${Family?.FamilyName}`)
        } catch (error) {
            next(error);
        }
    }


    async updateKeluarga(req: Request, res: Response, next: NextFunction) {
        try {
            const Family = await FamilyService.updateKeluarga(String(req.params.id), req.body);
            res.status(200).json({ message: `${Family?.FamilyName} has been updated`});
            console.log(`${Family?.FamilyName} has been updated`)
        } catch (error) {
            next(error); 
        }
    }

    async deleteKeluarga(req: Request, res: Response, next: NextFunction) {
        try {
            const Family = await FamilyService.deleteKeluarga(String(req.params.id));
            res.status(200).json({ message: `${Family?.FamilyName} has been deleted`});
            console.log(`${Family?.FamilyName} has been deleted`)
        } catch (error) {
            next(error);
        }
    }
}