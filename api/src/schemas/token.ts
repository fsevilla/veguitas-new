import { model, Schema, SchemaTypes } from 'mongoose';

const schema = new Schema({
    token: { type: SchemaTypes.String, required: true },
    userId: { type: SchemaTypes.ObjectId, ref: 'users' },
    expirationDate: { type: SchemaTypes.Date },
}, {
    timestamps: true
});

const schemaModel = model('sessions', schema);

export default schemaModel;
