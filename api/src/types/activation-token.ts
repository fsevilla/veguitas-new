import { ObjectId } from "mongoose";

export enum ActivationTokenStatus {
    NEW,
    USED
}

export interface ActivationTokenType {
    token: string;
    userId: ObjectId;
    expirationDate: number;
    status: ActivationTokenStatus
}