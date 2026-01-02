// src/services/policy/schemas.ts
// Zod schemas for policy-related data

import { z } from "zod";

// Policy response schema - flexible to accommodate various policy configurations
export const PolicyResponseSchema = z.record(z.string(), z.unknown());

// Policy update schema - flexible to accommodate various policy configurations
export const PolicyUpdateSchema = z.record(z.string(), z.unknown());

export type PolicyResponse = z.infer<typeof PolicyResponseSchema>;
export type PolicyUpdate = z.infer<typeof PolicyUpdateSchema>;
