import { scryptSync } from 'crypto';
import { hashSync } from 'bcryptjs';

export function hashPassword(password: string) {
    let hashedPassword;
    const encrypt = process.env.ENCRYPT;
    if(encrypt === 'bcrypt') {
      hashedPassword = hashSync(password, 12);
    } else if (encrypt == 'crypto') {
      hashedPassword = scryptSync(password,'salt', 24).toString('hex');
    } else {
        throw new Error("Encryption method has not been provided")
    }
    
    return hashedPassword;
}

export function isDev() {
  return process.env.NODE_ENV === 'dev';
}

export function isProd() {
  const nodeEnv = process.env.NODE_ENV;
  return nodeEnv === 'prod' || nodeEnv === 'production';
}

export function isNotProd() {
  const nodeEnv = process.env.NODE_ENV;
  return nodeEnv !== 'prod' && nodeEnv !== 'production';
}