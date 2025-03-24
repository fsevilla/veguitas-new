import fs from 'fs';
import path from 'path';
import { compile } from 'handlebars';
import { UserType } from './../types/user';
import nodemailer, { Transporter } from 'nodemailer';

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
}

interface MailInfo {
    to: string;
    subject: string;
    text?: string;
    template: string;
}

interface TemplateData {
    [key: string]: unknown
}

export class MissingSMTPTransporterError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'MissingSMTPTransporterError';
      Object.setPrototypeOf(this, MissingSMTPTransporterError.prototype);
    }
}

const _transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export class Mailer {

    static validate() {
        return !!_transporter;
    }

    static loadEmailTemplate(name: string, data: TemplateData) {
        const source = fs.readFileSync(path.join(__dirname, '..', 'views', 'email', name + '.handlebars'), 'utf8');
        const template = compile(source);
        return template({ ...data });
    } 

    static async sendMail(options: MailInfo, data: TemplateData) {

        const html = Mailer.loadEmailTemplate(options.template, data);

        const mailOptions: MailOptions = {
            from: process.env.EMAIL_USER!,
            to: options.to,
            subject: options.subject,
            text: options.text || '',
            html
        }
        
        try {
            await _transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            if (process.env.DEBUG_EMAIL === 'true') {
                console.log('SMTP Error: ', error);
            }
            return false;
        }
    }

    static sendUserConfirmationEmail(user: any, code: string) {
        if (process.env.SEND_CONFIRMATION_EMAIL !== 'true') return;

        if (!Mailer.validate()) {
            throw new MissingSMTPTransporterError('missing smtp configuration');
        }

        Mailer.sendMail({
            to: user.email,
            subject: 'Confirma tu cuenta de Usuario',
            template: 'confirmation'
        }, {
            name: user.name,
            email: user.email,
            confirmationUrl: `${process.env.CLIENT_URL}/account/confirm/${code}`
        })
    }

    static sendUserActivatedEmail(user: any) {
        if (process.env.SEND_ACTIVATION_EMAIL !== 'true') return;

        if (!Mailer.validate()) {
            throw new MissingSMTPTransporterError('missing smtp configuration');
        }

        Mailer.sendMail({
            to: user.email,
            subject: 'Usuario confirmado',
            template: 'activation'
        }, {
            name: user.name,
            email: user.email,
            loginUrl: `${process.env.CLIENT_URL}`
        })
    }

}