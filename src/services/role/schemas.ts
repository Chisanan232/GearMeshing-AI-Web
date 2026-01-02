// src/services/role/schemas.ts
// Zod schemas for role-related data

import { z } from "zod";

// Role is simply a string representing the agent role name
export const RoleSchema = z.string();

export type Role = z.infer<typeof RoleSchema>;
