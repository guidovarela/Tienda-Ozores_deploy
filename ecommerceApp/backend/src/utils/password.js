import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);

    return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

export async function comparePassword(password, storedPassword) {
    if (!storedPassword || !storedPassword.startsWith('scrypt:')) {
        return false;
    }

    const [, salt, storedHash] = storedPassword.split(':');
    if (!salt || !storedHash) {
        return false;
    }

    const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);
    const storedBuffer = Buffer.from(storedHash, 'hex');

    return (
        storedBuffer.length === derivedKey.length &&
        crypto.timingSafeEqual(storedBuffer, derivedKey)
    );
}
