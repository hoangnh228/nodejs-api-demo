import { Request, Response } from "express";
import { responseData } from "../helpers/helpers";
import MasterMenu from "../db/models/master-menu";

export const createMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, icon, ordering } = req.body;
        const menu = await MasterMenu.create({
            name,
            icon,
            ordering,
            active: true
        });

        res.status(201).send(responseData(201, 'Menu created successfully', null, menu));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const getMenus = async (req: Request, res: Response): Promise<void> => {    
    try {
        let menus: MasterMenu[] = [];

        if (req.query.getAll === 'true') {
            menus = await MasterMenu.findAll();
        } else {
            menus = await MasterMenu.findAll({
                where: {
                    active: true
                }
            });
        }
        
        res.status(200).send(responseData(200, 'Success', null, menus));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const getMenuById = async (req: Request, res: Response): Promise<void> => {    
    try {
        const { id } = req.params;
        const menu = await MasterMenu.findOne({
            where: {
                id, 
                active: true
            }
        });

        if (!menu) {
            res.status(404).send(responseData(404, 'Menu not found', null));
             return;
        }

        res.status(200).send(responseData(200, 'Success', null, menu));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const updateMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, icon, ordering } = req.body;
        const menu = await MasterMenu.findByPk(id);

        if (!menu) {
            res.status(404).send(responseData(404, 'Menu not found', null));
             return;
        }

        menu.name = name;
        menu.icon = icon;
        menu.ordering = ordering;
        menu.save();

        res.status(200).send(responseData(200, 'Menu updated successfully', null, menu));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const toggleActiveMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const menu = await MasterMenu.findByPk(id);

        if (!menu) {
            res.status(404).send(responseData(404, 'Menu not found', null));
             return;
        }

        menu.active = !menu.active;
        menu.save();

        const status = menu.active ? 'activated' : 'deactivated';
        res.status(200).send(responseData(200, `Menu ${status} successfully`, null, menu));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const deleteMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const menu = await MasterMenu.findByPk(id);

        if (!menu) {
            res.status(404).send(responseData(404, 'Menu not found', null));
             return;
        }

        await menu.destroy();
        res.status(200).send(responseData(200, 'Menu deleted successfully'));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}