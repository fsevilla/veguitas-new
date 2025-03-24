import { ObjectId } from "mongoose";

export enum UserRoles {
    USER = 'user',
    ADMIN = 'admin',
    MANAGER = 'manager',
    SOCIAL = 'social'
}

export enum UserStatus {
    NEW = 'new',
    ACTIVE = 'active',
    BLOCKED = 'blocked',
    DELETED = 'deleted'
}

export interface UserType {
    name: string;
    email: string;
    password?: string;
    role?: UserRoles;
    googleID?: string;
    status?: UserStatus;
    createdAt?: number;
    updatedAt?: number;
}

export interface RequestUser {
    _id: ObjectId;
    name: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
      interface Request {
        user: RequestUser
      }
    }
}