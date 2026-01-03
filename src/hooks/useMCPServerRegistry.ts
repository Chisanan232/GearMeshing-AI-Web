// src/hooks/useMCPServerRegistry.ts
// Hook for managing MCP (Model Context Protocol) server registry
// Provides centralized access to available MCP servers and their tools/resources

export interface MCPServer {
  name: string;
  tools: string[];
}

export interface MCPServerRegistry {
  [key: string]: MCPServer;
}

/**
 * Provides registry of available MCP servers and their tools
 * Used for MCP tool approval workflows and server/tool selection
 * @returns {MCPServerRegistry} Registry of MCP servers with available tools
 */
export function useMCPServerRegistry(): MCPServerRegistry {
  const mcpServers: MCPServerRegistry = {
    "web-search": {
      name: "Web Search",
      tools: ["search", "search_with_filters", "get_search_results"],
    },
    "google-drive": {
      name: "Google Drive",
      tools: ["list_files", "read_file", "create_file", "update_file"],
    },
    filesystem: {
      name: "Filesystem",
      tools: ["read_files", "write_file", "list_directory", "delete_file"],
    },
    github: {
      name: "GitHub",
      tools: ["search_repos", "get_repo_info", "list_issues", "create_issue"],
    },
    slack: {
      name: "Slack",
      tools: ["send_message", "list_channels", "get_channel_info"],
    },
  };

  return mcpServers;
}
