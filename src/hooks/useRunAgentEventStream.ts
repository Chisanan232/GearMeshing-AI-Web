// src/hooks/useRunAgentEventStream.ts
// Hook for simulating SSE event stream from running agent
// Provides dynamic chat messages, artifacts, and approvals as they would come from the backend

import { useMemo } from "react";
import type { Approval } from "@/services";

export interface AgentMessage {
  id: string;
  role: "user" | "assistant";
  agentName?: string;
  content: string;
  timestamp: string;
}

export interface ArtifactMessage {
  id: string;
  type: "diagram" | "code_diff" | "markdown" | "github_pr";
  title?: string;
  content: string;
  metadata?: {
    original?: string;
    modified?: string;
    language?: string;
    filePath?: string;
    pr_number?: number;
    repo_name?: string;
    pr_title?: string;
    description?: string;
    github_url?: string;
  };
}

export interface ThinkingMessage {
  id: string;
  content: string; // Streaming thinking text
  isStreaming: boolean; // Whether still receiving text
  timestamp: string;
}

export interface ChatStreamEvent {
  id: string;
  type: "message" | "artifact" | "approval" | "thinking";
  message?: AgentMessage;
  artifact?: ArtifactMessage;
  approval?: Approval;
  thinking?: ThinkingMessage;
  timestamp: string;
}

export interface RunAgentEventStream {
  events: ChatStreamEvent[];
  messages: AgentMessage[];
  artifacts: ArtifactMessage[];
  approvals: Approval[];
}

/**
 * Provides simulated SSE event stream from running agent
 * Returns dynamic chat messages, artifacts, and approvals
 * In production, this would subscribe to real SSE events from backend
 * @returns {RunAgentEventStream} Stream of events from agent execution
 */
export function useRunAgentEventStream(): RunAgentEventStream {
  return useMemo(() => {
    // Use constant base time to avoid impure function calls
    const baseTime = new Date("2024-01-02T16:00:00Z").getTime();
    const now = baseTime;

    // Simulated event stream from backend SSE
    const events: ChatStreamEvent[] = [
      // User message
      {
        id: "msg-1",
        type: "message",
        message: {
          id: "msg-1",
          role: "user",
          content: "我們需要重新設計 user table 的 schema。",
          timestamp: new Date(now - 300000).toISOString(),
        },
        timestamp: new Date(now - 300000).toISOString(),
      },

      // Architect Agent response
      {
        id: "msg-2",
        type: "message",
        message: {
          id: "msg-2",
          role: "assistant",
          agentName: "Architect Agent",
          content:
            "沒問題。我已經根據當前的業務需求草擬了一份新的 Schema 設計。\n請查看右側的 ER Diagram。",
          timestamp: new Date(now - 280000).toISOString(),
        },
        timestamp: new Date(now - 280000).toISOString(),
      },

      // Architect Agent artifact - ER Diagram
      {
        id: "artifact-1",
        type: "artifact",
        artifact: {
          id: "artifact-1",
          type: "diagram",
          title: "User Schema ER Diagram",
          content: `
erDiagram
    USER ||--o{ POST : writes
    USER {
        string username
        string email
    }
    POST ||--|{ COMMENT : contains
    POST {
        string title
        string content
        boolean published
    }
    COMMENT {
        string body
        date created_at
    }
`,
          metadata: {
            filePath: "schema/user-schema.mermaid",
          },
        },
        timestamp: new Date(now - 270000).toISOString(),
      },

      // Developer Agent response
      {
        id: "msg-3",
        type: "message",
        message: {
          id: "msg-3",
          role: "assistant",
          agentName: "Developer Agent",
          content:
            "我已經為 `getUser` 函數添加了 Redis 快取層，並優化了錯誤日誌。\n請檢視代碼差異。",
          timestamp: new Date(now - 250000).toISOString(),
        },
        timestamp: new Date(now - 250000).toISOString(),
      },

      // Developer Agent artifact - Code Diff
      {
        id: "artifact-2",
        type: "artifact",
        artifact: {
          id: "artifact-2",
          type: "code_diff",
          title: "User Service Optimization",
          content: "Code diff content",
          metadata: {
            original: `
export async function getUser(id: string) {
  const user = await db.user.findUnique({
    where: { id }
  });
  
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
`,
            modified: `
import { redis } from '@/lib/redis';
import { logger } from '@/lib/logger';

export async function getUser(id: string) {
  // Try to get from cache first
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({
    where: { id }
  });
  
  if (!user) {
    logger.warn(\`User \${id} not found\`);
    throw new Error("User not found");
  }

  // Set cache for 1 hour
  await redis.setex(\`user:\${id}\`, 3600, JSON.stringify(user));
  
  return user;
}
`,
            language: "typescript",
            filePath: "src/services/user-service.ts",
          },
        },
        timestamp: new Date(now - 240000).toISOString(),
      },

      // Product Manager Agent response
      {
        id: "msg-4",
        type: "message",
        message: {
          id: "msg-4",
          role: "assistant",
          agentName: "Product Manager Agent",
          content:
            "根據剛剛的討論，我整理了一份身份驗證重構的技術規格書。\n其中包含了資料庫變更與實作步驟，請確認。",
          timestamp: new Date(now - 220000).toISOString(),
        },
        timestamp: new Date(now - 220000).toISOString(),
      },

      // Product Manager Agent artifact - Tech Spec
      {
        id: "artifact-3",
        type: "artifact",
        artifact: {
          id: "artifact-3",
          type: "markdown",
          title: "Auth Refactor Spec v1.0",
          content: `
# Authentication System Refactor Plan

## 1. Overview
We need to migrate from basic JWT to **OAuth2 with OIDC** support to enhance security and support third-party logins (GitHub, Google).

## 2. Proposed Architecture

### Core Components
- **Auth Service**: Handles token issuance.
- **User Service**: Manages user profiles.
- **Gateway**: Validates tokens.

### Database Schema Changes
| Table | Column | Type | Description |
|-------|--------|------|-------------|
| users | provider | varchar | e.g., 'github', 'google' |
| users | provider_id | varchar | External user ID |

## 3. Implementation Steps
1. [x] Setup Auth0 or NextAuth integration.
2. [ ] Update User Schema via Prisma.
3. [ ] Implement callback handlers.

## 4. Code Example
Here is how the new callback handler should look:

\`\`\`typescript
// src/app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const code = request.url.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
  // ... exchange code for token
  return NextResponse.redirect('/dashboard');
}
\`\`\`
`,
          metadata: {
            filePath: "docs/AUTH_REFACTOR_SPEC.md",
          },
        },
        timestamp: new Date(now - 210000).toISOString(),
      },

      // Developer Agent MCP approval request
      {
        id: "msg-5",
        type: "message",
        message: {
          id: "msg-5",
          role: "assistant",
          agentName: "Developer Agent",
          content:
            "I need to analyze your project structure on Google Drive. Let me list the files to understand the current architecture.",
          timestamp: new Date(now - 190000).toISOString(),
        },
        timestamp: new Date(now - 190000).toISOString(),
      },

      // MCP Approval
      {
        id: "approval-mcp-1",
        type: "approval",
        approval: {
          id: "approval-mcp-1",
          run_id: "run-12345",
          risk: "medium",
          capability: "mcp_call",
          reason: "List files from Google Drive to analyze project structure",
          requested_at: new Date(now - 185000).toISOString(),
          expires_at: new Date(now + 3600000).toISOString(),
          type: "mcp_tool",
          source: "google-drive",
          action: "list_files",
          params: {
            folder_id: "root",
            max_results: 50,
          },
          metadata: {
            can_edit: true,
          },
        },
        timestamp: new Date(now - 185000).toISOString(),
      },

      // Developer Agent command approval request
      {
        id: "msg-6",
        type: "message",
        message: {
          id: "msg-6",
          role: "assistant",
          agentName: "Developer Agent",
          content:
            "Now I'll execute the database migration to add OAuth2 provider columns. This requires your approval.",
          timestamp: new Date(now - 170000).toISOString(),
        },
        timestamp: new Date(now - 170000).toISOString(),
      },

      // Command Approval - High Risk
      {
        id: "approval-cmd-1",
        type: "approval",
        approval: {
          id: "approval-cmd-1",
          run_id: "run-12345",
          risk: "high",
          capability: "code_execution",
          reason:
            "Execute database migration script to add OAuth2 provider columns",
          requested_at: new Date(now - 165000).toISOString(),
          expires_at: new Date(now + 3600000).toISOString(),
          type: "command_line",
          source: "terminal",
          action: "npx prisma migrate deploy --name add_oauth2_columns",
          metadata: {
            can_edit: true,
          },
        },
        timestamp: new Date(now - 165000).toISOString(),
      },

      // NPM Install Approval - Low Risk
      {
        id: "approval-npm-1",
        type: "approval",
        approval: {
          id: "approval-npm-1",
          run_id: "run-12345",
          risk: "low",
          capability: "shell_exec",
          reason: "Install required dependencies for authentication module",
          requested_at: new Date(now - 150000).toISOString(),
          expires_at: new Date(now + 3600000).toISOString(),
          type: "command_line",
          source: "terminal",
          action: "npm install next-auth @auth/core",
          metadata: {
            can_edit: true,
          },
        },
        timestamp: new Date(now - 150000).toISOString(),
      },

      // Deployment Approval - Medium Risk
      {
        id: "approval-deploy-1",
        type: "approval",
        approval: {
          id: "approval-deploy-1",
          run_id: "run-12345",
          risk: "medium",
          capability: "code_execution",
          reason: "Deploy new authentication service to production",
          requested_at: new Date(now - 130000).toISOString(),
          expires_at: new Date(now + 3600000).toISOString(),
          type: "command_line",
          source: "deployment",
          action: "kubectl apply -f auth-service-deployment.yaml",
          metadata: {
            can_edit: true,
          },
        },
        timestamp: new Date(now - 130000).toISOString(),
      },

      // Web Search Approval
      {
        id: "approval-search-1",
        type: "approval",
        approval: {
          id: "approval-search-1",
          run_id: "run-12345",
          risk: "low",
          capability: "web_search",
          reason: "Search for OAuth2 best practices and security guidelines",
          requested_at: new Date(now - 110000).toISOString(),
          expires_at: new Date(now + 3600000).toISOString(),
          type: "mcp_tool",
          source: "web-search",
          action: "search OAuth2 OIDC best practices 2024",
          metadata: {
            can_edit: true,
          },
        },
        timestamp: new Date(now - 110000).toISOString(),
      },

      // File Operation Approval
      {
        id: "approval-file-1",
        type: "approval",
        approval: {
          id: "approval-file-1",
          run_id: "run-12345",
          risk: "medium",
          capability: "docs_read",
          reason:
            "Read and analyze existing authentication configuration files",
          requested_at: new Date(now - 90000).toISOString(),
          expires_at: new Date(now + 3600000).toISOString(),
          type: "mcp_tool",
          source: "filesystem",
          action: "read_files src/config/auth.config.ts",
          metadata: {
            can_edit: true,
          },
        },
        timestamp: new Date(now - 90000).toISOString(),
      },

      // GitHub PR Alert - Rendered as special artifact
      {
        id: "github-pr-1",
        type: "artifact",
        artifact: {
          id: "github-pr-1",
          type: "github_pr" as const,
          title: "Security Improvements Ready for Review",
          content: "OAuth2 authentication system refactored with enhanced security measures",
          metadata: {
            pr_number: 42,
            repo_name: "GearMeshing-AI",
            pr_title: "feat: Implement OAuth2 with OIDC support",
            description:
              "This pull request implements OAuth2 with OIDC support for enhanced security and third-party login integration (GitHub, Google). Includes database schema updates, auth service refactoring, and comprehensive test coverage.",
            github_url: "https://github.com/Chisanan232/GearMeshing-AI/pull/42",
          },
        },
        timestamp: new Date(now - 60000).toISOString(),
      },

      // Thinking event - Agent is analyzing and processing with streaming text
      {
        id: "thinking-1",
        type: "thinking",
        thinking: {
          id: "thinking-1",
          content: `Analyzing the user's request about redesigning the user table schema...

Let me break down the requirements:
1. Current schema needs optimization
2. Need to support OAuth2 authentication
3. Must maintain backward compatibility
4. Performance is critical

I'll examine the existing database structure and identify:
- Redundant columns that can be removed
- Missing indexes that could improve query performance
- Potential normalization opportunities
- Security considerations for authentication

The OAuth2 integration will require:
- Adding provider columns (google_id, github_id, etc.)
- New tables for OAuth tokens and sessions
- Refresh token management
- Scope and permission tracking

I should also consider:
- Migration strategy for existing users
- Data validation and constraints
- Audit logging for security changes
- Testing coverage for new functionality

Let me prepare a comprehensive migration plan with database diagrams and implementation steps...`,
          isStreaming: false,
          timestamp: new Date(now - 30000).toISOString(),
        },
        timestamp: new Date(now - 30000).toISOString(),
      },
    ];

    // Extract messages, artifacts, and approvals from events
    const messages = events
      .filter((e) => e.type === "message" && e.message)
      .map((e) => e.message!);

    const artifacts = events
      .filter((e) => e.type === "artifact" && e.artifact)
      .map((e) => e.artifact!);

    const approvals = events
      .filter((e) => e.type === "approval" && e.approval)
      .map((e) => e.approval!);

    return {
      events,
      messages,
      artifacts,
      approvals,
    };
  }, []);
}
