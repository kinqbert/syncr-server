import { relations } from "drizzle-orm/relations";
import { users, refreshTokens, roles, rolePermissions, userCompanyRoles, companies } from "./schema";

export const refreshTokensRelations = relations(refreshTokens, ({one}) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	refreshTokens: many(refreshTokens),
	userCompanyRoles: many(userCompanyRoles),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	role_roleId: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id],
		relationName: "rolePermissions_roleId_roles_id"
	}),
	role_permissionId: one(roles, {
		fields: [rolePermissions.permissionId],
		references: [roles.id],
		relationName: "rolePermissions_permissionId_roles_id"
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	rolePermissions_roleId: many(rolePermissions, {
		relationName: "rolePermissions_roleId_roles_id"
	}),
	rolePermissions_permissionId: many(rolePermissions, {
		relationName: "rolePermissions_permissionId_roles_id"
	}),
	userCompanyRoles: many(userCompanyRoles),
}));

export const userCompanyRolesRelations = relations(userCompanyRoles, ({one}) => ({
	user: one(users, {
		fields: [userCompanyRoles.userId],
		references: [users.id]
	}),
	company: one(companies, {
		fields: [userCompanyRoles.companyId],
		references: [companies.id]
	}),
	role: one(roles, {
		fields: [userCompanyRoles.roleId],
		references: [roles.id]
	}),
}));

export const companiesRelations = relations(companies, ({many}) => ({
	userCompanyRoles: many(userCompanyRoles),
}));