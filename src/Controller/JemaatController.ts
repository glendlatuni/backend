import { Request, Response, NextFunction } from "express";

import { JemaatService } from "../Services/JemaatServices";

const jemaatServices = new JemaatService();

export class JemaatController{

    async createJemaat(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        try {
            const jemaat = await jemaatServices.createJemaat(data);
            res.send(jemaat);
        } catch (error) {
            next(error);
        }
    }


    async getJemaat(req: Request, res: Response, next: NextFunction){
        try {
            const jemaat = await jemaatServices.getJemaat();
            res.send(jemaat);
        } catch (error) {
            next(error);
        }
    }


    async getJemaatById(req: Request, res: Response, next: NextFunction){
        try {
            console.log('Accessing getJemaatById endpoint');
            const jemaat = await jemaatServices.getJemaatById(String(req.params.id));
            res.send(jemaat);
        } catch (error) {
            next(error);
        }
    }


    async updateJemaat(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        try {
            const jemaat = await jemaatServices.updateJemaat(String(req.params.id), data);
            res.send(jemaat);
        } catch (error) {
            next(error);
        }
    }


    async deleteJemaat(req: Request, res: Response, next: NextFunction){
        try {
            const jemaat = await jemaatServices.deleteJemaat(String(req.params.id));
            res.send(jemaat);
        } catch (error) {
            next(error);
        }
    }
    
    
 
}