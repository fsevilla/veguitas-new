import { Request, Response } from "express";
import { validationResult, matchedData } from 'express-validator';
import { Mailer } from "../models/mailer";

import User from "../models/user";
import Token from "../models/token";
import ActivationToken from "../models/activation-token";
import { HttpStatus } from "../types/http-status";
import { ErrorParser } from "../models/db";
import { UserStatus, UserType } from "../types/user";
import { hashPassword } from "../utils";

export function signup(req: Request, res: Response) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const userData = matchedData(req);
        const hashedPassword = hashPassword(userData.password);
        // Save user
        User.signup({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        }).then(async (response) => {
            try {
                // Generate activation code
                const activationToken = await ActivationToken.create(response._id);
                Mailer.sendUserConfirmationEmail(response, activationToken.token);
                res.send();
            } catch (error) {
                // Token could have not been created but User did
                // In this scenario, still respond with 200
                // And the user can request the token again if not received
                console.log('ERROR: Could not send signup email: ', error);
                res.send();
            }
        }).catch(err => {
            if (ErrorParser.isDuplicate(err)) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'User already exists'});
            } else {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'An error occurred'});
            }
        })
    } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid user' });
    }
}

export function login(req: Request, res: Response) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const { email, password } = matchedData(req);
        // Search for active user
        const hashedPassword = hashPassword(password);
        User.findByCredentials(
            email,
            hashedPassword
        ).then(async response => {
            if (response) {
                if (response.status === UserStatus.ACTIVE) {
                    // Create Token for active user
                    try {
                        const { token } = await Token.create(response._id);
                        res.send({ token });
                    } catch (error) {
                        res.status(HttpStatus.SERVER_ERROR).send({ message: 'Failed to create token' });
                    }
                } else {
                    res.status(HttpStatus.UNAUTHORIZED).send({ message: 'User is not active' })
                }
                
            } else {
                res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Invalid credentials' });
            }
        }).catch(err => {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'An error occurred' });
        })
        
    } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing parameters' });
    }
}

export function confirmUser(req: Request, res: Response) {
    const code: string = req.query.code ? req.query.code.toString() : '';
    if (!code) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing activation code' });
        return;
    }
    ActivationToken.findAndUse(code).then((response) => {
        if (response) {
            // res.send(response);
            // Update user to Active
            User.findAndActivate(response.userId!).then((user) => {
                if (user) {
                    Mailer.sendUserActivatedEmail(user);
                    res.send();
                } else {
                    res.status(HttpStatus.BAD_REQUEST).send({ message: 'Failed to activate user' })
                }
            }).catch(err => {
                res.status(HttpStatus.SERVER_ERROR).send({ message: 'Unknown error. Please try again' });
            });
        } else {
            res.status(HttpStatus.NOT_FOUND).send({ message: 'Code does not exist or has already been used '});
        }
    }).catch(err => {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid activation code' });
    });
}

export function getLoggedInUser(req: Request, res: Response) {
    if (req.user) {
        res.send(req.user);
    } else {
        // Should not get here if token is invalid
        res.status(HttpStatus.UNAUTHORIZED).send({ message: 'User not authorized' });
    }
}

