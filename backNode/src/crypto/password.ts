import crypto from "node:crypto";

export type Password = {
    salt:string,
    hash:Buffer
}

export function hashPassword(password:string):Password {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        'sha512'
    );
    return {
        salt,
        hash
    }
}

export function verifyPassWord(toVerify:string, password:Password) {
    return crypto.pbkdf2Sync(
        toVerify,
        password.salt,
        1000,
        64,
        'sha512'
    ).compare(password.hash) == 0;
}