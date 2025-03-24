import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "./../types/http-status";
import Token from "./../models/token";
import { RequestUser } from "./../types/user";

export function authMiddleware (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Not authenticated '});
        return;
    }

    Token.findTokenWithUser(token).then(response => {
        if (response) {
            const { name, email, _id, role }: RequestUser = response.userId as any;
            req.user = {
                name,
                email,
                role,
                _id
            }
            
            next();
        } else {
            res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Not authenticated '});    
        }
    }).catch(err => {
        res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Not authenticated '});
    })
}