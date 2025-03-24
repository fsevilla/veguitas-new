import { ObjectId } from "mongoose";
import { UserType } from "./user";

export interface TokenType {
    token: string;
    userId: ObjectId;
    expirationDate: number;
    createdAt?: number;
    updatedAt?: number;
}
