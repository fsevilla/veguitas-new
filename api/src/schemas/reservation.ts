import { model, Schema, SchemaTypes } from 'mongoose';
import { ReservationStatus } from './../types/reservation';

const schema = new Schema({
    name: { type: SchemaTypes.String, required: true },
    email: { type: SchemaTypes.String },
    phone: { type: SchemaTypes.String },
    profile: { type: SchemaTypes.String },
    createdBy: { type: SchemaTypes.ObjectId, ref: 'users' },
    // bookingId: { type: SchemaTypes.ObjectId, ref: 'bookings' },
    status: { type: SchemaTypes.String, default: ReservationStatus.NEW },
    origin: { type: SchemaTypes.String, required: true },
    reservationDate: { type: SchemaTypes.Date, required: true },
    people: { type: SchemaTypes.Number, required: true },
    isBirthday: { type: SchemaTypes.Boolean },
    notes: { type: SchemaTypes.String },
    confirmedBy: { type: SchemaTypes.ObjectId, ref: 'users' },
    cancelationReason: { type: SchemaTypes.String }
}, {
    timestamps: true
});

const schemaModel = model('reservations', schema);

export default schemaModel;
