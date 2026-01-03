// src/hooks/useChatSessions.ts
import { useEffect } from "react";
import { useUIStore, ChatSession, ChatFolder } from "@/store/use-ui-store";

/**
 * Hook to initialize and manage chat sessions and folders
 * Provides mock data for development and testing
 */
export function useChatSessions() {
  const {
    sessions,
    folders,
    activeSessionId,
    setSessions,
    setFolders,
    setActiveSession,
  } = useUIStore();

  const initializeMockData = () => {
    // Create mock folders
    const mockFolders: ChatFolder[] = [
      {
        id: "folder-1",
        name: "Mobile App Refactor",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "folder-2",
        name: "API Security Audit",
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "folder-3",
        name: "Backend Migration",
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "folder-4",
        name: "Documentation",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "folder-5",
        name: "Research: LLM Tools",
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "folder-6",
        name: "DevOps Pipeline",
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Create mock sessions
    const mockSessions: ChatSession[] = [
      // Sessions in folders
      {
        id: "session-1",
        title: "Refactor authentication module",
        folder_id: "folder-1",
        created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Discussing authentication improvements...",
      },
      {
        id: "session-2",
        title: "UI component library setup",
        folder_id: "folder-1",
        created_at: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Setting up reusable components...",
      },
      {
        id: "session-3",
        title: "Navigation flow optimization",
        folder_id: "folder-1",
        created_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Improving user navigation experience...",
      },
      {
        id: "session-4",
        title: "JWT token validation",
        folder_id: "folder-2",
        created_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Reviewing JWT security implementation...",
      },
      {
        id: "session-5",
        title: "SQL injection prevention",
        folder_id: "folder-2",
        created_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Analyzing SQL injection vulnerabilities...",
      },
      {
        id: "session-6",
        title: "API rate limiting",
        folder_id: "folder-2",
        created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Implementing rate limiting strategy...",
      },
      {
        id: "session-7",
        title: "CORS configuration",
        folder_id: "folder-2",
        created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Setting up CORS policies...",
      },
      {
        id: "session-8",
        title: "OAuth2 implementation",
        folder_id: "folder-2",
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Implementing OAuth2 authentication...",
      },
      {
        id: "session-9",
        title: "Database schema migration",
        folder_id: "folder-3",
        created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Planning database migration strategy...",
      },
      {
        id: "session-10",
        title: "Microservices architecture",
        folder_id: "folder-3",
        created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Designing microservices structure...",
      },
      {
        id: "session-11",
        title: "API documentation",
        folder_id: "folder-4",
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Writing comprehensive API docs...",
      },
      {
        id: "session-12",
        title: "LLM integration research",
        folder_id: "folder-5",
        created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Researching LLM integration options...",
      },
      {
        id: "session-13",
        title: "Prompt engineering techniques",
        folder_id: "folder-5",
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Exploring prompt engineering best practices...",
      },
      {
        id: "session-14",
        title: "Model fine-tuning",
        folder_id: "folder-5",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Fine-tuning models for specific tasks...",
      },
      {
        id: "session-15",
        title: "RAG system design",
        folder_id: "folder-5",
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Designing RAG system architecture...",
      },

      // History sessions (no folder)
      {
        id: "session-h1",
        title: "Fix ClickUp #402",
        folder_id: null,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Resolving issue #402...",
      },
      {
        id: "session-h2",
        title: "Performance optimization",
        folder_id: null,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Optimizing application performance...",
      },
      {
        id: "session-h3",
        title: "Bug fix: Login flow",
        folder_id: null,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Fixing login flow issues...",
      },
      {
        id: "session-h4",
        title: "Code review: PR #156",
        folder_id: null,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Reviewing pull request #156...",
      },
      {
        id: "session-h5",
        title: "Refactor Auth Flow",
        folder_id: null,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        preview: "Refactoring authentication flow...",
      },
      {
        id: "session-h6",
        title: "Database optimization",
        folder_id: null,
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        preview: "Optimizing database queries...",
      },
      {
        id: "session-h7",
        title: "Frontend testing setup",
        folder_id: null,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        preview: "Setting up testing infrastructure...",
      },
      {
        id: "session-h8",
        title: "CI/CD pipeline review",
        folder_id: null,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        preview: "Reviewing CI/CD pipeline configuration...",
      },
    ];

    setFolders(mockFolders);
    setSessions(mockSessions);
    // Set the most recent history session as active
    setActiveSession("session-h8");
  };

  // Initialize with mock data on mount
  useEffect(() => {
    // Only initialize if empty
    if (sessions.length === 0 && folders.length === 0) {
      initializeMockData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sessions,
    folders,
    activeSessionId,
  };
}
