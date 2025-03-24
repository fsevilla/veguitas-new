import { ObjectId } from 'bson';
import { Request, Response } from "express";

import { validationResult, matchedData } from 'express-validator';

import { HttpStatus } from "./../types/http-status";
import model from "./../models/booking";
import Reservation from "./../models/reservation";
import { BookingStatus } from './../types/booking';
import { ReservationOrigin, ReservationStatus, ReservationType } from './../types/reservation';
import { MongooseQueryOptions } from 'mongoose';
import reservation from './../models/reservation';

// For public access through the website
export async function createBooking(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {

        const bookingData = matchedData(req);

        const reservationDate = bookingData.reservationDate;
        const reservationTime = bookingData.reservationTime;
        const reservationDateTime = `${reservationDate}T${reservationTime}:00.000Z`;

        const requestedDate = new Date(reservationDateTime);
        const requestedDayOfWeek = requestedDate.getDay();

        if (!model.isValidDay(requestedDayOfWeek) || !model.isValidHour(reservationTime)) {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Incorrect date/time'});
            return;
        }
        

        const now = new Date();
        const offset = now.getTimezoneOffset();
        const fixedNow = new Date(now.getTime() - (offset*60*1000));
        if (requestedDate < fixedNow) {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Date cannot be in the past'});
            return;
        }

        
        model.create({
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            status: BookingStatus.PENDING,
            reservationDate: reservationDateTime,
            people: bookingData.people,
            isBirthday: bookingData.isBirthday,
            notes: bookingData.notes
        }).then(() => {
            // const cleanedReservation = model.cleanRecord(response);
            res.send({ message: 'Booking created' });
        }).catch(e => {
            if ((e.message as string).includes('duplicate key')) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Reservation already exists' })
            } else {
                console.log('Failed to create booking: ', e);
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not create booking' })
            }
        })
    } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing data' })
    }
}


export async function confirmBooking(req: Request, res: Response) {

    try {
        const bookingId = new ObjectId(req.params.id);

        model.findAndConfirm(bookingId).then((response) => {
            if (response) {
                const { name, email, phone, reservationDate, people, notes, createdAt } = response;
                // Create reservation
                const reservation: ReservationType = {
                    name,
                    email,
                    phone,
                    reservationDate,
                    people,
                    notes,
                    origin: ReservationOrigin.WEBSITE,
                    createdBy: req.user._id,
                    status: ReservationStatus.CONFIRMED,
                    createdAt // original reservation creation date
                }
                console.log('Will create a reservation for the following: ', reservation);
                Reservation.create(reservation).then(reservationResponse => {
                    const cleanedReservation = Reservation.cleanRecord(reservationResponse);
                    res.send(cleanedReservation);
                }).catch(e => {
                    console.log('Error: ', e);
                    res.status(HttpStatus.BAD_REQUEST).send({ message: 'Failed to create the reservation' });
                })

            } else {
                res.status(HttpStatus.NOT_FOUND).send({ message: 'Reservation not found' })
            }
        }).catch(e => {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not confirm the reservation' });
        })
    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid booking id' })
    }

}

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

        const reservations = await model.findAll(options);
        const cleanedReservations = model.cleanRecords(reservations);
        res.send(cleanedReservations);
    } catch (e) {
        res.status(HttpStatus.SERVER_ERROR).send({ message: 'cannot retrieve bookings' })
    }
}