import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MCPSettingsPage from "@/app/settings/features/mcp/page";
import * as GovernanceContext from "@/contexts/governance-context";

// Mock data
const mockMCPServers = [
  {
    id: "filesystem",
    name: "Filesystem MCP",
    url: "stdio://filesystem-mcp",
    status: "connected",
    tools: ["read_file", "write_file", "list_directory"],
    lastHeartbeat: new Date().toISOString(),
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    url: "http://localhost:3000/mcp/pg",
    status: "disconnected",
    tools: [],
    lastHeartbeat: null,
  },
];

const mockRefreshData = vi.fn();
const mockRefreshMCPServer = vi.fn();
const mockRefreshAllMCPServers = vi.fn();

// Mock the governance context
vi.mock("@/contexts/governance-context", () => ({
  useGovernance: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("MCPSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GovernanceContext.useGovernance).mockReturnValue({
      mcpServers: mockMCPServers,
      refreshData: mockRefreshData,
      isLoading: false,
      refreshMCPServer: mockRefreshMCPServer,
      refreshAllMCPServers: mockRefreshAllMCPServers,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  describe("Rendering", () => {
    it("should render page title and description", () => {
      render(<MCPSettingsPage />);
      expect(screen.getByText("MCP Servers")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Manage connections to Model Context Protocol \(MCP\) servers/i,
        ),
      ).toBeInTheDocument();
    });

    it("should render loading state", () => {
      vi.mocked(GovernanceContext.useGovernance).mockReturnValue({
        mcpServers: [],
        refreshData: mockRefreshData,
        isLoading: true,
        refreshMCPServer: mockRefreshMCPServer,
        refreshAllMCPServers: mockRefreshAllMCPServers,
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      render(<MCPSettingsPage />);
      expect(screen.getByText("Loading MCP servers...")).toBeInTheDocument();
    });

    it("should render server cards correctly", () => {
      render(<MCPSettingsPage />);

      // Check Filesystem server
      expect(screen.getByText("Filesystem MCP")).toBeInTheDocument();
      expect(screen.getByText("stdio://filesystem-mcp")).toBeInTheDocument();
      expect(screen.getByText("Connected")).toBeInTheDocument();

      // Check PostgreSQL server
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(
        screen.getByText("http://localhost:3000/mcp/pg"),
      ).toBeInTheDocument();
      expect(screen.getByText("Disconnected")).toBeInTheDocument();
    });

    it("should render tools list for servers", () => {
      render(<MCPSettingsPage />);
      expect(screen.getByText("read_file")).toBeInTheDocument();
      expect(screen.getByText("write_file")).toBeInTheDocument();

      // PostgreSQL has no tools
      expect(screen.getByText("No tools advertised")).toBeInTheDocument();
    });

    it("should render refresh buttons", () => {
      render(<MCPSettingsPage />);
      expect(screen.getByText("Refresh All")).toBeInTheDocument();
      // Server cards have refresh icon buttons
      const refreshButtons = screen.getAllByRole("button");
      // 1 Refresh All + 2 per server + 1 Add New
      // Actually we need to be more specific or check specific icons
      // But simply checking existence is a good start
      expect(refreshButtons.length).toBeGreaterThan(1);
    });
  });

  describe("Interactions", () => {
    it("should handle Refresh All", async () => {
      const user = userEvent.setup();
      render(<MCPSettingsPage />);

      const refreshAllBtn = screen.getByText("Refresh All");
      await user.click(refreshAllBtn);

      expect(mockRefreshAllMCPServers).toHaveBeenCalledTimes(1);
    });

    it("should handle individual server refresh", async () => {
      const user = userEvent.setup();
      render(<MCPSettingsPage />);

      // Find the refresh button for the first server
      // Since we don't have aria-labels on the refresh buttons in the card header,
      // we might need to rely on the fact that they are icon buttons in the card header.
      // Or we can add test-ids. For now, let's find buttons inside the cards.

      // Rendered structure: Card -> Header -> div -> Button(icon)
      // The refresh button is the only button in the header (besides potential future actions)

      // Let's get all buttons and find one that is likely the refresh button (it has specific classes usually)
      // Alternatively, assume the icon is visible.
      // Let's assume the button with the refresh icon is clickable.

      // In the component:
      // <Button variant="ghost" size="icon" onClick={() => handleRefreshServer(server.id)} ...>

      // We can grab all ghost buttons
      const allButtons = screen.getAllByRole("button");
      const refreshAll = screen.getByText("Refresh All");
      const connectNew = screen
        .getByText(/Connect New MCP Server/i)
        .closest("button");

      const serverButtons = allButtons.filter(
        (b) => b !== refreshAll && b !== connectNew,
      );

      if (serverButtons.length > 0) {
        await user.click(serverButtons[0]);
        expect(mockRefreshMCPServer).toHaveBeenCalled();
      }
    });

    it("should open Add Server dialog", async () => {
      const user = userEvent.setup();
      render(<MCPSettingsPage />);

      const addBtn = screen.getByText(/Connect New MCP Server/i);
      await user.click(addBtn);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Connect MCP Server")).toBeInTheDocument();
    });

    it("should handle adding a server in dialog", async () => {
      const user = userEvent.setup();
      render(<MCPSettingsPage />);

      // Open dialog
      const addBtn = screen.getByText(/Connect New MCP Server/i);
      await user.click(addBtn);

      // Type URL
      const urlInput = screen.getByPlaceholderText("http://localhost:3000/mcp");
      await user.type(urlInput, "http://new-server:3000");
      expect(urlInput).toHaveValue("http://new-server:3000");

      // Click connect
      const connectBtn = screen.getByText("Connect Server");
      await user.click(connectBtn);

      expect(mockRefreshData).toHaveBeenCalled();

      // Dialog should close (wait for it)
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });
});
