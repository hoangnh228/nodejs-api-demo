import { NextFunction, Request, Response } from "express";
import Validator from "validatorjs";
import { responseData } from "../../helpers/helpers";
import User from "../../db/models/user";

export const registerValidation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, passwordConfirmation } = req.body;
        const data = {
            name,
            email,
            password,
            passwordConfirmation
        }

        const rules: Validator.Rules = {
            name: 'required|string|max:50',
            email: 'required|email',
            password: 'required|string|min:6',
        }

        const validator = new Validator(data, rules);
        if (validator.fails()) {
            res.status(400).send(responseData(400, 'Bad request', validator.errors));
            return;
        }

        const user = await User.findOne({ 
            where: { 
                email 
            } 
        });

        if (user) {
            res.status(400).send(responseData(400, 'Bad request', { email: ['Email already exists'] }));
            return;
        }

        next();
    } catch (error) {
        res.status(500).send(responseData(500, '', error));
    }
}