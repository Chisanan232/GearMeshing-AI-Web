import { IBillingService } from "./types";

export class MockBillingService implements IBillingService {
  private storageKey = "gearmeshing-billing-plan";

  getPlan(): "community" | "pro" {
    if (typeof window === "undefined") return "community";
    return (
      (window.localStorage.getItem(this.storageKey) as "community" | "pro") ||
      "community"
    );
  }

  async upgradeToPro(): Promise<void> {
    if (typeof window === "undefined") return;
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem(this.storageKey, "pro");
  }

  async downgradeToCommunity(): Promise<void> {
    if (typeof window === "undefined") return;
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem(this.storageKey, "community");
  }
}

export const billingService = new MockBillingService();
