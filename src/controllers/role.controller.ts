import { Request, Response } from "express";
import Role from "../db/models/role";

export const getRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const roles = await Role.findAll({
            where: {
                active: true
            }
        });

        res.status(200).send({
            status: 200,
            message: 'Success',
            data: roles
        });
    } catch (error: any) {
        if (error != null && error instanceof Error) {
            res.status(500).send({
                status: 500,
                message: error.message,
                errors: error
            });
            return
        }

        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            errors: error
        });
    }
}

export const getRoleById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);
        
        if (!role) {
            res.status(404).send({
                status: 404,
                message: 'Role not found',
                data: null
            });
            return
        }

        res.status(200).send({
            status: 200,
            message: 'Success',
            data: role
        });
    } catch (error: any) {
        if (error != null && error instanceof Error) {
            res.status(500).send({
                status: 500,
                message: error.message,
                errors: error
            });
            return
        }

        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            errors: error
        });
    }
}

export const createRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { roleName, active } = req.body;
        const role = await Role.create({
            roleName,
            active
        });

        res.status(201).send({
            status: 201,
            message: 'Role created',
            data: role
        });
    } catch (error: any) {
        if (error != null && error instanceof Error) {
            res.status(500).send({
                status: 500,
                message: error.message,
                errors: error
            });
            return
        }

        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            errors: error
        });
    }
}

export const updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { roleName, active } = req.body;
        const role = await Role.findByPk(id);

        if (!role) {
            res.status(404).send({
                status: 404,
                message: 'Role not found',
                data: null
            });
            return
        }

        role.roleName = roleName;
        role.active = active;
        await role.save();

        res.status(200).send({
            status: 200,
            message: 'Role updated',
            data: role
        });
    } catch (error: any) {
        if (error != null && error instanceof Error) {
            res.status(500).send({
                status: 500,
                message: error.message,
                errors: error
            });
            return
        }

        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            errors: error
        });
    }
}

export const deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);

        if (!role) {
            res.status(404).send({
                status: 404,
                message: 'Role not found',
                data: null
            });
            return
        }

        role.destroy();
        res.status(200).send({
            status: 200,
            message: 'Role deleted',
            data: null
        });
    } catch (error: any) {
        if (error != null && error instanceof Error) {
            res.status(500).send({
                status: 500,
                message: error.message,
                errors: error
            });
            return
        }

        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            errors: error
        });
    }
}
