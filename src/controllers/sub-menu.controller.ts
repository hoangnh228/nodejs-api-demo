import { Request, Response } from "express";
import { responseData } from "../helpers/helpers";
import { SubMenu } from "../db/models/sub-menu";

export const createSubMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, masterMenuId, url, title, icon, ordering, isTargetSelf } = req.body;
        const menu = await SubMenu.create({
            name,
            masterMenuId,
            url,
            title,
            icon,
            ordering,
            isTargetSelf,
            active: true
        });

        res.status(201).send(responseData(201, 'Menu created successfully', null, menu));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const getSubMenus = async (req: Request, res: Response): Promise<void> => {    
    try {
        let menus: SubMenu[] = [];

        if (req.query.getAll === 'true') {
            menus = await SubMenu.findAll();
        } else {
            menus = await SubMenu.findAll({
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

export const getSubMenuById = async (req: Request, res: Response): Promise<void> => {    
    try {
        const { id } = req.params;
        const menu = await SubMenu.findOne({
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

export const updateSubMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, masterMenuId, url, title, icon, ordering, isTargetSelf } = req.body;
        const menu = await SubMenu.findByPk(id);

        if (!menu) {
            res.status(404).send(responseData(404, 'Menu not found', null));
             return;
        }

        menu.name = name;
        menu.masterMenuId = masterMenuId;
        menu.url = url;
        menu.title = title;
        menu.icon = icon;
        menu.ordering = ordering;
        menu.isTargetSelf = isTargetSelf;
        menu.save();

        res.status(200).send(responseData(200, 'Menu updated successfully', null, menu));
    } catch (error: any) {
        res.status(500).send(responseData(500, '', error));
    }
}

export const toggleActiveSubMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const menu = await SubMenu.findByPk(id);

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

export const deleteSubMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const menu = await SubMenu.findByPk(id);

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