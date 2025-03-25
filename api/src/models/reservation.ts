import { MongooseQueryOptions, Types } from 'mongoose';
import { ReservationOrigin, ReservationStatus, ReservationType } from '../types/reservation';
import ReservationSchema from './../schemas/reservation';
import { BaseModel } from './db';

export class Reservation extends BaseModel  {

    constructor() {
        super(ReservationSchema);
    }

    isOriginValid(origin: string) {
        const validOrigins = [
            ReservationOrigin.WHATSAPP,
            ReservationOrigin.PHONE,
            ReservationOrigin.INSTAGRAM,
            ReservationOrigin.FACEBOOK,
            ReservationOrigin.WEBSITE,
            ReservationOrigin.OTHER,
        ]
        
        return validOrigins.includes(origin as ReservationOrigin);
    }

    isStatusValid(status: string) {
        const validStatus = [
            ReservationStatus.NEW,
            ReservationStatus.ACCEPTED,
            ReservationStatus.CONFIRMED,
            ReservationStatus.CANCELED,
            ReservationStatus.DELETED,
            ReservationStatus.NOSHOW,
        ]
        
        return validStatus.includes(status as ReservationStatus);
    }


    create(data: ReservationType) {
        return ReservationSchema.create({
            ...data,
        })
    }

    findAll(options: MongooseQueryOptions = {}) {
        return ReservationSchema.find({
            ...options
        })
    }


    findOne(options: MongooseQueryOptions) {
        return ReservationSchema.findOne({
            ...options,
        })
    }

    findAndAccept(reservationId: Types.ObjectId) {
        return ReservationSchema.findOneAndUpdate({
            _id: reservationId,
            status: { $in: [
                ReservationStatus.NEW,
            ]}
        }, {
            status: ReservationStatus.ACCEPTED
        })
    }

    findAndConfirm(reservationId: Types.ObjectId, userId: Types.ObjectId) {
        return ReservationSchema.findOneAndUpdate({
            _id: reservationId,
            status: { $in: [
                ReservationStatus.NEW,
                ReservationStatus.ACCEPTED
            ]}
        }, {
            status: ReservationStatus.CONFIRMED,
            confirmedBy: userId
        })
    }

    findAndUpdate(reservationId: Types.ObjectId, data: MongooseQueryOptions) {
        return ReservationSchema.findOneAndUpdate({
            _id: reservationId,
            status: { $ne: ReservationStatus.DELETED }
        }, data, { new: true });
    }

    findAndDelete(reservationId: Types.ObjectId) {
        return ReservationSchema.findOneAndUpdate({
            _id: reservationId,
            status: { $ne: ReservationStatus.DELETED } // Already deleted
        }, {
            status: ReservationStatus.DELETED
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

const reservation = new Reservation();

export default reservation;