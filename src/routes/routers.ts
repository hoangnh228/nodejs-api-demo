import express from "express";
import { createRole, deleteRole, getRoleById, getRoles, updateRole } from "../controllers/role.controller";
import { getProfile, login, logout, refreshToken, register } from "../controllers/auth.controller";
import { registerValidation } from "../middleware/validation/user.validation";
import { authenticate, normalAdmin, normalUser, superAdmin } from "../middleware/authentication";
import { createMenu, deleteMenu, getMenuById, getMenus, toggleActiveMenu, updateMenu } from "../controllers/menu.controller";
import { createMenuValidation, createRoleMenuAccessValidation, createSubMenuValidation } from "../middleware/validation/menu.validation";
import { createSubMenu, deleteSubMenu, getSubMenuById, getSubMenus, toggleActiveSubMenu, updateSubMenu } from "../controllers/sub-menu.controller";
import { createRoleMenuAccess, deleteRoleMenuAccess, getRoleMenuAccess, getRoleMenuAccessById, toggleActiveRoleMenuAccess, updateRoleMenuAccess } from "../controllers/role-menu-access.controller";

const routers = express.Router();

// auth
routers.post('/user/register', registerValidation, register);
routers.post('/user/login', login);
routers.post('/user/logout', authenticate, logout);
routers.get('/user/refresh-token', refreshToken);
routers.get('/user/profile', authenticate, getProfile);

// role
routers.get('/roles', authenticate, normalUser, getRoles);
routers.get('/roles/:id', authenticate, normalAdmin, getRoleById);
routers.post('/roles', authenticate, normalAdmin, createRole);
routers.put('/roles/:id', authenticate, superAdmin, updateRole);
routers.delete('/roles/:id', authenticate, superAdmin, deleteRole);

// master menu
routers.get('/menus', authenticate, normalAdmin, getMenus);
routers.get('/menus/:id', authenticate, normalAdmin, getMenuById);
routers.post('/menus', createMenuValidation, authenticate, superAdmin, createMenu);
routers.put('/menus/:id', createMenuValidation, authenticate, normalAdmin, updateMenu);
routers.post('/menus/:id/toggle-active', authenticate, normalAdmin, toggleActiveMenu);
routers.delete('/menus/:id', authenticate, superAdmin, deleteMenu);

// sub menu
routers.get('/sub-menus', authenticate, normalAdmin, getSubMenus);
routers.get('/sub-menus/:id', authenticate, normalAdmin, getSubMenuById);
routers.post('/sub-menus', createSubMenuValidation, authenticate, superAdmin, createSubMenu);
routers.put('/sub-menus/:id', createSubMenuValidation, authenticate, normalAdmin, updateSubMenu);
routers.post('/sub-menus/:id/toggle-active', authenticate, normalAdmin, toggleActiveSubMenu);
routers.delete('/sub-menus/:id', authenticate, superAdmin, deleteSubMenu);

// sub menu
routers.get('/role-menu-accesses', authenticate, normalAdmin, getRoleMenuAccess);
routers.get('/role-menu-accesses/:id', authenticate, normalAdmin, getRoleMenuAccessById);
routers.post('/role-menu-accesses', createRoleMenuAccessValidation, authenticate, superAdmin, createRoleMenuAccess);
routers.put('/role-menu-accesses/:id', createRoleMenuAccessValidation, authenticate, normalAdmin, updateRoleMenuAccess);
routers.post('/role-menu-accesses/:id/toggle-active', authenticate, normalAdmin, toggleActiveRoleMenuAccess);
routers.delete('/role-menu-accesses/:id', authenticate, superAdmin, deleteRoleMenuAccess);

export default routers;