// src/services/role/role.service.ts
// Domain service for role management

import { httpClient } from "@/lib/api-client";
import { z } from "zod";
import { RoleSchema, Role } from "./schemas";

export const roleService = {
  /**
   * List all available agent roles
   */
  async listRoles(): Promise<Role[]> {
    return httpClient.requestWithValidation(
      "GET",
      "/api/v1/roles/",
      z.array(RoleSchema),
    );
  },
};
