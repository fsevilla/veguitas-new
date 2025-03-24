import { MongooseQueryOptions, Types } from 'mongoose';
import { UserRoles, UserStatus, UserType } from '../types/user';
import UserSchema from './../schemas/user';
import { BaseModel } from './db';

export class User extends BaseModel  {

    constructor() {
        super(UserSchema);
    }

    hiddenProps = [
        'password',
    ];

    isRoleValid(role: string) {
        const validRoles = [
            UserRoles.ADMIN,
            UserRoles.USER
        ]
        
        return validRoles.includes(role as UserRoles);
    }

    isStatusValid(status: string) {
        const validStatus = [
            UserStatus.NEW,
            UserStatus.ACTIVE,
            UserStatus.BLOCKED,
            UserStatus.DELETED,
        ]
        
        return validStatus.includes(status as UserStatus);
    }


    signup(data: UserType) {
        return UserSchema.create({
            ...data,
            status: UserStatus.NEW,
            role: UserRoles.USER
        })
    }

    create(data: UserType) {
        return UserSchema.create({
            ...data
        })
    }

    findAllUsers(options: MongooseQueryOptions = {}) {
        return UserSchema.find({
            ...options
        })
    }

    findAllActiveUsers(options: MongooseQueryOptions = {}) {
        return UserSchema.find({
            ...options,
            status: UserStatus.ACTIVE
        })
    }

    findActiveUser(options: MongooseQueryOptions) {
        return UserSchema.findOne({
            ...options,
            status: UserStatus.ACTIVE
        })
    }

    findOne(options: MongooseQueryOptions) {
        return UserSchema.findOne({
            ...options,
        })
    }

    findByCredentials(email: string, password: string) {
        return UserSchema.findOne({
            email,
            password
        })
    }

    findAndActivate(userId: Types.ObjectId) {
        return UserSchema.findOneAndUpdate({
            _id: userId,
            status: UserStatus.NEW
        }, {
            status: UserStatus.ACTIVE
        })
    }

    findAndUpdate(userId: Types.ObjectId, data: MongooseQueryOptions) {
        return UserSchema.findOneAndUpdate({
            _id: userId,
            status: { $ne: UserStatus.DELETED }
        }, data, { new: true });
    }

    findAndDelete(userId: Types.ObjectId) {
        return UserSchema.findOneAndUpdate({
            _id: userId,
            status: { $ne: UserStatus.DELETED } // Already deleted
        }, {
            status: UserStatus.DELETED
        })
    }
}

const user = new User();

export default user;