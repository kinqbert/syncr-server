import { sql } from "drizzle-orm"
import { foreignKey, integer, pgTable, serial,text, unique } from "drizzle-orm/pg-core"



export const refreshTokens = pgTable("refresh_tokens", {
	token: text().primaryKey().notNull(),
	userId: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "refresh_tokens_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const roles = pgTable("roles", {
	id: serial().primaryKey().notNull(),
	key: text().notNull(),
	name: text().notNull(),
}, (table) => [
	unique("roles_key_unique").on(table.key),
	unique("roles_name_unique").on(table.name),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	password: text().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_password_unique").on(table.password),
]);

export const permissions = pgTable("permissions", {
	id: serial().primaryKey().notNull(),
	key: text().notNull(),
}, (table) => [
	unique("permissions_key_unique").on(table.key),
]);

export const rolePermissions = pgTable("role_permissions", {
	roleId: integer("role_id").notNull(),
	permissionId: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_permissions_role_id_roles_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [roles.id],
			name: "role_permissions_permissionId_roles_id_fk"
		}).onDelete("cascade"),
]);

export const userCompanyRoles = pgTable("user_company_roles", {
	userId: integer("user_id").notNull(),
	companyId: integer("company_id").notNull(),
	roleId: integer("role_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_company_roles_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "user_company_roles_company_id_companies_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "user_company_roles_role_id_roles_id_fk"
		}).onDelete("cascade"),
]);

export const companies = pgTable("companies", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
}, (table) => [
	unique("companies_name_unique").on(table.name),
]);
