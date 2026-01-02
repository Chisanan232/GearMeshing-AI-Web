// src/services/agent-config/agent-config.service.ts
// Domain service for agent configuration management

import { httpClient } from "@/lib/api-client";
import { z } from "zod";
import {
  AgentConfigDetailSchema,
  AgentConfigCreate,
  AgentConfigDetail,
} from "./schemas";

export const agentConfigService = {
  /**
   * Create a new agent configuration
   * @param data - The agent configuration data
   */
  async createAgentConfig(data: AgentConfigCreate): Promise<AgentConfigDetail> {
    return httpClient.requestWithValidation(
      "POST",
      "/api/v1/agent-config",
      AgentConfigDetailSchema,
      { body: data },
    );
  },

  /**
   * List agent configurations
   * @param params - Optional filter parameters
   */
  async listAgentConfigs(params?: {
    tenant_id?: string;
    active_only?: boolean;
  }): Promise<AgentConfigDetail[]> {
    const query = new URLSearchParams();
    if (params?.tenant_id) query.append("tenant_id", params.tenant_id);
    if (params?.active_only !== undefined)
      query.append("active_only", params.active_only.toString());

    const path = `/api/v1/agent-config${query.toString() ? "?" + query.toString() : ""}`;
    return httpClient.requestWithValidation(
      "GET",
      path,
      z.array(AgentConfigDetailSchema),
    );
  },

  /**
   * Get agent configuration by role
   * @param roleName - The role name
   * @param tenantId - Optional tenant ID for tenant-specific override
   */
  async getAgentConfigByRole(
    roleName: string,
    tenantId?: string,
  ): Promise<AgentConfigDetail> {
    const query = new URLSearchParams();
    if (tenantId) query.append("tenant_id", tenantId);

    const path = `/api/v1/agent-config/role/${roleName}${query.toString() ? "?" + query.toString() : ""}`;
    return httpClient.requestWithValidation(
      "GET",
      path,
      AgentConfigDetailSchema,
    );
  },

  /**
   * Get agent configuration by ID
   * @param configId - The configuration ID
   */
  async getAgentConfig(configId: number): Promise<AgentConfigDetail> {
    return httpClient.requestWithValidation(
      "GET",
      `/api/v1/agent-config/${configId}`,
      AgentConfigDetailSchema,
    );
  },
};
