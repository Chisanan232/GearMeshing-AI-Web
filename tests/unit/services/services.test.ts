import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { httpClient } from "@/lib/api-client";
import {
  runService,
  chatService,
  roleService,
  usageService,
  policyService,
  agentConfigService,
} from "@/services";

// Mock the httpClient module
vi.mock("@/lib/api-client", async () => {
  const actual = await vi.importActual("@/lib/api-client");
  return {
    ...actual,
    httpClient: {
      request: vi.fn(),
      requestWithValidation: vi.fn(),
      streamEvents: vi.fn(),
    },
  };
});

describe("HTTP Client - Transport Layer with Axios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should have axios integration", () => {
    // Verify httpClient has the new methods
    expect(httpClient).toHaveProperty("request");
    expect(httpClient).toHaveProperty("requestWithValidation");
    expect(httpClient).toHaveProperty("streamEvents");
  });
});

describe("Domain Services with Zod Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Run Service", () => {
    it("should create run with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        id: "run-1",
        objective: "Test",
        role: "architect",
        status: "running",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await runService.createRun({
        objective: "Test",
        role: "architect",
      });

      expect(result.id).toBe("run-1");
      expect(result.objective).toBe("Test");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "POST",
        "/api/v1/runs/",
        expect.any(Object),
        expect.objectContaining({ body: expect.any(Object) }),
      );
    });

    it("should list runs with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([
        {
          id: "run-1",
          objective: "Test",
          role: "architect",
          status: "running",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      const result = await runService.listRuns();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].id).toBe("run-1");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        expect.stringContaining("/api/v1/runs"),
        expect.any(Object),
      );
    });

    it("should list runs with query parameters", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([]);

      await runService.listRuns({
        tenant_id: "tenant-1",
        limit: 10,
        offset: 5,
      });

      const callArgs =
        vi.mocked(httpClient).requestWithValidation.mock.calls[0];
      expect(callArgs[1]).toContain("tenant_id=tenant-1");
      expect(callArgs[1]).toContain("limit=10");
      expect(callArgs[1]).toContain("offset=5");
    });

    it("should get run with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        id: "run-1",
        objective: "Test",
        role: "architect",
        status: "running",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await runService.getRun("run-1");

      expect(result.id).toBe("run-1");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        "/api/v1/runs/run-1",
        expect.any(Object),
      );
    });

    it("should resume run with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        id: "run-1",
        objective: "Test",
        role: "architect",
        status: "running",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await runService.resumeRun("run-1", {
        approved_by: "user-1",
      });

      expect(result.id).toBe("run-1");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "POST",
        "/api/v1/runs/run-1/resume",
        expect.any(Object),
        expect.objectContaining({ body: expect.any(Object) }),
      );
    });

    it("should cancel run with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        id: "run-1",
        objective: "Test",
        role: "architect",
        status: "cancelled",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await runService.cancelRun("run-1");

      expect(result.status).toBe("cancelled");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "POST",
        "/api/v1/runs/run-1/cancel",
        expect.any(Object),
      );
    });

    it("should list run events with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([
        {
          id: "event-1",
          run_id: "run-1",
          type: "run.started",
          payload: {},
          created_at: new Date().toISOString(),
        },
      ]);

      const result = await runService.listRunEvents("run-1");

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].type).toBe("run.started");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        expect.stringContaining("/api/v1/runs/run-1/events"),
        expect.any(Object),
      );
    });

    it("should list run events with limit parameter", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([]);

      await runService.listRunEvents("run-1", 5);

      const callArgs =
        vi.mocked(httpClient).requestWithValidation.mock.calls[0];
      expect(callArgs[1]).toContain("limit=5");
    });

    it("should stream run events", () => {
      const onEvent = vi.fn();
      const onError = vi.fn();

      vi.mocked(httpClient).streamEvents.mockReturnValueOnce(() => {});

      const unsubscribe = runService.streamRunEvents("run-1", onEvent, onError);

      expect(vi.mocked(httpClient).streamEvents).toHaveBeenCalledWith(
        "/api/v1/runs/run-1/event",
        onEvent,
        onError,
      );
      expect(typeof unsubscribe).toBe("function");
    });

    it("should list approvals with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([
        {
          id: "approval-1",
          run_id: "run-1",
          risk: "medium",
          capability: "code_execution",
          reason: "Test",
          requested_at: new Date().toISOString(),
        },
      ]);

      const result = await runService.listApprovals("run-1");

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].risk).toBe("medium");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        "/api/v1/runs/run-1/approvals",
        expect.any(Object),
      );
    });

    it("should submit approval with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        id: "approval-1",
        run_id: "run-1",
        risk: "medium",
        capability: "code_execution",
        reason: "Test",
        requested_at: new Date().toISOString(),
        decision: "approved",
        decided_at: new Date().toISOString(),
      });

      const result = await runService.submitApproval("run-1", "approval-1", {
        decision: "approved",
        note: "Looks good",
      });

      expect(result.decision).toBe("approved");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "POST",
        "/api/v1/runs/run-1/approvals/approval-1",
        expect.any(Object),
        expect.objectContaining({ body: expect.any(Object) }),
      );
    });
  });

  describe("Chat Service", () => {
    it("should create chat session with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        id: 1,
        title: "Test",
        agent_role: "architect",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await chatService.createChatSession({
        title: "Test",
        agent_role: "architect",
      });

      expect(result.id).toBe(1);
      expect(result.title).toBe("Test");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "POST",
        "/api/v1/chat-sessions",
        expect.any(Object),
        expect.objectContaining({ body: expect.any(Object) }),
      );
    });

    it("should list chat sessions with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([
        {
          id: 1,
          title: "Test",
          agent_role: "architect",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      const result = await chatService.listChatSessions();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].id).toBe(1);
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        expect.stringContaining("/api/v1/chat-sessions"),
        expect.any(Object),
      );
    });

    it("should list chat sessions with query parameters", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([]);

      await chatService.listChatSessions({
        tenant_id: "tenant-1",
        active_only: true,
      });

      const callArgs =
        vi.mocked(httpClient).requestWithValidation.mock.calls[0];
      expect(callArgs[1]).toContain("tenant_id=tenant-1");
      expect(callArgs[1]).toContain("active_only=true");
    });

    it("should get chat session with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        id: 1,
        title: "Test",
        agent_role: "architect",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await chatService.getChatSession(1);

      expect(result.id).toBe(1);
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        "/api/v1/chat-sessions/1",
        expect.any(Object),
      );
    });

    it("should update chat session with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        id: 1,
        title: "Updated",
        agent_role: "engineer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await chatService.updateChatSession(1, {
        title: "Updated",
      });

      expect(result.title).toBe("Updated");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "PATCH",
        "/api/v1/chat-sessions/1",
        expect.any(Object),
        expect.objectContaining({ body: expect.any(Object) }),
      );
    });

    it("should delete chat session", async () => {
      vi.mocked(httpClient).request.mockResolvedValueOnce(undefined);

      await chatService.deleteChatSession(1);

      expect(vi.mocked(httpClient).request).toHaveBeenCalledWith(
        "DELETE",
        "/api/v1/chat-sessions/1",
      );
    });

    it("should add message with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        id: 1,
        session_id: 1,
        role: "user",
        content: "Hello",
        created_at: new Date().toISOString(),
      });

      const result = await chatService.addMessage(1, {
        role: "user",
        content: "Hello",
      });

      expect(result.content).toBe("Hello");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "POST",
        "/api/v1/chat-sessions/1/messages",
        expect.any(Object),
        expect.objectContaining({ body: expect.any(Object) }),
      );
    });

    it("should get messages with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([
        {
          id: 1,
          session_id: 1,
          role: "user",
          content: "Hello",
          created_at: new Date().toISOString(),
        },
      ]);

      const result = await chatService.getMessages(1);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].content).toBe("Hello");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        expect.stringContaining("/api/v1/chat-sessions/1/messages"),
        expect.any(Object),
      );
    });

    it("should get messages with pagination", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([]);

      await chatService.getMessages(1, { limit: 10, offset: 5 });

      const callArgs =
        vi.mocked(httpClient).requestWithValidation.mock.calls[0];
      expect(callArgs[1]).toContain("limit=10");
      expect(callArgs[1]).toContain("offset=5");
    });

    it("should get chat history with validation", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        session_id: 1,
        messages: [],
      });

      const result = await chatService.getChatHistory(1);

      expect(result.session_id).toBe(1);
      expect(Array.isArray(result.messages)).toBe(true);
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        "/api/v1/chat-sessions/1/history",
        expect.any(Object),
      );
    });

    it("should delete message", async () => {
      vi.mocked(httpClient).request.mockResolvedValueOnce(undefined);

      await chatService.deleteMessage(1, 1);

      expect(vi.mocked(httpClient).request).toHaveBeenCalledWith(
        "DELETE",
        "/api/v1/chat-sessions/1/messages/1",
      );
    });
  });

  describe("Role Service", () => {
    it("should list all available roles", async () => {
      const mockRoles = ["analyst", "engineer", "manager", "architect"];
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockRoles,
      );

      const result = await roleService.listRoles();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockRoles);
      expect(result).toContain("analyst");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        "/api/v1/roles/",
        expect.any(Object),
      );
    });

    it("should return empty array when no roles available", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([]);

      const result = await roleService.listRoles();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it("should handle role service errors", async () => {
      const error = new Error("API Error");
      vi.mocked(httpClient).requestWithValidation.mockRejectedValueOnce(error);

      await expect(roleService.listRoles()).rejects.toThrow("API Error");
    });
  });

  describe("Usage Service", () => {
    it("should get usage statistics for a tenant", async () => {
      const mockUsage = {
        tenant_id: "tenant-1",
        total_tokens: 10000,
        total_cost: 5.5,
        period: "2024-01",
      };
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockUsage,
      );

      const result = await usageService.getUsage("tenant-1");

      expect(result).toEqual(mockUsage);
      expect(result.tenant_id).toBe("tenant-1");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        expect.stringContaining("/api/v1/usage/"),
        expect.any(Object),
      );
    });

    it("should get usage with date range filters", async () => {
      const mockUsage = {
        tenant_id: "tenant-1",
        total_tokens: 5000,
        total_cost: 2.5,
      };
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockUsage,
      );

      const fromDate = new Date("2024-01-01");
      const toDate = new Date("2024-01-31");

      const result = await usageService.getUsage("tenant-1", fromDate, toDate);

      expect(result).toEqual(mockUsage);
      const callArgs =
        vi.mocked(httpClient).requestWithValidation.mock.calls[0];
      expect(callArgs[1]).toContain("tenant_id=tenant-1");
      expect(callArgs[1]).toContain("from=");
      expect(callArgs[1]).toContain("to=");
    });

    it("should get usage with only start date", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({});

      const fromDate = new Date("2024-01-01");
      await usageService.getUsage("tenant-1", fromDate);

      const callArgs =
        vi.mocked(httpClient).requestWithValidation.mock.calls[0];
      expect(callArgs[1]).toContain("from=");
      expect(callArgs[1]).not.toContain("to=");
    });

    it("should handle usage service errors", async () => {
      const error = new Error("Tenant not found");
      vi.mocked(httpClient).requestWithValidation.mockRejectedValueOnce(error);

      await expect(usageService.getUsage("invalid-tenant")).rejects.toThrow(
        "Tenant not found",
      );
    });
  });

  describe("Policy Service", () => {
    it("should get policy for a tenant", async () => {
      const mockPolicy = {
        tenant_id: "tenant-1",
        approval_required: true,
        approval_threshold: "high",
        max_concurrent_runs: 5,
      };
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockPolicy,
      );

      const result = await policyService.getPolicy("tenant-1");

      expect(result).toEqual(mockPolicy);
      expect(result.tenant_id).toBe("tenant-1");
      expect(result.approval_required).toBe(true);
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        "/api/v1/policies/tenant-1",
        expect.any(Object),
      );
    });

    it("should update policy for a tenant", async () => {
      const updateData = {
        approval_required: false,
        max_concurrent_runs: 10,
      };
      const mockUpdatedPolicy = {
        tenant_id: "tenant-1",
        ...updateData,
      };
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockUpdatedPolicy,
      );

      const result = await policyService.updatePolicy("tenant-1", updateData);

      expect(result).toEqual(mockUpdatedPolicy);
      expect(result.max_concurrent_runs).toBe(10);
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "PUT",
        "/api/v1/policies/tenant-1",
        expect.any(Object),
        expect.objectContaining({ body: updateData }),
      );
    });

    it("should handle policy not found error", async () => {
      const error = new Error("Policy not found");
      vi.mocked(httpClient).requestWithValidation.mockRejectedValueOnce(error);

      await expect(policyService.getPolicy("invalid-tenant")).rejects.toThrow(
        "Policy not found",
      );
    });

    it("should handle policy update errors", async () => {
      const error = new Error("Invalid policy configuration");
      vi.mocked(httpClient).requestWithValidation.mockRejectedValueOnce(error);

      await expect(
        policyService.updatePolicy("tenant-1", { approval_required: true }),
      ).rejects.toThrow("Invalid policy configuration");
    });
  });

  describe("Agent Config Service (New)", () => {
    it("should create agent configuration", async () => {
      const configData = {
        role: "analyst",
        tenant_id: "tenant-1",
        system_prompt: "You are an analyst",
        model: "gpt-4",
      };
      const mockCreatedConfig = {
        id: 1,
        ...configData,
        created_at: new Date().toISOString(),
        active: true,
      };
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockCreatedConfig,
      );

      const result = await agentConfigService.createAgentConfig(configData);

      expect(result).toEqual(mockCreatedConfig);
      expect(result.id).toBe(1);
      expect(result.role).toBe("analyst");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "POST",
        "/api/v1/agent-config",
        expect.any(Object),
        expect.objectContaining({ body: configData }),
      );
    });

    it("should list agent configurations", async () => {
      const mockConfigs = [
        {
          id: 1,
          role: "analyst",
          tenant_id: "tenant-1",
          active: true,
        },
        {
          id: 2,
          role: "engineer",
          tenant_id: "tenant-1",
          active: true,
        },
      ];
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockConfigs,
      );

      const result = await agentConfigService.listAgentConfigs();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].role).toBe("analyst");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        expect.stringContaining("/api/v1/agent-config"),
        expect.any(Object),
      );
    });

    it("should list agent configurations with filters", async () => {
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([]);

      await agentConfigService.listAgentConfigs({
        tenant_id: "tenant-1",
        active_only: true,
      });

      const callArgs =
        vi.mocked(httpClient).requestWithValidation.mock.calls[0];
      expect(callArgs[1]).toContain("tenant_id=tenant-1");
      expect(callArgs[1]).toContain("active_only=true");
    });

    it("should get agent configuration by role", async () => {
      const mockConfig = {
        id: 1,
        role: "analyst",
        tenant_id: "tenant-1",
        system_prompt: "You are an analyst",
        active: true,
      };
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockConfig,
      );

      const result = await agentConfigService.getAgentConfigByRole("analyst");

      expect(result).toEqual(mockConfig);
      expect(result.role).toBe("analyst");
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        expect.stringContaining("/api/v1/agent-config/role/analyst"),
        expect.any(Object),
      );
    });

    it("should get agent configuration by role with tenant override", async () => {
      const mockConfig = {
        id: 2,
        role: "analyst",
        tenant_id: "tenant-2",
        system_prompt: "Custom analyst prompt",
        active: true,
      };
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockConfig,
      );

      const result = await agentConfigService.getAgentConfigByRole(
        "analyst",
        "tenant-2",
      );

      expect(result).toEqual(mockConfig);
      expect(result.tenant_id).toBe("tenant-2");
      const callArgs =
        vi.mocked(httpClient).requestWithValidation.mock.calls[0];
      expect(callArgs[1]).toContain("tenant_id=tenant-2");
    });

    it("should get agent configuration by ID", async () => {
      const mockConfig = {
        id: 1,
        role: "analyst",
        tenant_id: "tenant-1",
        system_prompt: "You are an analyst",
        active: true,
      };
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce(
        mockConfig,
      );

      const result = await agentConfigService.getAgentConfig(1);

      expect(result).toEqual(mockConfig);
      expect(result.id).toBe(1);
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledWith(
        "GET",
        "/api/v1/agent-config/1",
        expect.any(Object),
      );
    });

    it("should handle agent config creation errors", async () => {
      const error = new Error("Invalid configuration");
      vi.mocked(httpClient).requestWithValidation.mockRejectedValueOnce(error);

      await expect(
        agentConfigService.createAgentConfig({
          role: "invalid",
        }),
      ).rejects.toThrow("Invalid configuration");
    });

    it("should handle agent config not found error", async () => {
      const error = new Error("Configuration not found");
      vi.mocked(httpClient).requestWithValidation.mockRejectedValueOnce(error);

      await expect(agentConfigService.getAgentConfig(999)).rejects.toThrow(
        "Configuration not found",
      );
    });

    it("should handle role not found error", async () => {
      const error = new Error("No active configuration found for the role");
      vi.mocked(httpClient).requestWithValidation.mockRejectedValueOnce(error);

      await expect(
        agentConfigService.getAgentConfigByRole("nonexistent"),
      ).rejects.toThrow("No active configuration found for the role");
    });
  });

  describe("Service Integration Tests", () => {
    it("should handle multiple service calls in sequence", async () => {
      // Mock role service
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce([
        "analyst",
      ]);
      const roles = await roleService.listRoles();

      // Mock policy service
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        approval_required: true,
      });
      const policy = await policyService.getPolicy("tenant-1");

      // Mock usage service
      vi.mocked(httpClient).requestWithValidation.mockResolvedValueOnce({
        total_tokens: 1000,
      });
      const usage = await usageService.getUsage("tenant-1");

      expect(roles).toContain("analyst");
      expect(policy.approval_required).toBe(true);
      expect(usage.total_tokens).toBe(1000);
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledTimes(
        3,
      );
    });

    it("should handle concurrent service calls", async () => {
      vi.mocked(httpClient)
        .requestWithValidation.mockResolvedValueOnce(["analyst"])
        .mockResolvedValueOnce({ approval_required: true })
        .mockResolvedValueOnce({ total_tokens: 1000 })
        .mockResolvedValueOnce([{ id: 1, role: "analyst", active: true }]);

      const [roles, policy, usage, configs] = await Promise.all([
        roleService.listRoles(),
        policyService.getPolicy("tenant-1"),
        usageService.getUsage("tenant-1"),
        agentConfigService.listAgentConfigs(),
      ]);

      expect(roles).toContain("analyst");
      expect(policy.approval_required).toBe(true);
      expect(usage.total_tokens).toBe(1000);
      expect(configs).toHaveLength(1);
      expect(vi.mocked(httpClient).requestWithValidation).toHaveBeenCalledTimes(
        4,
      );
    });
  });
});
