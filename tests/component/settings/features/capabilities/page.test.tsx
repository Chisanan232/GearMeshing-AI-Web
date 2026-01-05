import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CapabilitiesPage from "@/app/settings/features/capabilities/page";
import * as GovernanceContext from "@/contexts/governance-context";

// Mock data
const mockRoles = [
  {
    id: "architect",
    name: "Architect",
    description: "System Architect",
    capabilities: ["cap1"],
  },
  {
    id: "developer",
    name: "Developer",
    description: "Code Monkey",
    capabilities: [],
  },
];

const mockCapabilities = [
  {
    id: "cap1",
    name: "Read Files",
    description: "Read from filesystem",
    category: "Filesystem",
    riskLevel: "low",
  },
  {
    id: "cap2",
    name: "Write Files",
    description: "Write to filesystem",
    category: "Filesystem",
    riskLevel: "medium",
  },
  {
    id: "cap3",
    name: "Execute Code",
    description: "Run arbitrary code",
    category: "System",
    riskLevel: "critical",
  },
];

const mockUpdateRole = vi.fn();

// Mock the governance context
vi.mock("@/contexts/governance-context", () => ({
  useGovernance: vi.fn(),
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const MotionDiv = React.forwardRef((props: any, ref: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    // Filter out motion-specific props manually to avoid unused variable warnings
    const { children, ...otherProps } = props;
    const validProps = { ...otherProps };
    const motionProps = [
      "layoutId",
      "whileHover",
      "whileTap",
      "initial",
      "animate",
      "exit",
      "transition",
      "variants",
    ];
    motionProps.forEach((prop) => delete validProps[prop]);
    return (
      <div ref={ref} {...validProps}>
        {children}
      </div>
    );
  });
  MotionDiv.displayName = "MotionDiv";

  return {
    motion: {
      div: MotionDiv,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("CapabilitiesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GovernanceContext.useGovernance).mockReturnValue({
      capabilities: mockCapabilities,
      roles: mockRoles,
      updateRole: mockUpdateRole,
      isLoading: false,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  describe("Rendering", () => {
    it("should render page title", () => {
      render(<CapabilitiesPage />);
      expect(screen.getByText("Capabilities")).toBeInTheDocument();
      expect(
        screen.getByText(/Explore the atomic skills/i),
      ).toBeInTheDocument();
    });

    it("should render loading state", () => {
      vi.mocked(GovernanceContext.useGovernance).mockReturnValue({
        capabilities: [],
        roles: [],
        updateRole: mockUpdateRole,
        isLoading: true,
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      render(<CapabilitiesPage />);
      expect(screen.getByText("Loading capabilities...")).toBeInTheDocument();
    });

    it("should display capabilities grouped by category", () => {
      render(<CapabilitiesPage />);
      expect(screen.getByText("Filesystem")).toBeInTheDocument();
      expect(screen.getByText("System")).toBeInTheDocument();

      expect(screen.getByText("Read Files")).toBeInTheDocument();
      expect(screen.getByText("Write Files")).toBeInTheDocument();
      expect(screen.getByText("Execute Code")).toBeInTheDocument();
    });

    it("should display risk levels correctly", () => {
      render(<CapabilitiesPage />);
      expect(screen.getByText("low Risk")).toBeInTheDocument();
      expect(screen.getByText("medium Risk")).toBeInTheDocument();
      expect(screen.getByText("critical Risk")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should filter capabilities by search", async () => {
      const user = userEvent.setup();
      render(<CapabilitiesPage />);

      const searchInput = screen.getByPlaceholderText(/Search capabilities/i);

      // Filter by name
      await user.type(searchInput, "Execute");
      expect(screen.getByText("Execute Code")).toBeInTheDocument();
      expect(screen.queryByText("Read Files")).not.toBeInTheDocument();

      // Clear and filter by description
      await user.clear(searchInput);
      await user.type(searchInput, "filesystem");
      expect(screen.getByText("Read Files")).toBeInTheDocument();
      expect(screen.queryByText("Execute Code")).not.toBeInTheDocument();
    });

    it("should open sheet when clicking a capability", async () => {
      const user = userEvent.setup();
      render(<CapabilitiesPage />);

      // Click on "Execute Code" card
      // Using closest to find clickable container if needed, but text click usually bubbles
      await user.click(screen.getByText("Execute Code"));

      // Sheet should open
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Execute Code" }),
      ).toBeInTheDocument();

      // Should show warning for critical risk
      expect(screen.getByText("High Risk Capability")).toBeInTheDocument();
    });

    it("should show role access in sheet", async () => {
      const user = userEvent.setup();
      render(<CapabilitiesPage />);

      // Click on "Read Files" (cap1) - Architect has it, Developer doesn't
      await user.click(screen.getByText("Read Files"));

      expect(screen.getByText("Architect")).toBeInTheDocument();
      expect(screen.getByText("Developer")).toBeInTheDocument();

      // Switches
      const switches = screen.getAllByRole("switch");
      // Architect (first mock role) has it -> checked
      expect(switches[0]).toBeChecked();
      // Developer (second mock role) doesn't -> unchecked
      expect(switches[1]).not.toBeChecked();
    });

    it("should toggle role capability", async () => {
      const user = userEvent.setup();
      render(<CapabilitiesPage />);

      // Click on "Read Files"
      await user.click(screen.getByText("Read Files"));

      // Toggle Developer (second switch)
      const switches = screen.getAllByRole("switch");
      await user.click(switches[1]);

      expect(mockUpdateRole).toHaveBeenCalledTimes(1);
      // Developer didn't have it, so now should have it
      expect(mockUpdateRole).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "developer",
          capabilities: ["cap1"],
        }),
      );
    });

    it("should remove capability when toggled off", async () => {
      const user = userEvent.setup();
      render(<CapabilitiesPage />);

      // Click on "Read Files"
      await user.click(screen.getByText("Read Files"));

      // Toggle Architect (first switch) - Has it initially
      const switches = screen.getAllByRole("switch");
      await user.click(switches[0]);

      expect(mockUpdateRole).toHaveBeenCalledTimes(1);
      // Architect had it, now should not
      expect(mockUpdateRole).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "architect",
          capabilities: [], // Was ["cap1"], now empty
        }),
      );
    });
  });
});
