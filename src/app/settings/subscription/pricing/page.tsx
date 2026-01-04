"use client";

import { usePlugin } from "@/contexts/plugin-context/plugin-context";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const { billingPlugin, billingService } = usePlugin();
  const { PricingPlanComponent } = billingPlugin;

  if (!PricingPlanComponent) {
    return (
      <div className="p-8 text-center text-neutral-400 border border-dashed border-neutral-800 rounded-lg">
        Pricing plans are not configured for this deployment.
      </div>
    );
  }

  const handlePlanChange = async (plan: "community" | "pro") => {
    if (plan === "pro") {
      await billingService.upgradeToPro();
    } else {
      await billingService.downgradeToCommunity();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold mb-2">Pricing Plan</h3>
          <p className="text-neutral-400">
            Choose the plan that best fits your needs.
          </p>
        </div>
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/settings/subscription/billing">
            Go to Billing <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <PricingPlanComponent onPlanChange={handlePlanChange} />
    </div>
  );
}
