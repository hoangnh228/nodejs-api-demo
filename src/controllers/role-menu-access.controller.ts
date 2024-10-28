import { Request, Response } from "express";
import { responseData } from "../helpers/helpers";
import RoleMenuAccess from "../db/models/role-menu-access";
import { SubMenu } from "../db/models/sub-menu";
import Role from "../db/models/role";


export const createRoleMenuAccess = async (req: Request, res: Response):Promise<void> => {
    try {
        const { roleId, submenuId } = req.body;
        const access = await RoleMenuAccess.create({ 
            roleId, 
            submenuId,
            active: true
        });
        res.status(201).send(responseData(201, 'Access created successfully', access));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const getRoleMenuAccess = async (req: Request, res: Response):Promise<void> => {
    try {
        try {
        let accesses: RoleMenuAccess[] = [];
        const include = [
            {
                model: SubMenu,
                attributes: ['name']
            },
            {
                model: Role,
                attributes: ['roleName']
            }
        ]

        if (req.query.getAll === 'true') {
            accesses = await RoleMenuAccess.findAll({
                include: include
            });
        } else {
            accesses = await RoleMenuAccess.findAll({
                where: {
                    active: true
                },
                include: include
            });
        }
        
        res.status(200).send(responseData(200, 'Success', null, accesses));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const getRoleMenuAccessById = async (req: Request, res: Response):Promise<void> => {
    try {
        const { id } = req.params;
        const access = await RoleMenuAccess.findOne({
            where: {
                id
            },
            include: [
                {
                    model: SubMenu,
                    attributes: ['name']
                },
                {
                    model: Role,
                    attributes: ['roleName']
                }
            ]
        });

        if (!access) {
            res.status(404).send(responseData(404, 'Access not found', null));
            return;
        }

        res.status(200).send(responseData(200, 'Success', null, access));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const updateRoleMenuAccess = async (req: Request, res: Response):Promise<void> => {
    try {
        const { id } = req.params;
        const { roleId, submenuId } = req.body;
        const access = await RoleMenuAccess.findByPk(id);

        if (!access) {
            res.status(404).send(responseData(404, 'Access not found', null));
            return;
        }

        access.roleId = roleId;
        access.submenuId = submenuId;
        access.save();

        res.status(200).send(responseData(200, 'Access updated successfully', access));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const toggleActiveRoleMenuAccess = async (req: Request, res: Response):Promise<void> => {
    try {
        const { id } = req.params;
        const access = await RoleMenuAccess.findByPk(id);

        if (!access) {
            res.status(404).send(responseData(404, 'Access not found', null));
             return;
        }

        access.active = !access.active;
        access.save();

        const status = access.active ? 'activated' : 'deactivated';
        res.status(200).send(responseData(200, `Menu ${status} successfully`, null, access));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const deleteRoleMenuAccess = async (req: Request, res: Response):Promise<void> => {
    try {
        const { id } = req.params;
        const access = await RoleMenuAccess.findByPk(id);

        if (!access) {
            res.status(404).send(responseData(404, 'Access not found', null));
             return;
        }

        await access.destroy();
        res.status(200).send(responseData(200, 'Access deleted successfully'));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}