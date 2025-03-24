import { ObjectId } from 'bson';
import { Request, Response } from "express";
import { MongooseQueryOptions } from "mongoose";

import { validationResult, matchedData } from 'express-validator';

import { HttpStatus } from "./../types/http-status";
import { UserStatus, UserRoles } from "./../types/user";
import { hashPassword } from "../utils";
import User from "./../models/user";

export async function listAll(req: Request, res: Response) {
    try {
        const options: MongooseQueryOptions = {};
        if (req.query.role) {
            options.role = req.query.role;
        }

        if (req.query.roles) {
            const roles = (req.query.roles as string).split(',');
            options.role = { $in: roles };
        }

        if (req.query.status && req.query.status !== 'all') {
            const status = (req.query.status as string).split(',');
            options.status = { $in: status };
        }

        if (req.query.email) {
            options.email = { "$regex": req.query.email, "$options": "i"  }
        }

        if (req.query.name) {
            options.name = { "$regex": req.query.name, "$options": "i"  }
        }

        const users = await User.findAllUsers(options);
        const cleanedUsers = User.cleanRecords(users);
        res.send(cleanedUsers);
    } catch (e) {
        res.status(HttpStatus.SERVER_ERROR).send({ message: 'cannot retrieve users' })
    }
}

export async function findById(req: Request, res: Response) {
    try {
        const options: MongooseQueryOptions = {
            _id: req.params.id
        };

        if (req.user.role !== UserRoles.ADMIN) {
            options.status = UserStatus.ACTIVE;
        }

        const user = await User.findOne(options);
        if (user) {
            const cleanedUser = User.cleanRecord(user);
            res.send(cleanedUser);
        } else {
            res.status(HttpStatus.NOT_FOUND).send({ message: 'user not found' });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'invalid user id' });
    }
}

export async function createUser(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {

        const userData = matchedData(req);
        const hashedPassword = hashPassword(userData.password);

        if (!User.isRoleValid(userData.role)) {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid user role' })
            return;
        }

        User.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role
        }).then(response => {
            const cleanedUser = User.cleanRecord(response);
            res.send(cleanedUser);
        }).catch(e => {
            if ((e.message as string).includes('duplicate key')) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'User already exists' })
            } else {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not create user' })
            }
        })
    } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing data' })
    }
}

export async function updateUser(req: Request, res: Response) {

    try {
        const userId = new ObjectId(req.params.id);
        const result = validationResult(req);

        if (result.isEmpty()) {

            const userData = matchedData(req);

            const updateInfo: { name?: string, email?: string, role?: string, status?: string } = {}

            if (userData.name) {
                updateInfo.name = userData.name;
            }

            if (userData.email) {
                updateInfo.email = userData.email;
            }

            if (userData.role && !User.isRoleValid(userData.role)) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid user role' })
                return;
            } else if (userData.role) {
                updateInfo.role = userData.role;
            }

            if (userData.status && !User.isStatusValid(userData.status)) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid user status' })
                return;
            } else if (userData.status) {
                updateInfo.status = userData.status;
            }

            User.findAndUpdate(userId, updateInfo).then(response => {
                if (response) {
                    const cleanedUser = User.cleanRecord(response);
                    res.send(cleanedUser);
                } else {
                    res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found' })
                }
            }).catch(e => {
                if ((e.message as string).includes('duplicate key')) {
                    res.status(HttpStatus.BAD_REQUEST).send({ message: 'Email already exists' })
                } else {
                    res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not update user' })
                }
            })
        } else {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid data' })
        }

    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid user id' })
    }
    
}

export async function deleteUser(req: Request, res: Response) {

    try {
        const userId = new ObjectId(req.params.id);

        User.findAndDelete(userId).then(response => {
            if (response) {
                res.send();
            } else {
                res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found' })
            }
        }).catch(e => {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not delete user' })
        })
    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid user id' })
    }

}