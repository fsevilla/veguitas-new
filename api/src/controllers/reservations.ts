import { ObjectId } from 'bson';
import { Request, Response } from "express";
import { MongooseQueryOptions } from "mongoose";

import { validationResult, matchedData } from 'express-validator';

import { HttpStatus } from "./../types/http-status";
import Reservation from "./../models/reservation";

export async function listAll(req: Request, res: Response) {
    try {
        const options: MongooseQueryOptions = {};

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

        if (req.query.date) {
            const [year, month, day] = (req.query.date as string).split('-');            
            const _offset = new Date().getTimezoneOffset();
            const offsetHours = _offset / 60 * -1;
            options.reservationDate = {
                $gte: new Date(+year, +month - 1, +day, offsetHours), 
                $lt: new Date(+year, +month - 1, +day + 1, offsetHours)
            }
        } else if (req.query.includePast !== 'true') {
            // Include only future ones by default
            const now = new Date();
            const offset = now.getTimezoneOffset();
            const fixedNow = new Date(now.getTime() - (offset*60*1000))
            const today = fixedNow.toISOString().split('T')[0]
            options.reservationDate = {
                $gte: `${today}T00:00:00.000+00:00`, 
                // $lt: new Date(+year, +month, +day + 1)
            }
        }

        if (req.query.fromDate) {
            options.reservationDate = {
                $gte: `${req.query.fromDate}T00:00:00.000+00:00` 
            }
        }

        if (req.query.toDate) {
            options.reservationDate = {
                $lt: `${req.query.toDate}T23:59:59.000+00:00` 
            }
        }

        const reservations = await Reservation.findAll(options);
        const cleanedReservations = Reservation.cleanRecords(reservations);
        res.send(cleanedReservations);
    } catch (e) {
        res.status(HttpStatus.SERVER_ERROR).send({ message: 'cannot retrieve reservations' })
    }
}

export async function findById(req: Request, res: Response) {
    try {
        const options: MongooseQueryOptions = {
            _id: req.params.id
        };

        const reservation = await Reservation.findOne(options);
        if (reservation) {
            const cleanedReservation = Reservation.cleanRecord(reservation);
            res.send(cleanedReservation);
        } else {
            res.status(HttpStatus.NOT_FOUND).send({ message: 'reservation not found' });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'invalid reservation id' });
    }
}

export async function createReservation(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {

        const reservationData = matchedData(req);

        if (reservationData.status && !Reservation.isStatusValid(reservationData.status)) {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid reservation status' })
            return;
        }

        if (reservationData.origin && !Reservation.isOriginValid(reservationData.origin)) {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid reservation origin' })
            return;
        }

        const reservationDate = reservationData.reservationDate;
        const reservationTime = reservationData.reservationTime;
        const reservationDateTime = `${reservationDate}T${reservationTime}:00.000Z`;

        if (reservationData.unique !== true) {
            const duplicate = await Reservation.findOne({
                $and: [
                    {
                      $or: [
                        { name: { $regex: new RegExp(`^${reservationData.name}$`, 'i') } },
                        { email: { $regex: new RegExp(`^${reservationData.email}$`, 'i') } },
                        { phone: reservationData.phone }
                      ]
                    },
                    { reservationDate: { $gte: `${reservationDate}T00:00:00.000Z` }},
                    { reservationDate: { $lt: `${reservationDate}T23:59:59.000Z` }},
                  ]
            })
    
            if (duplicate) {
                console.log('Found a similar reservation: ', duplicate);
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'A similar reservation already exists. Need confirmation' })
                return;
            }
        }
        

        // const now = new Date().getTime();
        Reservation.create({
            name: reservationData.name,
            email: reservationData.email,
            phone: reservationData.phone,
            profile: reservationData.profile,
            origin: reservationData.origin,
            reservationDate: reservationDateTime,
            people: reservationData.people,
            isBirthday: reservationData.isBirthday,
            notes: reservationData.notes,
            createdBy: req.user._id,
        }).then(response => {
            const cleanedReservation = Reservation.cleanRecord(response);
            res.send(cleanedReservation);
        }).catch(e => {
            if ((e.message as string).includes('duplicate key')) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Reservation already exists' })
            } else {
                console.log('Failed to create reservation: ', e);
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not create reservation' })
            }
        })
    } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing data' })
    }
}

export async function updateReservation(req: Request, res: Response) {

    try {
        const reservationId = new ObjectId(req.params.id);
        const result = validationResult(req);

        if (result.isEmpty()) {

            const reservationData = matchedData(req);

            if (reservationData.status && !Reservation.isStatusValid(reservationData.status)) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid reservation status' })
                return;
            }

            if (reservationData.origin && !Reservation.isOriginValid(reservationData.origin)) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid reservation origin' })
                return;
            }

            Reservation.findAndUpdate(reservationId, reservationData).then(response => {
                if (response) {
                    const cleanedReservation = Reservation.cleanRecord(response);
                    res.send(cleanedReservation);
                } else {
                    res.status(HttpStatus.NOT_FOUND).send({ message: 'Reservation not found' })
                }
            }).catch(e => {
                if ((e.message as string).includes('duplicate key')) {
                    res.status(HttpStatus.BAD_REQUEST).send({ message: 'Reservation already exists' })
                } else {
                    res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not update reservation' })
                }
            })
        } else {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid data' })
        }

    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid reservation id' })
    }
    
}

export async function deleteReservation(req: Request, res: Response) {

    try {
        const reservationId = new ObjectId(req.params.id);

        Reservation.findAndDelete(reservationId).then(response => {
            if (response) {
                res.send();
            } else {
                res.status(HttpStatus.NOT_FOUND).send({ message: 'Reservation not found' })
            }
        }).catch(e => {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not delete reservation' })
        })
    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid reservation id' })
    }

}
