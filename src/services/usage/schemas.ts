// src/services/usage/schemas.ts
// Zod schemas for usage-related data

import { z } from "zod";

// Usage statistics schema - flexible to accommodate various metrics
export const UsageStatsSchema = z.record(z.string(), z.unknown());

export type UsageStats = z.infer<typeof UsageStatsSchema>;
