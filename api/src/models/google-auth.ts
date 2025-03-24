import { MongooseQueryOptions, Types } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';

import { UserRoles, UserStatus, UserType } from '../types/user';
import UserSchema from './../schemas/user';
import { BaseModel } from './db';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export enum GoogleAuthErrors {
    'NOT_FOUND' = 100,
    'VALIDATE' = 200,
    'UNAUTHORIZED' = 300,
    'BAD_REQUEST' = 400
}

export class GoogleAuth {

    private oauth2Client: OAuth2Client;

    constructor() {
        const redirectUrl = process.env.GOOGLE_REDIRECT_PATH;
        this.oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, redirectUrl);
    }

    isAuthenticated() {
        return !!this.oauth2Client;
    }

    getOauth2Client() {
        return this.oauth2Client;
    }

    authenticate() {
        try {
            const clientId = process.env.GOOGLE_CLIENT_ID;
            const oauth2Client = new OAuth2Client(clientId);
        } catch(e) {
            console.log('an error occurred with Google authentication: ', e);
        }
    }

}

const googleAuth = new GoogleAuth();

export default googleAuth;