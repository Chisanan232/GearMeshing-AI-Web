import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UsageDashboardPage from "@/app/settings/usage/page";

// Mock framer-motion
vi.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => {
        return <div ref={ref} {...props}>{children}</div>;
      }),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock Recharts to avoid rendering issues in JSDOM
vi.mock("recharts", () => {
  const OriginalModule = vi.importActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div className="recharts-responsive-container" style={{ width: 800, height: 350 }}>
        {children}
      </div>
    ),
    AreaChart: () => <div>AreaChart</div>,
    Area: () => <div>Area</div>,
    PieChart: () => <div>PieChart</div>,
    Pie: () => <div>Pie</div>,
    Cell: () => <div>Cell</div>,
    XAxis: () => <div>XAxis</div>,
    YAxis: () => <div>YAxis</div>,
    CartesianGrid: () => <div>CartesianGrid</div>,
    Tooltip: () => <div>Tooltip</div>,
  };
});

// Mock the sub-tabs if we want to isolate the page test, 
// but integration testing the tabs switching is valuable.
// The content of the tabs (Overview, etc.) is what we might want to mock if they are heavy.
// For now, let's keep them real but mock the heavy parts inside them (like charts).

describe("UsageDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render page title and description", () => {
    render(<UsageDashboardPage />);
    expect(screen.getByText("Usage Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/Monitor your token consumption/i)).toBeInTheDocument();
  });

  it("should render tabs", () => {
    render(<UsageDashboardPage />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Agent Insights" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Activity Logs" })).toBeInTheDocument();
  });

  it("should default to Overview tab", () => {
    render(<UsageDashboardPage />);
    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    expect(overviewTab).toHaveAttribute("aria-selected", "true");
    
    // Check for overview content
    expect(screen.getByText("Total Tokens")).toBeInTheDocument();
    expect(screen.getByText("Success Rate")).toBeInTheDocument();
  });

  it("should switch tabs", async () => {
    const user = userEvent.setup();
    render(<UsageDashboardPage />);

    const insightsTab = screen.getByRole("tab", { name: "Agent Insights" });
    await user.click(insightsTab);

    expect(insightsTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "false");
    
    // We expect the content to change. 
    // Since we didn't mock AgentInsightsTab, it should render its content.
    // Assuming AgentInsightsTab has some identifiable text.
    // Let's verify Overview content is hidden or removed (depending on Tabs implementation)
    // Radix Tabs usually keeps content in DOM but hidden or unmounts. 
    // Our Tabs implementation might be standard Radix.
  });
});
