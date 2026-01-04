"use client";

import { useState } from "react";
import { useGovernance } from "@/contexts/governance-context";
import { Capability, AgentRole } from "@/services/governance/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Search, Zap, AlertTriangle, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function CapabilitiesPage() {
  const { capabilities, roles, updateRole, isLoading } = useGovernance();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCapability, setSelectedCapability] =
    useState<Capability | null>(null);

  // Derived state
  const filteredCapabilities = capabilities.filter(
    (cap) =>
      cap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cap.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group capabilities by category for better visualization
  const categories = Array.from(
    new Set(filteredCapabilities.map((c) => c.category)),
  );

  // Role mapping logic
  const getRolesWithCapability = (capId: string) => {
    return roles.filter((role) => role.capabilities.includes(capId));
  };

  const toggleRoleCapability = async (role: AgentRole, capId: string) => {
    const hasCap = role.capabilities.includes(capId);
    const newCapabilities = hasCap
      ? role.capabilities.filter((c) => c !== capId)
      : [...role.capabilities, capId];

    await updateRole({
      ...role,
      capabilities: newCapabilities,
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-neutral-400">
        Loading capabilities...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Capabilities</h1>
        <p className="text-neutral-400">
          Explore the atomic skills available to your agents. Manage which roles
          have access to specific system resources and tools.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
        <Input
          placeholder="Search capabilities by name, description or category..."
          className="pl-10 bg-neutral-900 border-neutral-800 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Capabilities Grid / Tag Cloud */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCapabilities
                .filter((c) => c.category === category)
                .map((cap) => (
                  <motion.div
                    key={cap.id}
                    layoutId={cap.id}
                    onClick={() => setSelectedCapability(cap)}
                    className="cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="h-full bg-neutral-900 border-neutral-800 group-hover:border-neutral-700 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <Badge
                            variant="outline"
                            className="mb-2 text-xs font-normal border-neutral-700"
                          >
                            {cap.id}
                          </Badge>
                          <Badge
                            variant={
                              cap.riskLevel === "critical"
                                ? "destructive"
                                : cap.riskLevel === "high"
                                  ? "destructive"
                                  : cap.riskLevel === "medium"
                                    ? "secondary"
                                    : "outline"
                            }
                            className="text-[10px] uppercase"
                          >
                            {cap.riskLevel} Risk
                          </Badge>
                        </div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          {cap.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-neutral-400 line-clamp-2">
                          {cap.description}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
                          <Shield className="h-3 w-3" />
                          <span>
                            Used by {getRolesWithCapability(cap.id).length}{" "}
                            roles
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mapping Side Panel */}
      <Sheet
        open={!!selectedCapability}
        onOpenChange={(open) => !open && setSelectedCapability(null)}
      >
        <SheetContent className="sm:max-w-md bg-neutral-900 border-neutral-800 text-neutral-50">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {selectedCapability?.name}
            </SheetTitle>
            <SheetDescription>
              {selectedCapability?.description}
            </SheetDescription>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{selectedCapability?.category}</Badge>
              <Badge
                variant={
                  selectedCapability?.riskLevel === "critical" ||
                  selectedCapability?.riskLevel === "high"
                    ? "destructive"
                    : "secondary"
                }
              >
                {selectedCapability?.riskLevel} Risk
              </Badge>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                Role Access Control
              </h4>
              <p className="text-sm text-neutral-500">
                Toggle which agent roles can access this capability.
              </p>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {roles.map((role) => {
                  const hasAccess = role.capabilities.includes(
                    selectedCapability?.id || "",
                  );
                  return (
                    <div
                      key={role.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        hasAccess
                          ? "bg-primary/5 border-primary/20"
                          : "bg-neutral-950 border-neutral-800 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{role.name}</span>
                        <span className="text-xs text-neutral-400">
                          {role.description}
                        </span>
                      </div>
                      <Switch
                        checked={hasAccess}
                        onCheckedChange={() =>
                          selectedCapability &&
                          toggleRoleCapability(role, selectedCapability.id)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {selectedCapability?.riskLevel === "critical" && (
              <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-red-500">
                    High Risk Capability
                  </h4>
                  <p className="text-xs text-red-200/60">
                    Granting this capability allows unrestricted system access.
                    Ensure stringent policies are in place for any role with
                    this access.
                  </p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
