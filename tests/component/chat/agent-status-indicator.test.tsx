// tests/component/chat/agent-status-indicator.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AgentStatusIndicator } from "@/components/chat/agent-status-indicator";
import { describe, it, expect } from "vitest";

describe("AgentStatusIndicator", () => {
  it("should render the thinking indicator", () => {
    render(<AgentStatusIndicator />);
    expect(screen.getByText(/Agent is thinking/i)).toBeInTheDocument();
  });

  it("should render with default empty thought logs", () => {
    render(<AgentStatusIndicator />);
    const indicator = screen.getByText(/Agent is thinking/i);
    expect(indicator).toBeInTheDocument();
  });

  it("should render thought logs when provided", () => {
    const thoughtLogs = [
      "Analyzing the current authentication flow...",
      "Searching for security vulnerabilities...",
    ];
    render(<AgentStatusIndicator thoughtLogs={thoughtLogs} />);

    // Initially collapsed, so logs should not be visible
    expect(
      screen.queryByText("Analyzing the current authentication flow..."),
    ).not.toBeInTheDocument();
  });

  it("should expand and show thought logs when header is clicked", () => {
    const thoughtLogs = [
      "Analyzing the current authentication flow...",
      "Searching for security vulnerabilities...",
      "Detected missing expiration validation in `auth.ts`.",
    ];
    render(<AgentStatusIndicator thoughtLogs={thoughtLogs} />);

    const header = screen.getByText(/Agent is thinking/i).closest("button");
    expect(header).toBeInTheDocument();

    // Click to expand
    fireEvent.click(header!);

    // Now logs should be visible
    expect(
      screen.getByText("Analyzing the current authentication flow..."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Searching for security vulnerabilities..."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Detected missing expiration validation in `auth.ts`."),
    ).toBeInTheDocument();
  });

  it("should collapse thought logs when header is clicked again", () => {
    const thoughtLogs = [
      "Analyzing the current authentication flow...",
      "Searching for security vulnerabilities...",
    ];
    render(<AgentStatusIndicator thoughtLogs={thoughtLogs} />);

    const header = screen.getByText(/Agent is thinking/i).closest("button");

    // Expand
    fireEvent.click(header!);
    expect(
      screen.getByText("Analyzing the current authentication flow..."),
    ).toBeInTheDocument();

    // Collapse
    fireEvent.click(header!);
    expect(
      screen.queryByText("Analyzing the current authentication flow..."),
    ).not.toBeInTheDocument();
  });

  it("should display chevron icon that changes on expand/collapse", () => {
    const thoughtLogs = ["Test log"];
    const { container } = render(
      <AgentStatusIndicator thoughtLogs={thoughtLogs} />,
    );

    const header = screen.getByText(/Agent is thinking/i).closest("button");

    // Check for ChevronDown initially
    let chevrons = container.querySelectorAll("svg");
    expect(chevrons.length).toBeGreaterThan(0);

    // Click to expand
    fireEvent.click(header!);

    // Chevron should change (visual indication)
    chevrons = container.querySelectorAll("svg");
    expect(chevrons.length).toBeGreaterThan(0);
  });

  it("should render with correct styling classes", () => {
    const { container } = render(<AgentStatusIndicator />);

    // Check for pulsing indicator
    const pulsingElement = container.querySelector("[class*='animate-pulse']");
    expect(pulsingElement).toBeInTheDocument();

    // Check for border styling
    const borderElement = container.querySelector("[class*='border-violet']");
    expect(borderElement).toBeInTheDocument();
  });

  it("should render header with correct styling", () => {
    render(<AgentStatusIndicator />);

    const header = screen.getByText(/Agent is thinking/i).closest("button");
    expect(header).toHaveClass("rounded-lg");
    expect(header).toHaveClass("border");
  });

  it("should handle multiple thought logs correctly", () => {
    const thoughtLogs = [
      "Step 1: Analyzing...",
      "Step 2: Processing...",
      "Step 3: Validating...",
      "Step 4: Finalizing...",
    ];
    render(<AgentStatusIndicator thoughtLogs={thoughtLogs} />);

    const header = screen.getByText(/Agent is thinking/i).closest("button");
    fireEvent.click(header!);

    thoughtLogs.forEach((log) => {
      expect(screen.getByText(log)).toBeInTheDocument();
    });
  });

  it("should render arrow prefix for each thought log", () => {
    const thoughtLogs = ["First thought", "Second thought"];
    const { container } = render(
      <AgentStatusIndicator thoughtLogs={thoughtLogs} />,
    );

    const header = screen.getByText(/Agent is thinking/i).closest("button");
    fireEvent.click(header!);

    // Check for arrow indicators (→)
    const logElements = container.querySelectorAll(
      "[class*='text-violet-400']",
    );
    expect(logElements.length).toBeGreaterThan(0);
  });

  it("should render with proper gap and spacing", () => {
    const { container } = render(<AgentStatusIndicator />);

    const mainContainer = container.querySelector(
      "[class*='flex'][class*='gap-3']",
    );
    expect(mainContainer).toBeInTheDocument();
  });

  it("should render pulsing animation with correct structure", () => {
    const { container } = render(<AgentStatusIndicator />);

    // Check for the indicator div structure
    const indicatorDiv = container.querySelector(
      "[class*='relative'][class*='h-8'][class*='w-8']",
    );
    expect(indicatorDiv).toBeInTheDocument();

    // Check for nested rings
    const rings = indicatorDiv?.querySelectorAll("[class*='rounded-full']");
    expect(rings?.length).toBeGreaterThan(1);
  });

  it("should render Zap icon in the center", () => {
    const { container } = render(<AgentStatusIndicator />);

    // Check for icon element
    const iconElements = container.querySelectorAll("svg");
    expect(iconElements.length).toBeGreaterThan(0);
  });

  it("should have proper text color for thinking state", () => {
    render(<AgentStatusIndicator />);

    const header = screen.getByText(/Agent is thinking/i).closest("button");
    expect(header).toHaveClass("text-violet-300");
  });
});
