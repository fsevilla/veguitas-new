import { model, Schema, SchemaTypes } from 'mongoose';
import { UserRoles, UserStatus } from './../types/user';

const schema = new Schema({
    name: { type: SchemaTypes.String, required: true },
    email: { type: SchemaTypes.String, required: true, unique: true },
    password: { type: SchemaTypes.String, required: false },
    role: { type: SchemaTypes.String, default: UserRoles.USER },
    googleID: { type: SchemaTypes.String },
    status: { type: SchemaTypes.String, default: UserStatus.NEW },
}, {
    timestamps: true
});

const schemaModel = model('users', schema);

export default schemaModel;
