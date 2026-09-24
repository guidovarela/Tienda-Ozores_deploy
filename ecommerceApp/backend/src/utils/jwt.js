import crypto from 'node:crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_local_para_clase_10';

function base64urlEncode(value) {
    const source = typeof value === 'string' ? value : JSON.stringify(value);
    return Buffer.from(source)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64urlDecode(value) {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf8');
}

function createSignature(header, payload) {
    return crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${payload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export function signToken(payload, expiresInSeconds = 7200) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
        ...payload,
        exp: now + expiresInSeconds
    };

    const encodedHeader = base64urlEncode(header);
    const encodedPayload = base64urlEncode(tokenPayload);
    const signature = createSignature(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyToken(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Token inválido');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Token mal formado');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = createSignature(encodedHeader, encodedPayload);

    const receivedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (
        receivedBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
        throw new Error('Firma inválida');
    }

    let header;
    let payload;
    try {
        header = JSON.parse(base64urlDecode(encodedHeader));
        payload = JSON.parse(base64urlDecode(encodedPayload));
    } catch (error) {
        throw new Error('Token inválido');
    }

    if (header.alg !== 'HS256' || header.typ !== 'JWT') {
        throw new Error('Token inválido');
    }

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp <= now) {
        throw new Error('Token expirado');
    }

    return payload;
}
