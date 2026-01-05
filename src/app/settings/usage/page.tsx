// src/app/settings/usage/page.tsx
import { UsageTabs } from "@/components/settings/usage/usage-tabs";

export default function UsageDashboardPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Usage Dashboard</h1>
        <p className="text-neutral-400 mt-1">
          Monitor your token consumption, costs, and agent activity.
        </p>
      </header>
      <UsageTabs />
    </div>
  );
}
