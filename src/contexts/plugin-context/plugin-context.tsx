
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { IAuthService } from "@/services/auth/types";
import { IBillingService, IBillingPlugin } from "@/services/billing/types";
import { authService } from "@/services/auth/auth-service";
import { billingService } from "@/services/billing/billing-service";

// Default/Mock Components removed to allow conditional rendering based on injection


interface PluginContextType {
  authService: IAuthService;
  billingService: IBillingService;
  billingPlugin: IBillingPlugin;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

interface PluginProviderProps {
  children: ReactNode;
  overrides?: Partial<PluginContextType>;
}

export function PluginProvider({ children, overrides }: PluginProviderProps) {
  const value = {
    authService: overrides?.authService ?? authService,
    billingService: overrides?.billingService ?? billingService,
    billingPlugin: overrides?.billingPlugin ?? {
      PricingPlanComponent: undefined,
      BillingTabsComponent: undefined,
    },
  };

  return (
    <PluginContext.Provider value={value}>{children}</PluginContext.Provider>
  );
}

export function usePlugin() {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error("usePlugin must be used within a PluginProvider");
  }
  return context;
}
