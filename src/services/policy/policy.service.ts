// src/services/policy/policy.service.ts
// Domain service for policy management

import { httpClient } from "@/lib/api-client";
import {
  PolicyResponseSchema,
  PolicyUpdateSchema,
  PolicyResponse,
  PolicyUpdate,
} from "./schemas";

export const policyService = {
  /**
   * Get the policy configuration for a tenant
   * @param tenantId - The tenant ID
   */
  async getPolicy(tenantId: string): Promise<PolicyResponse> {
    return httpClient.requestWithValidation(
      "GET",
      `/api/v1/policies/${tenantId}`,
      PolicyResponseSchema,
    );
  },

  /**
   * Update or create the policy configuration for a tenant
   * @param tenantId - The tenant ID
   * @param data - The policy update data
   */
  async updatePolicy(
    tenantId: string,
    data: PolicyUpdate,
  ): Promise<PolicyResponse> {
    return httpClient.requestWithValidation(
      "PUT",
      `/api/v1/policies/${tenantId}`,
      PolicyResponseSchema,
      { body: data },
    );
  },
};
