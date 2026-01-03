// src/store/use-ui-store.ts
import { create } from "zustand";
import { AgentRun, AgentEvent, Approval } from "@/services";

type ArtifactType =
  | "spec"
  | "diagram"
  | "code_diff"
  | "task_board"
  | "markdown"
  | null;

interface ArtifactData {
  [key: string]: unknown;
}

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  // 右側 Artifact Panel 狀態
  activeArtifact: ArtifactType;
  artifactData: ArtifactData | null;
  openArtifact: (type: ArtifactType, data?: ArtifactData) => void;
  closeArtifact: () => void;

  // Run Management
  currentRun: AgentRun | null;
  setCurrentRun: (run: AgentRun | null) => void;

  // Events
  events: AgentEvent[];
  addEvent: (event: AgentEvent) => void;
  clearEvents: () => void;

  // Approvals
  pendingApprovals: Approval[];
  setPendingApprovals: (approvals: Approval[]) => void;
  addApproval: (approval: Approval) => void;
  removeApproval: (approvalId: string) => void;
  updateApprovalStatus: (
    approvalId: string,
    decision: "approved" | "rejected",
  ) => void;

  // Agent Thinking State
  isThinking: boolean;
  thoughtLogs: string[];
  setThinking: (isThinking: boolean) => void;
  addThoughtLog: (log: string) => void;
  clearThoughtLogs: () => void;

  // SSE Connection
  sseUnsubscribe: (() => void) | null;
  setSseUnsubscribe: (fn: (() => void) | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  activeArtifact: null,
  artifactData: null,

  openArtifact: (type, data) =>
    set({ activeArtifact: type, artifactData: data }),
  closeArtifact: () => set({ activeArtifact: null, artifactData: null }),

  // Run Management
  currentRun: null,
  setCurrentRun: (run) => set({ currentRun: run }),

  // Events
  events: [],
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),
  clearEvents: () => set({ events: [] }),

  // Approvals
  pendingApprovals: [],
  setPendingApprovals: (approvals) => set({ pendingApprovals: approvals }),
  addApproval: (approval) =>
    set((state) => ({
      pendingApprovals: [...state.pendingApprovals, approval],
    })),
  removeApproval: (approvalId) =>
    set((state) => ({
      pendingApprovals: state.pendingApprovals.filter(
        (a) => a.id !== approvalId,
      ),
    })),
  updateApprovalStatus: (approvalId, decision) =>
    set((state) => ({
      pendingApprovals: state.pendingApprovals.map((a) =>
        a.id === approvalId
          ? {
              ...a,
              decision,
              decided_at: new Date().toISOString(),
            }
          : a,
      ),
    })),

  // Agent Thinking State
  isThinking: false,
  thoughtLogs: [],
  setThinking: (isThinking) => set({ isThinking }),
  addThoughtLog: (log) =>
    set((state) => ({
      thoughtLogs: [...state.thoughtLogs, log],
    })),
  clearThoughtLogs: () => set({ thoughtLogs: [] }),

  // SSE Connection
  sseUnsubscribe: null,
  setSseUnsubscribe: (fn) => set({ sseUnsubscribe: fn }),
}));
