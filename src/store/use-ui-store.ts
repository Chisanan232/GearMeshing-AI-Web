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

export interface ChatSession {
  id: string;
  title: string;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
  preview?: string;
}

export interface ChatFolder {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
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

  // Chat Sessions & Folders
  sessions: ChatSession[];
  folders: ChatFolder[];
  activeSessionId: string | null;
  setSessions: (sessions: ChatSession[]) => void;
  setFolders: (folders: ChatFolder[]) => void;
  setActiveSession: (sessionId: string | null) => void;
  createSession: (title: string, folderId?: string | null) => ChatSession;
  updateSession: (id: string, updates: Partial<ChatSession>) => void;
  deleteSession: (id: string) => void;
  moveSessionToFolder: (sessionId: string, folderId: string | null) => void;
  createFolder: (name: string) => ChatFolder;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  
  // Clear all user data on logout
  clearAllData: () => void;
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

  // Chat Sessions & Folders
  sessions: [],
  folders: [],
  activeSessionId: null,
  setSessions: (sessions) => set({ sessions }),
  setFolders: (folders) => set({ folders }),
  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
  createSession: (title, folderId = null) => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title,
      folder_id: folderId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((state) => ({
      sessions: [...state.sessions, newSession],
      activeSessionId: newSession.id,
    }));
    return newSession;
  },
  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id
          ? {
              ...s,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : s,
      ),
    })),
  deleteSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId:
        state.activeSessionId === id ? null : state.activeSessionId,
    })),
  moveSessionToFolder: (sessionId, folderId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, folder_id: folderId } : s,
      ),
    })),
  createFolder: (name) => {
    const newFolder: ChatFolder = {
      id: `folder-${Date.now()}`,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((state) => ({
      folders: [...state.folders, newFolder],
    }));
    return newFolder;
  },
  updateFolder: (id, name) =>
    set((state) => ({
      folders: state.folders.map((f) =>
        f.id === id
          ? {
              ...f,
              name,
              updated_at: new Date().toISOString(),
            }
          : f,
      ),
    })),
  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      sessions: state.sessions.map((s) =>
        s.folder_id === id ? { ...s, folder_id: null } : s,
      ),
    })),
    
  // Clear all user data on logout
  clearAllData: () =>
    set({
      // Clear chat data
      sessions: [],
      folders: [],
      activeSessionId: null,
      
      // Clear run data
      currentRun: null,
      events: [],
      pendingApprovals: [],
      
      // Clear thinking state
      isThinking: false,
      thoughtLogs: [],
      
      // Clear artifacts
      activeArtifact: null,
      artifactData: null,
      
      // Close SSE connection
      sseUnsubscribe: null,
    }),
}));
