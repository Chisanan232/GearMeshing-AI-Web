import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PricingPage from "@/app/settings/subscription/pricing/page";
import * as PluginContext from "@/contexts/plugin-context/plugin-context";

// Mock PluginContext
vi.mock("@/contexts/plugin-context/plugin-context", () => ({
  usePlugin: vi.fn(),
}));

const mockUpgradeToPro = vi.fn();
const mockDowngradeToCommunity = vi.fn();

describe("PricingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render pricing plan when component is available", () => {
    const MockPricingPlan = () => <div data-testid="pricing-plan">Mock Pricing Plan</div>;
    
    (PluginContext.usePlugin as any).mockReturnValue({
      billingPlugin: {
        PricingPlanComponent: MockPricingPlan,
      },
      billingService: {
        upgradeToPro: mockUpgradeToPro,
        downgradeToCommunity: mockDowngradeToCommunity,
      },
    });

    render(<PricingPage />);

    expect(screen.getByText("Pricing Plan")).toBeInTheDocument();
    expect(screen.getByText(/Choose the plan that best fits/i)).toBeInTheDocument();
    expect(screen.getByText("Go to Billing")).toBeInTheDocument();
    expect(screen.getByTestId("pricing-plan")).toBeInTheDocument();
  });

  it("should render fallback when pricing component is missing", () => {
    (PluginContext.usePlugin as any).mockReturnValue({
      billingPlugin: {
        PricingPlanComponent: null,
      },
      billingService: {},
    });

    render(<PricingPage />);

    expect(screen.getByText(/Pricing plans are not configured/i)).toBeInTheDocument();
    expect(screen.queryByText("Pricing Plan")).not.toBeInTheDocument();
  });

  it("should handle plan upgrades via the component prop callback", async () => {
    // We need to capture the prop passed to the mock component to trigger it
    let onPlanChangeCallback: ((plan: "community" | "pro") => Promise<void>) | undefined;
    
    const MockPricingPlan = ({ onPlanChange }: { onPlanChange: (plan: "community" | "pro") => Promise<void> }) => {
      onPlanChangeCallback = onPlanChange;
      return (
        <div>
          <button onClick={() => onPlanChange("pro")}>Upgrade</button>
        </div>
      );
    };

    (PluginContext.usePlugin as any).mockReturnValue({
      billingPlugin: {
        PricingPlanComponent: MockPricingPlan,
      },
      billingService: {
        upgradeToPro: mockUpgradeToPro,
        downgradeToCommunity: mockDowngradeToCommunity,
      },
    });

    const user = userEvent.setup();
    render(<PricingPage />);

    await user.click(screen.getByText("Upgrade"));
    
    expect(mockUpgradeToPro).toHaveBeenCalled();
    expect(mockDowngradeToCommunity).not.toHaveBeenCalled();
  });

  it("should handle plan downgrades via the component prop callback", async () => {
    const MockPricingPlan = ({ onPlanChange }: { onPlanChange: (plan: "community" | "pro") => Promise<void> }) => {
      return (
        <div>
          <button onClick={() => onPlanChange("community")}>Downgrade</button>
        </div>
      );
    };

    (PluginContext.usePlugin as any).mockReturnValue({
      billingPlugin: {
        PricingPlanComponent: MockPricingPlan,
      },
      billingService: {
        upgradeToPro: mockUpgradeToPro,
        downgradeToCommunity: mockDowngradeToCommunity,
      },
    });

    const user = userEvent.setup();
    render(<PricingPage />);

    await user.click(screen.getByText("Downgrade"));
    
    expect(mockDowngradeToCommunity).toHaveBeenCalled();
    expect(mockUpgradeToPro).not.toHaveBeenCalled();
  });
});
