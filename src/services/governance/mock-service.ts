import { AgentRole, Capability, MCPServer, Policy } from "./types";

// Mock Data
export const MOCK_CAPABILITIES: Capability[] = [
  {
    id: "cap_fs_read",
    name: "File Read",
    description: "Read files from the workspace",
    category: "filesystem",
    riskLevel: "low",
  },
  {
    id: "cap_fs_write",
    name: "File Write",
    description: "Write/Edit files in the workspace",
    category: "filesystem",
    riskLevel: "medium",
  },
  {
    id: "cap_shell",
    name: "Shell Execution",
    description: "Execute arbitrary shell commands",
    category: "system",
    riskLevel: "critical",
  },
  {
    id: "cap_net_http",
    name: "HTTP Requests",
    description: "Make external HTTP requests",
    category: "network",
    riskLevel: "high",
  },
  {
    id: "cap_browser",
    name: "Browser Control",
    description: "Control headless browser for scraping",
    category: "browser",
    riskLevel: "medium",
  },
  {
    id: "cap_code_analysis",
    name: "Code Analysis",
    description: "Parse and analyze ASTs",
    category: "analysis",
    riskLevel: "low",
  },
];

export const MOCK_AGENT_ROLES: AgentRole[] = [
  {
    id: "role_architect",
    name: "Architect",
    description: "High-level system design and planning. No direct execution.",
    icon: "BrainCircuit",
    llmConfig: { provider: "openai", model: "gpt-4-turbo", temperature: 0.7 },
    capabilities: ["cap_fs_read", "cap_code_analysis"],
    isSystem: true,
  },
  {
    id: "role_developer",
    name: "Developer",
    description: "Implements code changes and runs tests.",
    icon: "Code2",
    llmConfig: {
      provider: "anthropic",
      model: "claude-3-opus",
      temperature: 0.5,
    },
    capabilities: [
      "cap_fs_read",
      "cap_fs_write",
      "cap_shell",
      "cap_code_analysis",
    ],
    isSystem: true,
  },
  {
    id: "role_qa",
    name: "QA Engineer",
    description: "Writes and executes test plans.",
    icon: "FlaskConical",
    llmConfig: { provider: "openai", model: "gpt-3.5-turbo", temperature: 0.3 },
    capabilities: ["cap_fs_read", "cap_browser"],
    isSystem: true,
  },
];

export const MOCK_POLICIES: Policy[] = [
  {
    id: "pol_global_safety",
    name: "Global Safety Guardrails",
    description: "Base restrictions applicable to all agents.",
    scope: "global",
    rules: [
      {
        id: "rule_1",
        resource: "fs.write",
        action: "deny",
        conditions: { path_pattern: "**/.env" },
      },
      {
        id: "rule_2",
        resource: "shell.execute",
        action: "require_approval",
        conditions: { command_pattern: "rm -rf *" },
      },
    ],
    isActive: true,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "pol_dev_restrictions",
    name: "Developer Restrictions",
    description: "Specific limits for the Developer role.",
    scope: "agent",
    agentId: "role_developer",
    rules: [
      {
        id: "rule_3",
        resource: "net.http",
        action: "allow",
        conditions: { domain_allowlist: ["api.github.com", "npmjs.org"] },
      },
    ],
    isActive: true,
    lastUpdated: new Date().toISOString(),
  },
];

export const MOCK_MCP_SERVERS: MCPServer[] = [
  {
    id: "mcp_github",
    name: "GitHub Integration",
    url: "http://localhost:3001/mcp/github",
    status: "connected",
    tools: ["create_issue", "create_pr", "read_repo"],
    lastHeartbeat: new Date().toISOString(),
  },
  {
    id: "mcp_postgres",
    name: "PostgreSQL Database",
    url: "http://localhost:3002/mcp/pg",
    status: "disconnected",
    tools: ["query_db", "list_tables"],
  },
];

export class MockGovernanceService {
  // Roles
  async getRoles(): Promise<AgentRole[]> {
    return Promise.resolve([...MOCK_AGENT_ROLES]);
  }
  async updateRole(role: AgentRole): Promise<AgentRole> {
    return Promise.resolve(role);
  }

  // Capabilities
  async getCapabilities(): Promise<Capability[]> {
    return Promise.resolve([...MOCK_CAPABILITIES]);
  }

  // Policies
  async getPolicies(): Promise<Policy[]> {
    return Promise.resolve([...MOCK_POLICIES]);
  }
  async updatePolicy(policy: Policy): Promise<Policy> {
    return Promise.resolve(policy);
  }

  // MCP
  async getMCPServers(): Promise<MCPServer[]> {
    return Promise.resolve([...MOCK_MCP_SERVERS]);
  }
}

export const governanceService = new MockGovernanceService();
