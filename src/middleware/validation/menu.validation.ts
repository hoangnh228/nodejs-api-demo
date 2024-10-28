import { NextFunction, Request, Response } from "express";
import Validator from "validatorjs";
import { responseData } from "../../helpers/helpers";
import Role from "../../db/models/role";
import { SubMenu } from "../../db/models/sub-menu";
import MasterMenu from "../../db/models/master-menu";

export const createMenuValidation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, icon, ordering } = req.body;
        const data = {
            name,
            icon,
            ordering
        }

        const rules: Validator.Rules = {
            name: 'required|string|max:50',
            icon: 'required|string|max:255',
            ordering: 'required|integer',
        }

        const validator = new Validator(data, rules);
        if (validator.fails()) {
            res.status(400).send(responseData(400, 'Bad request', validator.errors));
            return;
        }

        next();
    } catch (error) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const createSubMenuValidation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, masterMenuId, url, title, icon, ordering, isTargetSelf } = req.body;
        const data = {
            name,
            masterMenuId,
            url,
            title,
            icon,
            ordering,
            isTargetSelf
        }

        const rules: Validator.Rules = {
            name: 'required|string|max:50',
            masterMenuId: 'required|integer',
            url: 'required|string',
            title: 'required|string|max:50',
            icon: 'required|string',
            ordering: 'required|integer',
            isTargetSelf: 'required|boolean',
        }

        const validator = new Validator(data, rules);
        if (validator.fails()) {
            res.status(400).send(responseData(400, 'Bad request', validator.errors));
            return;
        }

        const masterMenu = await MasterMenu.findOne({
            where: {
                id: masterMenuId,
                active : true
            }
        });

        if (!masterMenu) {
            res.status(400).send(responseData(400, 'Bad request', { masterMenuId: ["Master menu not found"] }));
            return;
        }

        next();
    } catch (error) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const createRoleMenuAccessValidation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { roleId, submenuId } = req.body;
        const data = {
            roleId,
            submenuId
        }

        const rules: Validator.Rules = {
            roleId: 'required|integer',
            submenuId: 'required|integer'
        }

        const validator = new Validator(data, rules);
        if (validator.fails()) {
            res.status(400).send(responseData(400, 'Bad request', validator.errors));
            return;
        }

        const role = await Role.findOne({
            where: {
                id: roleId,
                active : true
            }
        });

        if (!role) {
            res.status(400).send(responseData(400, 'Bad request', { roleId: ["Role not found"] }));
            return;
        }

        const submenu = await SubMenu.findOne({
            where: {
                id: submenuId,
                active : true
            }
        });

        if (!submenu) {
            res.status(400).send(responseData(400, 'Bad request', { submenuId: ["Submenu not found"] }));
            return;
        }

        next();
    } catch (error) {
        res.status(500).send(responseData(500, '', error));
    }
}