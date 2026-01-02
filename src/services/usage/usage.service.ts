// src/services/usage/usage.service.ts
// Domain service for usage statistics

import { httpClient } from "@/lib/api-client";
import { UsageStatsSchema, UsageStats } from "./schemas";

export const usageService = {
  /**
   * Get usage statistics for a tenant
   * @param tenantId - The tenant ID
   * @param from - Optional start date for filtering usage
   * @param to - Optional end date for filtering usage
   */
  async getUsage(
    tenantId: string,
    from?: Date,
    to?: Date,
  ): Promise<UsageStats> {
    const query = new URLSearchParams();
    query.append("tenant_id", tenantId);
    if (from) query.append("from", from.toISOString());
    if (to) query.append("to", to.toISOString());

    const path = `/api/v1/usage/?${query.toString()}`;
    return httpClient.requestWithValidation(
      "GET",
      path,
      UsageStatsSchema,
    );
  },
};
