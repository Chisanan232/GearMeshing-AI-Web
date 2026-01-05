import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BillingPage from "@/app/settings/subscription/billing/page";
import * as PluginContext from "@/contexts/plugin-context/plugin-context";

// Mock PluginContext
vi.mock("@/contexts/plugin-context/plugin-context", () => ({
  usePlugin: vi.fn(),
}));

describe("BillingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render billing tabs when component is available", () => {
    const MockBillingTabs = () => <div data-testid="billing-tabs">Mock Billing Tabs</div>;
    
    vi.mocked(PluginContext.usePlugin).mockReturnValue({
      billingPlugin: {
        BillingTabsComponent: MockBillingTabs,
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    render(<BillingPage />);

    expect(screen.getByText("Billing & Payment")).toBeInTheDocument();
    expect(screen.getByText(/Manage your payment methods/i)).toBeInTheDocument();
    expect(screen.getByTestId("billing-tabs")).toBeInTheDocument();
  });

  it("should render fallback when billing component is missing", () => {
    vi.mocked(PluginContext.usePlugin).mockReturnValue({
      billingPlugin: {
        BillingTabsComponent: null,
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    render(<BillingPage />);

    expect(screen.getByText(/Billing information is not available/i)).toBeInTheDocument();
    expect(screen.queryByText("Billing & Payment")).not.toBeInTheDocument();
  });
});
