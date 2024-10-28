import { Request, Response } from "express";
import { comparePassword, extractToken, generateToken, hashingPassword, responseData } from "../helpers/helpers";
import User from "../db/models/user";
import Role from "../db/models/role";
import RoleMenuAccess from "../db/models/role-menu-access";
import { SubMenu } from "../db/models/sub-menu";
import { Op } from "sequelize";
import MasterMenu from "../db/models/master-menu";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, roleId } = req.body;
        const hashedPassword = await hashingPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            roleId,
            verified: true,
            active: true
        });

        res.status(201).send(responseData(201, 'Register successfully', null, user));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            res.status(404).send(responseData(404, 'Email does not exist'));
            return;
        }

        if (!user.active) {
            res.status(403).send(responseData(403, 'Your account is inactive'));
            return;
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(401).send(responseData(401, 'Password is not correct'));
             return;
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            verified: user.verified,
            active: user.active
        }

        const token = generateToken(userData);
        const refreshToken = generateToken(userData, true);

        user.accessToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        const roleAccesses = await RoleMenuAccess.findAll({
            where: {
                roleId: user.roleId,
                active: true
            }
        });

        const submenuIds = roleAccesses.map(item => item.submenuId);

        const menuAccesses = await MasterMenu.findAll({
            where: {
                active: true
            },
            order: [
                ['ordering', 'ASC'],
                [SubMenu, 'ordering', 'ASC']
            ],
            include: [
                {
                    model: SubMenu,
                    where: {
                        id: { [Op.in]: submenuIds }
                    }
                }
            ]
        });

        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            verified: user.verified,
            active: user.active,
            token,
            menuAccesses: menuAccesses
        }

        res.status(200).send(responseData(200, 'Login successfully', null, response));
        return;
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(401).send(responseData(401, 'Unauthorized'));
            return;
        }

        const decoded = extractToken(refreshToken, true);
        if (!decoded) {
            res.status(403).send(responseData(403, 'Invalid refresh token'));
            return;
        }

        const token = generateToken({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            roleId: decoded.roleId,
            verified: decoded.verified,
            active: decoded.active
        });

        const result = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            roleId: decoded.roleId,
            verified: decoded.verified,
            active: decoded.active,
            token
        }

        res.status(200).send(responseData(200, 'Refresh token successfully', null, result));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = res.locals.userEmail;
        const user = await User.findOne({
            where: {
                email: email
            },
            include: {
                model: Role, attributes: ['id', 'roleName']
            }
        });

        if (!user) {
            res.status(404).send(responseData(404, 'User not found'));
             return;
        }

        user.password = '';
        user.accessToken = '';

        res.status(200).send(responseData(200, 'Get profile successfully', null, user));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(200).send(responseData(200, 'Logged out'));
            return;
        }

        const email = res.locals.userEmail;
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            user.accessToken = '';
            await user.save();
        }

        res.clearCookie('refreshToken');
        res.status(200).send(responseData(200, 'Logged out'));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}