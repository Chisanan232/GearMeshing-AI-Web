// src/services/run/schemas.ts
// Zod schemas for run service requests and responses

import { z } from "zod";

// Base schemas
const DateStringSchema = z.string().datetime();

const RiskLevelSchema = z.enum(["low", "medium", "high"]);

const CapabilityNameSchema = z.enum([
  "code_execution",
  "file_operations",
  "system_commands",
  "network_access",
]);

// Run schemas
export const AgentRunSchema = z.object({
  id: z.string(),
  objective: z.string(),
  role: z.string(),
  status: z.string(),
  tenant_id: z.string().optional(),
  created_at: DateStringSchema,
  updated_at: DateStringSchema,
});

export const RunCreateSchema = z.object({
  objective: z.string(),
  role: z.string(),
  tenant_id: z.string().optional(),
});

export const RunResumeSchema = z.object({
  approved_by: z.string(),
});

// Run Event schemas
export const AgentEventSchema = z.object({
  id: z.string(),
  run_id: z.string(),
  type: z.string(),
  payload: z.record(z.unknown()),
  created_at: DateStringSchema,
});

// Approval schemas
export const ApprovalSchema = z.object({
  id: z.string(),
  run_id: z.string(),
  risk: RiskLevelSchema,
  capability: CapabilityNameSchema,
  reason: z.string(),
  requested_at: DateStringSchema,
  expires_at: DateStringSchema.optional(),
  decision: z.enum(["approved", "rejected"]).optional(),
  decided_at: DateStringSchema.optional(),
});

export const ApprovalSubmitSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  note: z.string().optional(),
});

// Type exports
export type AgentRun = z.infer<typeof AgentRunSchema>;
export type RunCreate = z.infer<typeof RunCreateSchema>;
export type RunResume = z.infer<typeof RunResumeSchema>;
export type AgentEvent = z.infer<typeof AgentEventSchema>;
export type Approval = z.infer<typeof ApprovalSchema>;
export type ApprovalSubmit = z.infer<typeof ApprovalSubmitSchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;
export type CapabilityName = z.infer<typeof CapabilityNameSchema>;
