import { Request, Response } from "express";
import { validationResult, matchedData } from 'express-validator';
import { Mailer } from "../models/mailer";

import GoogleAuth from './../models/google-auth';
import User from "../models/user";
import Token from "../models/token";
import ActivationToken from "../models/activation-token";
import { HttpStatus } from "../types/http-status";
import { ErrorParser } from "../models/db";
import { UserStatus, UserType } from "../types/user";
import { hashPassword } from "../utils";

export function googleSignup(req: Request, res: Response) {
    const oauth2Client = GoogleAuth.getOauth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });

    return res.redirect(authUrl);
}

export async function getGoogleToken(req: Request, res: Response) {
    const oauth2Client = GoogleAuth.getOauth2Client();
    const code = req.query.code as string;

    if (!code) {
        res.status(400).send('Authorization code is missing');
        return;
    }

    
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const userInfoClient = oauth2Client;
        const { data } = await userInfoClient.request({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        });

        res.status(200).json({
            token: tokens.id_token,
            user: data,
        });
    } catch (error) {
        console.error('Error during Google OAuth:', error);
        res.status(500).send('Authentication failed');
    }
}

