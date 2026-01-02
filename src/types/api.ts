// src/types/api.ts
// Re-export API types from services for backward compatibility

export type {
  AgentRun,
  AgentEvent,
  Approval,
  RiskLevel,
  CapabilityName,
  RunCreate,
  RunResume,
  ApprovalSubmit,
} from "@/services/run/schemas";

// Chat types
export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// Artifact types
export type ArtifactType = "diagram" | "code_diff" | "markdown" | "task_board";

export interface Artifact {
  id: string;
  type: ArtifactType;
  title?: string;
  content: string;
  created_at: string;
}
