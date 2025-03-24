import { ActivationTokenStatus } from './../types/activation-token';
import { model, Schema, SchemaTypes } from 'mongoose';

const schema = new Schema({
    token: { type: SchemaTypes.String, required: true },
    userId: { type: SchemaTypes.ObjectId },
    expirationDate: { type: SchemaTypes.Date },
    status: { type: SchemaTypes.String, default: ActivationTokenStatus.NEW }
}, {
    timestamps: true
});

const schemaModel = model('activation_tokens', schema);

export default schemaModel;
