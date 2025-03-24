import { scryptSync } from 'crypto';
import { Types } from 'mongoose';
import TokenSchema from './../schemas/token';
import { BaseModel } from './db';
import { TokenType } from './../types/token';

export class Token extends BaseModel  {

    private hours: number = 24;
    private prefix = 'Bearer ey';

    constructor() {
        super(TokenSchema);
    }

    create(userId: Types.ObjectId) {
        const date = new Date();
        const expirationDate = date.setHours(date.getHours() + this.hours); // Add 1 day
        const token = this.prefix + scryptSync(`${userId}_${date.getTime()}`,'salt', 48).toString('hex');

        return TokenSchema.create({
            userId,
            token,
            expirationDate
        })
    }

    findTokenWithUser(token: string) {
        const now = new Date().getTime();
        return TokenSchema.findOne({
            token,
            expirationDate: { $gt: now }
        }).populate('userId');
    }

}

const token = new Token();

export default token;