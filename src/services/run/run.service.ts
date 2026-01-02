// src/services/run/run.service.ts
// Domain service for run management - pure functions, no state

import { httpClient } from "@/lib/api-client";
import { z } from "zod";
import {
  AgentRunSchema,
  AgentEventSchema,
  ApprovalSchema,
  AgentRun,
  AgentEvent,
  RunCreate,
  RunResume,
  Approval,
  ApprovalSubmit,
} from "./schemas";

export const runService = {
  // Runs
  async createRun(data: RunCreate): Promise<AgentRun> {
    return httpClient.requestWithValidation(
      "POST",
      "/api/v1/runs/",
      AgentRunSchema,
      { body: data },
    );
  },

  async listRuns(params?: {
    tenant_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<AgentRun[]> {
    const query = new URLSearchParams();
    if (params?.tenant_id) query.append("tenant_id", params.tenant_id);
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.offset) query.append("offset", params.offset.toString());

    const path = `/api/v1/runs/${query.toString() ? "?" + query.toString() : ""}`;
    return httpClient.requestWithValidation(
      "GET",
      path,
      z.array(AgentRunSchema),
    );
  },

  async getRun(runId: string): Promise<AgentRun> {
    return httpClient.requestWithValidation(
      "GET",
      `/api/v1/runs/${runId}`,
      AgentRunSchema,
    );
  },

  async resumeRun(runId: string, data: RunResume): Promise<AgentRun> {
    return httpClient.requestWithValidation(
      "POST",
      `/api/v1/runs/${runId}/resume`,
      AgentRunSchema,
      { body: data },
    );
  },

  async cancelRun(runId: string): Promise<AgentRun> {
    return httpClient.requestWithValidation(
      "POST",
      `/api/v1/runs/${runId}/cancel`,
      AgentRunSchema,
    );
  },

  // Run Events
  async listRunEvents(runId: string, limit?: number): Promise<AgentEvent[]> {
    const query = new URLSearchParams();
    if (limit) query.append("limit", limit.toString());

    const path = `/api/v1/runs/${runId}/events${query.toString() ? "?" + query.toString() : ""}`;
    return httpClient.requestWithValidation(
      "GET",
      path,
      z.array(AgentEventSchema),
    );
  },

  streamRunEvents(
    runId: string,
    onEvent: (event: AgentEvent) => void,
    onError?: (error: Error) => void,
  ): () => void {
    return httpClient.streamEvents(
      `/api/v1/runs/${runId}/event`,
      onEvent,
      onError,
    );
  },

  // Approvals
  async listApprovals(runId: string): Promise<Approval[]> {
    return httpClient.requestWithValidation(
      "GET",
      `/api/v1/runs/${runId}/approvals`,
      z.array(ApprovalSchema),
    );
  },

  async submitApproval(
    runId: string,
    approvalId: string,
    data: ApprovalSubmit,
  ): Promise<Approval> {
    return httpClient.requestWithValidation(
      "POST",
      `/api/v1/runs/${runId}/approvals/${approvalId}`,
      ApprovalSchema,
      { body: data },
    );
  },
};
