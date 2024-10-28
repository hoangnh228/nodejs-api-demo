import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface UserData {
    id: string | null;
    name: string | null;
    email: string | null;
    roleId: string | null;
    verified: boolean | null;
    active: boolean | null;
}

export const responseData = (
    status: number, 
    message: string | null,
    error: any | null = null, 
    data: any | null = null
) => {
    if (error != null && error instanceof Error) {
        return {
            status: status,
            message: error.message,
            errors: error,
            data: null
        }
    }

    return {
        status, 
        message, 
        errors: error, 
        data
    }
}

export const hashingPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
}

export const generateToken = (data: any, refresh: boolean = false): string => {
    const secret = (refresh ? process.env.JWT_REFRESH_TOKEN : process.env.JWT_SECRET) as string;
    const expiresIn = (refresh ? process.env.JWT_REFRESH_EXPIRES_IN : process.env.JWT_EXPIRES_IN) as string;
    return jwt.sign(data, secret, { expiresIn: expiresIn });
}

export const extractToken = (token: string, refresh: boolean = false): UserData | null => {
    const secret = (refresh ? process.env.JWT_REFRESH_TOKEN : process.env.JWT_SECRET) as string;
    let resData: any = null;

    const res = jwt.verify(token, secret, (err, decoded) => {
        resData = err ? null : decoded;
    });

    return resData ? <UserData>(resData) : null
}