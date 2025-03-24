import { model, Schema, SchemaTypes } from 'mongoose';
import { BookingStatus } from './../types/booking';

const schema = new Schema({
    name: { type: SchemaTypes.String, required: true },
    email: { type: SchemaTypes.String },
    phone: { type: SchemaTypes.String },
    status: { type: SchemaTypes.String, default: BookingStatus.PENDING },
    reservationDate: { type: SchemaTypes.Date, required: true },
    people: { type: SchemaTypes.Number, required: true },
    isBirthday: { type: SchemaTypes.Boolean },
    notes: { type: SchemaTypes.String },
}, {
    timestamps: true
});

const schemaModel = model('bookings', schema);

export default schemaModel;
