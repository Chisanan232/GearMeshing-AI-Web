// src/services/agent-config/schemas.ts
// Zod schemas for agent configuration data

import { z } from "zod";

// Agent configuration create schema - flexible to accommodate various config options
export const AgentConfigCreateSchema = z.record(z.string(), z.unknown());

// Agent configuration read schema - flexible to accommodate various config options
export const AgentConfigDetailSchema = z.record(z.string(), z.unknown());

export type AgentConfigCreate = z.infer<typeof AgentConfigCreateSchema>;
export type AgentConfigDetail = z.infer<typeof AgentConfigDetailSchema>;
