import { MongooseQueryOptions, Types } from 'mongoose';
import { BookingStatus, BookingType } from './../types/booking';
import BookingSchema from './../schemas/booking';
import { BaseModel } from './db';

export class Booking extends BaseModel  {

    constructor() {
        super(BookingSchema);
    }

    isStatusValid(status: string) {
        const validStatus = [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.SKIPPED,
            BookingStatus.INFO_NEEDED,
            BookingStatus.REJECTED,
        ]
        
        return validStatus.includes(status as BookingStatus);
    }


    create(data: BookingType) {
        return this.model.create({
            ...data,
        })
    }

    findAll(options: MongooseQueryOptions = {}) {
        return this.model.find({
            ...options
        })
    }


    findOne(options: MongooseQueryOptions) {
        return this.model.findOne({
            ...options,
        })
    }

    findAndConfirm(reservationId: Types.ObjectId) {
        // TODO: create reservation in reservations collection
        return this.model.findOneAndUpdate({
            _id: reservationId,
            status: { $nin: [
                // BookingStatus.CONFIRMED,
                BookingStatus.REJECTED,
            ]}
        }, {
            status: BookingStatus.CONFIRMED
        })
    }

    findAndReject(reservationId: Types.ObjectId) {
        return this.model.findOneAndUpdate({
            _id: reservationId,
            status: { $ne: BookingStatus.REJECTED } // Already rejected
        }, {
            status: BookingStatus.REJECTED
        })
    }

    isValidDay(day: number) {
        // Wed to Sat ()
        return day >= 3 && day <= 6;
    }

    isValidHour(time: string) {
        const _time = +time.replace(':', '');
        return _time >= 1900 && _time <= 2100;
    }
}

const booking = new Booking();

export default booking;