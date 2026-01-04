import { z } from "zod";

// --- Capabilities ---
export const CapabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(["filesystem", "network", "system", "browser", "analysis"]),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
});

export type Capability = z.infer<typeof CapabilitySchema>;

// --- Agent Roles ---
export const LLMConfigSchema = z.object({
  provider: z.string(),
  model: z.string(),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().optional(),
});

export const AgentRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string().optional(), // lucide icon name
  llmConfig: LLMConfigSchema,
  capabilities: z.array(z.string()), // Capability IDs
  extensionMetadata: z.record(z.string(), z.unknown()).optional(),
  isSystem: z.boolean().default(false),
});

export type AgentRole = z.infer<typeof AgentRoleSchema>;

// --- Policies ---
export const PolicyRuleSchema = z.object({
  id: z.string(),
  resource: z.string(), // e.g., "cli.execute", "fs.write"
  action: z.enum(["allow", "deny", "require_approval"]),
  conditions: z.record(z.string(), z.unknown()).optional(),
});

export const PolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  scope: z.enum(["global", "agent"]),
  agentId: z.string().optional(), // If scope is agent
  rules: z.array(PolicyRuleSchema),
  isActive: z.boolean().default(true),
  lastUpdated: z.string(),
});

export type Policy = z.infer<typeof PolicySchema>;
export type PolicyRule = z.infer<typeof PolicyRuleSchema>;

// --- MCP Servers ---
export const MCPServerSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  status: z.enum(["connected", "disconnected", "error"]),
  tools: z.array(z.string()), // List of tool names provided
  lastHeartbeat: z.string().optional(),
});

export type MCPServer = z.infer<typeof MCPServerSchema>;
