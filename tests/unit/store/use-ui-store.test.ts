import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@/store/use-ui-store";
import { AgentRun, AgentEvent, Approval } from "@/services";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      isSidebarOpen: true,
      activeArtifact: null,
      artifactData: null,
      currentRun: null,
      events: [],
      pendingApprovals: [],
      sseUnsubscribe: null,
    });
  });

  describe("Sidebar State", () => {
    it("should initialize with sidebar open", () => {
      const state = useUIStore.getState();
      expect(state.isSidebarOpen).toBe(true);
    });

    it("should toggle sidebar", () => {
      const { toggleSidebar } = useUIStore.getState();
      toggleSidebar();

      let state = useUIStore.getState();
      expect(state.isSidebarOpen).toBe(false);

      toggleSidebar();
      state = useUIStore.getState();
      expect(state.isSidebarOpen).toBe(true);
    });
  });

  describe("Artifact Panel State", () => {
    it("should initialize with no active artifact", () => {
      const state = useUIStore.getState();
      expect(state.activeArtifact).toBeNull();
      expect(state.artifactData).toBeNull();
    });

    it("should open artifact", () => {
      const { openArtifact } = useUIStore.getState();
      const data = { type: "mermaid", content: "graph TD; A-->B" };

      openArtifact("diagram", data);

      const state = useUIStore.getState();
      expect(state.activeArtifact).toBe("diagram");
      expect(state.artifactData).toEqual(data);
    });

    it("should close artifact", () => {
      const { openArtifact, closeArtifact } = useUIStore.getState();
      openArtifact("diagram", { content: "test" });

      closeArtifact();

      const state = useUIStore.getState();
      expect(state.activeArtifact).toBeNull();
      expect(state.artifactData).toBeNull();
    });

    it("should replace artifact when opening new one", () => {
      const { openArtifact } = useUIStore.getState();

      openArtifact("diagram", { content: "test1" });
      let state = useUIStore.getState();
      expect(state.activeArtifact).toBe("diagram");

      openArtifact("code_diff", { content: "test2" });
      state = useUIStore.getState();
      expect(state.activeArtifact).toBe("code_diff");
      expect(state.artifactData).toEqual({ content: "test2" });
    });
  });

  describe("Run Management", () => {
    it("should set current run", () => {
      const { setCurrentRun } = useUIStore.getState();
      const mockRun: AgentRun = {
        id: "run-123",
        role: "architect",
        objective: "Test objective",
        status: "running",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setCurrentRun(mockRun);

      const state = useUIStore.getState();
      expect(state.currentRun).toEqual(mockRun);
      expect(state.currentRun?.id).toBe("run-123");
    });

    it("should clear current run", () => {
      const { setCurrentRun } = useUIStore.getState();
      const mockRun: AgentRun = {
        id: "run-123",
        role: "architect",
        objective: "Test",
        status: "running",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setCurrentRun(mockRun);
      setCurrentRun(null);

      const state = useUIStore.getState();
      expect(state.currentRun).toBeNull();
    });
  });

  describe("Event Management", () => {
    it("should add event", () => {
      const { addEvent } = useUIStore.getState();
      const mockEvent: AgentEvent = {
        id: "event-1",
        run_id: "run-123",
        type: "run.started",
        created_at: new Date().toISOString(),
        payload: {},
      };

      addEvent(mockEvent);

      const state = useUIStore.getState();
      expect(state.events).toHaveLength(1);
      expect(state.events[0]).toEqual(mockEvent);
    });

    it("should add multiple events in order", () => {
      const { addEvent } = useUIStore.getState();
      const event1: AgentEvent = {
        run_id: "run-123",
        type: "run.started",
        payload: {},
      };
      const event2: AgentEvent = {
        run_id: "run-123",
        type: "artifact.created",
        payload: {},
      };

      addEvent(event1);
      addEvent(event2);

      const state = useUIStore.getState();
      expect(state.events).toHaveLength(2);
      expect(state.events[0].type).toBe("run.started");
      expect(state.events[1].type).toBe("artifact.created");
    });

    it("should clear events", () => {
      const { addEvent, clearEvents } = useUIStore.getState();
      const mockEvent: AgentEvent = {
        run_id: "run-123",
        type: "run.started",
        payload: {},
      };

      addEvent(mockEvent);
      let state = useUIStore.getState();
      expect(state.events).toHaveLength(1);

      clearEvents();
      state = useUIStore.getState();
      expect(state.events).toHaveLength(0);
    });
  });

  describe("Approval Management", () => {
    it("should add approval", () => {
      const { addApproval } = useUIStore.getState();
      const mockApproval: Approval = {
        id: "approval-1",
        run_id: "run-123",
        risk: "medium",
        capability: "code_execution" as const,
        reason: "Test approval",
        requested_at: new Date().toISOString(),
      };

      addApproval(mockApproval);

      const state = useUIStore.getState();
      expect(state.pendingApprovals).toHaveLength(1);
      expect(state.pendingApprovals[0]).toEqual(mockApproval);
    });

    it("should set pending approvals", () => {
      const { setPendingApprovals } = useUIStore.getState();
      const approvals: Approval[] = [
        {
          id: "approval-1",
          run_id: "run-123",
          risk: "medium",
          capability: "code_execution" as const,
          reason: "Test",
          requested_at: new Date().toISOString(),
        },
        {
          id: "approval-2",
          run_id: "run-123",
          risk: "high",
          capability: "shell_exec" as const,
          reason: "Test 2",
          requested_at: new Date().toISOString(),
        },
      ];

      setPendingApprovals(approvals);

      const state = useUIStore.getState();
      expect(state.pendingApprovals).toHaveLength(2);
      expect(state.pendingApprovals).toEqual(approvals);
    });

    it("should remove approval by id", () => {
      const { addApproval, removeApproval } = useUIStore.getState();
      const approval1: Approval = {
        id: "approval-1",
        run_id: "run-123",
        risk: "medium",
        capability: "code_execution" as const,
        reason: "Test",
        requested_at: new Date().toISOString(),
      };
      const approval2: Approval = {
        id: "approval-2",
        run_id: "run-123",
        risk: "high",
        capability: "shell_exec" as const,
        reason: "Test 2",
        requested_at: new Date().toISOString(),
      };

      addApproval(approval1);
      addApproval(approval2);

      let state = useUIStore.getState();
      expect(state.pendingApprovals).toHaveLength(2);

      removeApproval("approval-1");

      state = useUIStore.getState();
      expect(state.pendingApprovals).toHaveLength(1);
      expect(state.pendingApprovals[0].id).toBe("approval-2");
    });
  });

  describe("SSE Connection Management", () => {
    it("should set SSE unsubscribe function", () => {
      const { setSseUnsubscribe } = useUIStore.getState();
      const mockUnsubscribe = () => {
        /* cleanup */
      };

      setSseUnsubscribe(mockUnsubscribe);

      const state = useUIStore.getState();
      expect(state.sseUnsubscribe).toBe(mockUnsubscribe);
    });

    it("should clear SSE unsubscribe function", () => {
      const { setSseUnsubscribe } = useUIStore.getState();
      const mockUnsubscribe = () => {
        /* cleanup */
      };

      setSseUnsubscribe(mockUnsubscribe);
      setSseUnsubscribe(null);

      const state = useUIStore.getState();
      expect(state.sseUnsubscribe).toBeNull();
    });
  });

  describe("State Isolation", () => {
    it("should not affect other state when updating one property", () => {
      const { setCurrentRun, addEvent } = useUIStore.getState();
      const mockRun: AgentRun = {
        id: "run-123",
        role: "architect",
        objective: "Test",
        status: "running",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const mockEvent: AgentEvent = {
        run_id: "run-123",
        type: "run.started" as const,
        payload: {},
      };

      setCurrentRun(mockRun);
      addEvent(mockEvent);

      const state = useUIStore.getState();
      expect(state.currentRun).toEqual(mockRun);
      expect(state.events).toHaveLength(1);
      expect(state.pendingApprovals).toHaveLength(0);
    });
  });
});
