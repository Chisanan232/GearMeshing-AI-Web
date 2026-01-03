// src/services/run/schemas.ts
// Zod schemas for run service requests and responses

import { z } from "zod";

// Base schemas
const DateStringSchema = z.string().datetime();

const RiskLevelSchema = z.enum(["low", "medium", "high"]);

const CapabilityNameSchema = z.enum([
  "web_search",
  "web_fetch",
  "docs_read",
  "summarize",
  "mcp_call",
  "codegen",
  "code_execution",
  "shell_exec",
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
const AgentEventTypeSchema = z.enum([
  "run.started",
  "run.completed",
  "run.failed",
  "state.transition",
  "plan.created",
  "thought.executed",
  "artifact.created",
  "capability.requested",
  "capability.executed",
  "tool.invoked",
  "approval.requested",
  "approval.resolved",
  "checkpoint.saved",
  "usage.recorded",
]);

export const AgentEventSchema = z.object({
  id: z.string().optional(),
  run_id: z.string(),
  type: AgentEventTypeSchema,
  payload: z.record(z.string(), z.unknown()),
  created_at: DateStringSchema.optional(),
  correlation_id: z.string().optional(),
});

// Approval schemas
export const ApprovalSchema = z.object({
  id: z.string(),
  run_id: z.string(),
  risk: RiskLevelSchema,
  capability: CapabilityNameSchema.optional(),
  reason: z.string(),
  requested_at: DateStringSchema,
  expires_at: DateStringSchema.optional(),
  decision: z.enum(["approved", "rejected"]).optional(),
  decided_at: DateStringSchema.optional(),
  // New fields for MCP/command/external approval
  type: z.enum(["mcp_tool", "command_line", "external_link"]).optional(),
  source: z.string().optional(), // MCP Server name, "terminal", or "GitHub"
  action: z.string().optional(), // Tool name, command string, or GitHub URL
  params: z.record(z.string(), z.unknown()).optional(), // MCP tool parameters or GitHub metadata
  metadata: z
    .object({
      can_edit: z.boolean().optional(),
      pr_number: z.number().optional(), // GitHub PR number
      repo_name: z.string().optional(), // GitHub repository name
    })
    .optional(),
});

export const ApprovalSubmitSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  note: z.string().optional(),
  action: z.string().optional(), // Edited action/command value
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
