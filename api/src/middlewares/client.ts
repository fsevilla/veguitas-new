import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "./../types/http-status";
import { isDev } from "./../utils";

export function validClientMiddleware(req: Request, res: Response, next: NextFunction) {
    const origin = req.get('origin');
    const clientOrigin = process.env.CLIENT_URL;

    if (origin === clientOrigin || isDev()) {
        next();
    } else {
        res.status(HttpStatus.SERVER_ERROR).send('Something went wrong');
    }
}