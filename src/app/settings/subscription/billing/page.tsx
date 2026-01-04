"use client";

import { usePlugin } from "@/contexts/plugin-context/plugin-context";

export default function BillingPage() {
  const { billingPlugin } = usePlugin();
  const { BillingTabsComponent } = billingPlugin;

  if (!BillingTabsComponent) {
    return (
      <div className="p-8 text-center text-neutral-400 border border-dashed border-neutral-800 rounded-lg">
        Billing information is not available for this deployment.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Billing & Payment</h3>
        <p className="text-neutral-400">
          Manage your payment methods and view billing history.
        </p>
      </div>

      <BillingTabsComponent />
    </div>
  );
}
