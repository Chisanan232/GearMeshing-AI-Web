import { ComponentType } from "react";

export interface IBillingService {
  getPlan(): "community" | "pro";
  upgradeToPro(): Promise<void>;
  downgradeToCommunity(): Promise<void>;
}

export interface IPricingPlanComponentProps {
  onPlanChange?: (plan: "community" | "pro") => void;
}

export interface IBillingTabComponentProps {
  className?: string;
}

export interface IBillingPlugin {
  PricingPlanComponent?: ComponentType<IPricingPlanComponentProps>;
  BillingTabsComponent?: ComponentType<IBillingTabComponentProps>;
}
