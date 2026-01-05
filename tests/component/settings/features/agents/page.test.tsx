import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AgentsPage from "@/app/settings/features/agents/page";
import * as GovernanceContext from "@/contexts/governance-context";

// Mock data
const mockRoles = [
  {
    id: "architect",
    name: "Architect",
    description: "Designs system architecture",
    icon: "BrainCircuit",
    capabilities: ["cap_read_code", "cap_write_spec"],
    llmConfig: {
      provider: "openai",
      model: "gpt-4-turbo",
      temperature: 0.7,
    },
  },
  {
    id: "developer",
    name: "Developer",
    description: "Writes and debugs code",
    icon: "Code2",
    capabilities: [
      "cap_write_code",
      "cap_run_tests",
      "cap_debug",
      "cap_deploy",
    ],
    llmConfig: {
      provider: "anthropic",
      model: "claude-3-opus",
      temperature: 0.5,
    },
  },
];

const mockUpdateRole = vi.fn();

// Mock the governance context
vi.mock("@/contexts/governance-context", () => ({
  useGovernance: vi.fn(),
}));

describe("AgentsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (GovernanceContext.useGovernance as any).mockReturnValue({
      roles: mockRoles,
      updateRole: mockUpdateRole,
      isLoading: false,
    });
  });

  describe("Rendering", () => {
    it("should render page title and description", () => {
      render(<AgentsPage />);
      expect(screen.getByText("AI Agents")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Manage the specialized personas that power your development workflow/i,
        ),
      ).toBeInTheDocument();
    });

    it("should render loading state", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (GovernanceContext.useGovernance as any).mockReturnValue({
        roles: [],
        updateRole: mockUpdateRole,
        isLoading: true,
      });
      render(<AgentsPage />);
      expect(screen.getByText("Loading agents...")).toBeInTheDocument();
    });

    it("should render agent cards correctly", () => {
      render(<AgentsPage />);

      // Check for Architect card
      expect(screen.getByText("Architect")).toBeInTheDocument();
      expect(
        screen.getByText("Designs system architecture"),
      ).toBeInTheDocument();
      expect(screen.getByText(/openai \/ gpt-4-turbo/i)).toBeInTheDocument();

      // Check for Developer card
      expect(screen.getByText("Developer")).toBeInTheDocument();
      expect(screen.getByText("Writes and debugs code")).toBeInTheDocument();
      expect(
        screen.getByText(/anthropic \/ claude-3-opus/i),
      ).toBeInTheDocument();
    });

    it("should render capabilities badges", () => {
      render(<AgentsPage />);
      // "cap_read_code" -> "read code" logic is in the component
      expect(screen.getByText("read code")).toBeInTheDocument();
      expect(screen.getByText("write spec")).toBeInTheDocument();
    });

    it("should show extra capabilities count badge", () => {
      render(<AgentsPage />);
      // Developer has 4 capabilities, displays 3 + 1
      expect(screen.getByText("+1")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should open configuration sheet when Configure button is clicked", async () => {
      const user = userEvent.setup();
      render(<AgentsPage />);

      const configureButtons = screen.getAllByText("Configure");
      await user.click(configureButtons[0]); // Click Architect configure

      expect(screen.getByText("Configure Architect")).toBeInTheDocument();
      expect(screen.getByLabelText("Agent Name")).toHaveValue("Architect");
    });

    it("should update form values", async () => {
      const user = userEvent.setup();
      render(<AgentsPage />);

      // Open sheet
      const configureButtons = screen.getAllByText("Configure");
      await user.click(configureButtons[0]);

      // Edit name
      const nameInput = screen.getByLabelText("Agent Name");
      await user.clear(nameInput);
      await user.type(nameInput, "Super Architect");
      expect(nameInput).toHaveValue("Super Architect");

      // Edit description
      const descInput = screen.getByLabelText("Description");
      await user.clear(descInput);
      await user.type(descInput, "New description");
      expect(descInput).toHaveValue("New description");
    });

    it("should save changes when Save Configuration is clicked", async () => {
      const user = userEvent.setup();
      render(<AgentsPage />);

      // Open sheet
      const configureButtons = screen.getAllByText("Configure");
      await user.click(configureButtons[0]);

      // Change name
      const nameInput = screen.getByLabelText("Agent Name");
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Name");

      // Click save
      const saveButton = screen.getByText("Save Configuration");
      await user.click(saveButton);

      // Verify updateRole was called with correct data
      expect(mockUpdateRole).toHaveBeenCalledTimes(1);
      expect(mockUpdateRole).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "architect",
          name: "Updated Name",
        }),
      );
    });

    it("should render governance buttons with correct links in sheet", async () => {
      const user = userEvent.setup();
      render(<AgentsPage />);

      // Open sheet
      const configureButtons = screen.getAllByText("Configure");
      await user.click(configureButtons[0]);

      // Check Capabilities button link
      const capabilitiesLink = screen.getByText("Capabilities").closest("a");
      expect(capabilitiesLink).toHaveAttribute(
        "href",
        "/settings/features/capabilities",
      );

      // Check Policies button link
      const policiesLink = screen.getByText("Policies").closest("a");
      expect(policiesLink).toHaveAttribute("href", "/settings/features/policy");
    });
  });
});
