// src/store/use-ui-store.ts
import { create } from "zustand";

type ArtifactType = "spec" | "diagram" | "code_diff" | "task_board" | null;

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
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  activeArtifact: null, // 預設關閉
  artifactData: null,

  openArtifact: (type, data) =>
    set({ activeArtifact: type, artifactData: data }),
  closeArtifact: () => set({ activeArtifact: null, artifactData: null }),
}));
