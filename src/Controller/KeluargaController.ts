
import { Request, Response, NextFunction } from "express";

import { KeluargaService } from "../Services/KeluargaServices";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const keluargaService = new KeluargaService();

export class KeluargaController {

    async createKeluarga(req: Request, res: Response, next: NextFunction) {
        try {
            const keluarga = await keluargaService.createKeluarga(req.body);

            res.status(201).json({message: `${keluarga?.nama_keluarga} has been created`});
            console.log(`${keluarga?.nama_keluarga} has been created`)
        } catch (error) {
            next(error);
        }
    }

    async getKeluarga(req: Request, res: Response, next: NextFunction) {
        try {
            const keluarga = await keluargaService.getKeluarga();
            res.status(200).json(keluarga);
            console.log(`You have ${keluarga.length} keluarga`)
        } catch (error) {
            next(error);
        }
    }

    async getKeluargaById (req: Request, res: Response, next: NextFunction) {
        try {
            const keluarga = await keluargaService.getKeluargaById(String(req.params.id));
            res.status(200).json(keluarga);
            console.log(`You are looking for ${keluarga?.nama_keluarga}`)
        } catch (error) {
            next(error);
        }
    }


    async updateKeluarga(req: Request, res: Response, next: NextFunction) {
        try {
            const keluarga = await keluargaService.updateKeluarga(String(req.params.id), req.body);
            res.status(200).json({ message: `${keluarga?.nama_keluarga} has been updated`});
            console.log(`${keluarga?.nama_keluarga} has been updated`)
        } catch (error) {
            
        }
    }

    async deleteKeluarga(req: Request, res: Response, next: NextFunction) {
        try {
            const keluarga = await keluargaService.deleteKeluarga(String(req.params.id));
            res.status(200).json({ message: `${keluarga?.nama_keluarga} has been deleted`});
            console.log(`${keluarga?.nama_keluarga} has been deleted`)
        } catch (error) {
            next(error);
        }
    }
}