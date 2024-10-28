import { NextFunction, Request, Response } from "express";
import { extractToken, responseData } from "../helpers/helpers";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authToken = req.headers.authorization;
        const token = authToken && authToken.split(' ')[1];
        if (!token) {
            res.status(401).send(responseData(401, 'Unauthorized'));
            return;
        }

        const result = extractToken(token!);
        if (!result) {
            res.status(401).send(responseData(401, 'Unauthorized'));
            return;
        }

        res.locals.userEmail = result?.email;
        res.locals.roleId = result?.roleId;

        next();
    } catch (error: any) {
        res.status(500).send(responseData(500, 'Internal Server Error', error));
    }
}

export const superAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const roleId = res.locals.roleId;
    if (roleId !== 1) {
        res.status(403).send(responseData(403, 'Forbidden'));
        return;
    }
    next();
}

export const normalAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const roleId = res.locals.roleId;

    if (roleId === 1) {
        next();
        return;
    }

    if (roleId !== 2) {
        res.status(403).send(responseData(403, 'Forbidden'));
        return;
    }
    next();
}

export const normalUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const roleId = res.locals.roleId;

    if (roleId === 1) {
        next();
        return;
    }

    if (roleId !== 3) {
        res.status(403).send(responseData(403, 'Forbidden'));
        return;
    }
    next();
}