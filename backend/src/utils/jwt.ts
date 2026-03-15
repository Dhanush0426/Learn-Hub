import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface TokenPayload {
    userId: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
};
