import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PolicyPage from "@/app/settings/features/policy/page";
import * as GovernanceContext from "@/contexts/governance-context";

// Mock data
const mockRoles = [
  { id: "architect", name: "Architect" },
  { id: "developer", name: "Developer" },
];

const mockPolicies = [
  {
    id: "p1",
    name: "Global Safety",
    description: "Prevent dangerous ops",
    scope: "global",
    isActive: true,
    rules: [
      { id: "r1", resource: "filesystem", action: "deny", conditions: {} },
    ],
  },
  {
    id: "p2",
    name: "Architect Specs",
    description: "Allow writing specs",
    scope: "agent",
    agentId: "architect",
    isActive: true,
    rules: [
      { id: "r2", resource: "specs", action: "allow", conditions: {} },
    ],
  },
];

const mockUpdatePolicy = vi.fn();

// Mock the governance context
vi.mock("@/contexts/governance-context", () => ({
  useGovernance: vi.fn(),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("PolicyPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GovernanceContext.useGovernance).mockReturnValue({
      policies: mockPolicies,
      roles: mockRoles,
      updatePolicy: mockUpdatePolicy,
      isLoading: false,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  describe("Rendering", () => {
    it("should render page title", () => {
      render(<PolicyPage />);
      expect(screen.getByText("Policy & Guardrails")).toBeInTheDocument();
    });

    it("should render loading state", () => {
      vi.mocked(GovernanceContext.useGovernance).mockReturnValue({
        policies: [],
        roles: [],
        updatePolicy: mockUpdatePolicy,
        isLoading: true,
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      render(<PolicyPage />);
      expect(screen.getByText("Loading policies...")).toBeInTheDocument();
    });

    it("should render global policies by default", () => {
      render(<PolicyPage />);
      expect(screen.getByText("Global Policies")).toHaveAttribute("data-state", "active");
      
      // Check for Global Safety policy
      expect(screen.getByText("Global Safety")).toBeInTheDocument();
      expect(screen.getByText("Prevent dangerous ops")).toBeInTheDocument();
      expect(screen.getByText("DENY")).toBeInTheDocument();
      expect(screen.getByText("filesystem")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should toggle policy switch", async () => {
      const user = userEvent.setup();
      render(<PolicyPage />);

      // Find switch for Global Safety
      // The switch has role="switch"
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toBeChecked();

      await user.click(switchEl);

      expect(mockUpdatePolicy).toHaveBeenCalledTimes(1);
      expect(mockUpdatePolicy).toHaveBeenCalledWith(expect.objectContaining({
        id: "p1",
        isActive: false,
      }));
    });

    it("should switch to Agent-Specific tab", async () => {
      const user = userEvent.setup();
      render(<PolicyPage />);

      const agentTab = screen.getByText("Agent-Specific");
      await user.click(agentTab);

      expect(agentTab).toHaveAttribute("data-state", "active");
      expect(screen.getByText("Select Agent")).toBeInTheDocument();
    });

    it("should show inherited policies in Agent tab", async () => {
      const user = userEvent.setup();
      render(<PolicyPage />);

      await user.click(screen.getByText("Agent-Specific"));

      // Should show inherited global policy as Read Only
      expect(screen.getByText("Inherited Global Policies")).toBeInTheDocument();
      expect(screen.getByText("Read Only")).toBeInTheDocument();
      // Should show rule details
      expect(screen.getByText(/DENY: filesystem/)).toBeInTheDocument();
    });

    it("should select agent and show specific policies", async () => {
      const user = userEvent.setup();
      render(<PolicyPage />);

      await user.click(screen.getByText("Agent-Specific"));

      // Default selected is first role (Architect)
      // Check for Architect policy
      expect(screen.getByText("Architect Specs")).toBeInTheDocument();

      // Click Developer in sidebar
      await user.click(screen.getByText("Developer"));

      // Developer has no specific policies in mock data
      expect(screen.getByText(/No specific policies defined/i)).toBeInTheDocument();
      // Architect policy should be gone
      expect(screen.queryByText("Architect Specs")).not.toBeInTheDocument();
    });
    
    it("should toggle agent specific policy", async () => {
      const user = userEvent.setup();
      render(<PolicyPage />);
      
      await user.click(screen.getByText("Agent-Specific"));
      
      // Architect is default
      const switchEl = screen.getByRole("switch"); // The one for Architect Specs
      await user.click(switchEl);
      
      expect(mockUpdatePolicy).toHaveBeenCalledWith(expect.objectContaining({
          id: "p2",
          isActive: false
      }));
    });
  });
});
