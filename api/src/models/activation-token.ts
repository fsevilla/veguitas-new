import { scryptSync } from 'crypto';
import { Types } from 'mongoose';
import ActivationTokenSchema from './../schemas/activation-token';
import { BaseModel } from './db';
import { ActivationTokenStatus } from './../types/activation-token';

export class ActivationToken extends BaseModel  {

    private days: number = 7;

    constructor() {
        super(ActivationTokenSchema);
    }

    create(userId: Types.ObjectId) {
        const date = new Date();
        const expirationDate = date.setHours(date.getHours() + (this.days * 24));
        const token = scryptSync(`${userId}_${date.getTime()}`,'salt', 24).toString('hex');

        return ActivationTokenSchema.create({
            userId: userId,
            token,
            expirationDate
        })
    }

    findAndUse(token: string) {
        const now = new Date().getTime();
        return ActivationTokenSchema.findOneAndUpdate({
            token,
            expirationDate: { $gt: now },
            status: ActivationTokenStatus.NEW
        }, {
            status: ActivationTokenStatus.USED
        })
    }

}

const activationToken = new ActivationToken();

export default activationToken;