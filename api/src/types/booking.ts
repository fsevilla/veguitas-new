import { ObjectId } from "mongoose";


export enum BookingStatus {
    PENDING = 'pending', // Created by client
    SKIPPED = 'skipped', // Skipped when the same reservation alreday exists
    CONFIRMED = 'confirmed', // Employee confirms (scheduled)
    REJECTED = 'rejected',
    INFO_NEEDED = 'info_needed',
}

export interface BookingType {
    name: string;
    email?: string;
    phone?: string;
    status?: BookingStatus;
    reservationDate: string;
    people: number;
    isBirthday?: boolean;
    notes?: string;
    createdAt?: number;
    updatedAt?: number;
}
