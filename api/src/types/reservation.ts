import { ObjectId } from "mongoose";

export enum ReservationOrigin {
    WHATSAPP = 'whatsapp',
    PHONE = 'phone',
    INSTAGRAM = 'instagram',
    FACEBOOK = 'fb',
    WEBSITE = 'website',
    OTHER = 'other'
}

export enum ReservationStatus {
    NEW = 'new', // Manager created
    ACCEPTED = 'accepted', // User accepts policies
    CONFIRMED = 'confirmed', // Employee confirms (scheduled)
    REJECTED = 'rejected',
    CANCELED = 'canceled',
    NOSHOW = 'noshow',
    DELETED = 'deleted'
}

export interface ReservationType {
    name: string;
    email?: string;
    phone?: string;
    profile?: string;
    createdBy?: ObjectId;
    confirmedBy?: ObjectId;
    status?: ReservationStatus;
    origin: ReservationOrigin;
    reservationDate: string;
    people: number;
    isBirthday?: boolean;
    notes?: string;
    cancelationReason?: string;
    createdAt?: number;
    updatedAt?: number;
}
