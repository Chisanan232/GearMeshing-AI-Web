"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePlugin } from "@/contexts/plugin-context/plugin-context";

interface SidebarItem {
  title: string;
  href: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export function SettingsSidebar() {
  const pathname = usePathname();
  const { billingPlugin } = usePlugin();

  const sidebarSections: SidebarSection[] = [
    {
      title: "Account",
      items: [{ title: "Profile", href: "/settings/account" }],
    },
    {
      title: "Subscription",
      items: [
        ...(billingPlugin.PricingPlanComponent
          ? [{ title: "Pricing Plan", href: "/settings/subscription/pricing" }]
          : []),
        ...(billingPlugin.BillingTabsComponent
          ? [
              {
                title: "Billing & Payment",
                href: "/settings/subscription/billing",
              },
            ]
          : []),
        { title: "Usage", href: "/settings/usage" },
      ],
    },
    {
      title: "Features",
      items: [
        { title: "AI Agents", href: "/settings/features/agents" },
        { title: "Policy", href: "/settings/features/policy" },
        { title: "Capabilities", href: "/settings/features/capabilities" },
        { title: "MCP Servers", href: "/settings/features/mcp" },
      ],
    },
  ];

  return (
    <nav className="w-64 flex-shrink-0 pr-8 hidden md:block">
      {/* Home Link with Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 mb-8 px-2 text-white hover:opacity-80 transition-opacity"
      >
        <Image
          src="/gearmeshing-ai-logo.png"
          alt="GearMeshing AI"
          width={24}
          height={24}
          className="rounded-sm"
        />
        <span className="font-semibold text-sm">GearMeshing AI</span>
      </Link>

      <div className="space-y-8">
        {sidebarSections.map(
          (section) =>
            // Only render section if it has items
            section.items.length > 0 && (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block px-2 py-1.5 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-neutral-800 text-white"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800/50",
                        )}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ),
        )}
      </div>
    </nav>
  );
}
