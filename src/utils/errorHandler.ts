import { timeStamp } from "console";
import { Request, Response, NextFunction } from "express";

interface ErrorWithStatus extends Error {
    status?: number;
}

export const errorHandler = (
    error: ErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    res.status(status).json({ status, message });

    const errorResponse ={
        error:{
            message: error.message || "Terjadi Kesalahan",
            status : status,
            timeStamp: new Date().toString(),
        },
    }

res.status(status).json(errorResponse);
}

