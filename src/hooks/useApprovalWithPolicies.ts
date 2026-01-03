// src/hooks/useApprovalWithPolicies.ts
// Hook for providing demo/test scenarios for approval workflows
// Includes various approval types, risk levels, and capabilities for testing

import type { Approval } from "@/services/run/schemas";

export interface ApprovalDemoScenarios {
  sampleApproval: Approval;
  sampleMCPApproval: Approval;
  sampleCommandApproval: Approval;
  sampleNpmApproval: Approval;
  sampleApiApproval: Approval;
  sampleSearchApproval: Approval;
  sampleFileApproval: Approval;
}

/**
 * Provides demo scenarios for approval workflow testing and visualization
 * Includes: high/medium/low risk approvals, MCP tools, command line operations
 * @returns {ApprovalDemoScenarios} Collection of approval demo scenarios
 */
export function useApprovalWithPolicies(): ApprovalDemoScenarios {
  const sampleApproval: Approval = {
    id: "approval-001",
    run_id: "run-12345",
    risk: "high",
    capability: "code_execution",
    reason: "Execute database migration script to add OAuth2 provider columns",
    requested_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    type: "command_line",
    source: "terminal",
    action: "npx prisma migrate deploy --name add_oauth2_columns",
  };

  const sampleMCPApproval: Approval = {
    id: "approval-mcp-001",
    run_id: "run-12345",
    risk: "medium",
    capability: "mcp_call",
    reason: "List files from Google Drive to analyze project structure",
    requested_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000).toISOString(),
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
  };

  const sampleCommandApproval: Approval = {
    id: "approval-cmd-001",
    run_id: "run-12345",
    risk: "high",
    capability: "shell_exec",
    reason: "Execute database migration to add OAuth2 columns",
    requested_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    type: "command_line",
    source: "terminal",
    action: "npx prisma migrate deploy --name add_oauth2_columns",
    metadata: {
      can_edit: true,
    },
  };

  const sampleNpmApproval: Approval = {
    id: "approval-npm-001",
    run_id: "run-12346",
    risk: "low",
    capability: "shell_exec",
    reason: "Install required dependencies for authentication module",
    requested_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    type: "command_line",
    source: "terminal",
    action: "npm install next-auth @auth/core",
    metadata: {
      can_edit: true,
    },
  };

  const sampleApiApproval: Approval = {
    id: "approval-api-001",
    run_id: "run-12347",
    risk: "medium",
    capability: "code_execution",
    reason: "Deploy new authentication service to production",
    requested_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    type: "command_line",
    source: "deployment",
    action: "kubectl apply -f auth-service-deployment.yaml",
    metadata: {
      can_edit: true,
    },
  };

  const sampleSearchApproval: Approval = {
    id: "approval-search-001",
    run_id: "run-12348",
    risk: "low",
    capability: "web_search",
    reason: "Search for OAuth2 best practices and security guidelines",
    requested_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    type: "mcp_tool",
    source: "web-search",
    action: "search OAuth2 OIDC best practices 2024",
    metadata: {
      can_edit: true,
    },
  };

  const sampleFileApproval: Approval = {
    id: "approval-file-001",
    run_id: "run-12349",
    risk: "medium",
    capability: "docs_read",
    reason: "Read and analyze existing authentication configuration files",
    requested_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    type: "mcp_tool",
    source: "filesystem",
    action: "read_files src/config/auth.config.ts",
    metadata: {
      can_edit: true,
    },
  };

  return {
    sampleApproval,
    sampleMCPApproval,
    sampleCommandApproval,
    sampleNpmApproval,
    sampleApiApproval,
    sampleSearchApproval,
    sampleFileApproval,
  };
}
