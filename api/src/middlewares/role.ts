import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "./../types/http-status";
import { UserRoles } from "./../types/user";

export function rolesMiddleware (roles: UserRoles | UserRoles[] ) {

    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Unauthorized user' });
            return;
        }

        const { role } = req.user;
        const requiredRoles = roles.length ? roles : [roles];
        if (requiredRoles.includes(role as UserRoles)) {
            next();
        } else {
            res.status(HttpStatus.FORBIDDEN).send({ message: 'Unauthorized access' });
        }
    }

}