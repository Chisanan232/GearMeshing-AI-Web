"use client";

import { useState } from "react";
import { useGovernance } from "@/contexts/governance-context";
import { Policy } from "@/services/governance/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Globe, Users, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function PolicyPage() {
  const { policies, roles, updatePolicy, isLoading } = useGovernance();
  const [activeTab, setActiveTab] = useState("global");
  const [selectedAgentId, setSelectedAgentId] = useState<string>(roles[0]?.id || "");

  // Derived state
  const globalPolicies = policies.filter(p => p.scope === "global");
  const agentPolicies = policies.filter(p => p.scope === "agent" && p.agentId === selectedAgentId);

  // Helper to toggle policy active state
  const togglePolicy = async (policy: Policy) => {
    await updatePolicy({ ...policy, isActive: !policy.isActive });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-400">Loading policies...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Policy & Guardrails</h1>
        <p className="text-neutral-400">
          Define the boundaries and safety rules for your AI agents. 
          Global policies apply to everyone, while agent-specific policies allow for granular control.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-neutral-900 border border-neutral-800">
          <TabsTrigger value="global" className="data-[state=active]:bg-neutral-800">
            <Globe className="mr-2 h-4 w-4" />
            Global Policies
          </TabsTrigger>
          <TabsTrigger value="agent" className="data-[state=active]:bg-neutral-800">
            <Users className="mr-2 h-4 w-4" />
            Agent-Specific
          </TabsTrigger>
        </TabsList>

        {/* Global Policies Tab */}
        <TabsContent value="global" className="space-y-4">
          <div className="grid gap-4">
            {globalPolicies.map((policy) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-neutral-900 border-neutral-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        {policy.name}
                      </CardTitle>
                      <CardDescription>{policy.description}</CardDescription>
                    </div>
                    <Switch 
                      checked={policy.isActive} 
                      onCheckedChange={() => togglePolicy(policy)}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 space-y-3">
                      {policy.rules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between text-sm p-2 rounded bg-neutral-950 border border-neutral-800">
                          <div className="flex items-center gap-3">
                            <Badge variant={
                              rule.action === "deny" ? "destructive" : 
                              rule.action === "require_approval" ? "default" : "secondary"
                            }>
                              {rule.action.toUpperCase().replace("_", " ")}
                            </Badge>
                            <span className="font-mono text-neutral-300">{rule.resource}</span>
                          </div>
                          {rule.conditions && (
                            <span className="text-xs text-neutral-500 font-mono">
                              {JSON.stringify(rule.conditions)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <Button variant="outline" className="w-full border-dashed border-neutral-800 hover:bg-neutral-900 text-neutral-400">
            <Plus className="mr-2 h-4 w-4" />
            Add Global Policy
          </Button>
        </TabsContent>

        {/* Agent-Specific Tab */}
        <TabsContent value="agent">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Agent Selector Sidebar */}
            <div className="w-full md:w-64 space-y-2">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 px-2">Select Agent</h3>
              <div className="flex flex-col gap-1">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedAgentId(role.id)}
                    className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedAgentId === role.id 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
              {/* Inherited Policies (Read Only) */}
              <div>
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Lock className="h-3 w-3" /> Inherited Global Policies
                </h3>
                <div className="space-y-4 opacity-75">
                  {globalPolicies.map((policy) => (
                    <div key={policy.id} className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm flex items-center gap-2">
                          <Globe className="h-3 w-3" /> {policy.name}
                        </span>
                        <Badge variant="outline" className="text-xs">Read Only</Badge>
                      </div>
                      <div className="space-y-1">
                        {policy.rules.map(rule => (
                           <div key={rule.id} className="text-xs text-neutral-500 font-mono">
                             {rule.action.toUpperCase()}: {rule.resource}
                           </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Specific Policies */}
              <div>
                 <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4 mt-8 flex items-center gap-2">
                  <Shield className="h-3 w-3" /> Agent Specific Overrides
                </h3>
                {agentPolicies.length === 0 ? (
                  <div className="text-center p-8 border border-dashed border-neutral-800 rounded-lg text-neutral-500">
                    No specific policies defined for this agent.
                    <br />
                    It will strictly follow global policies.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {agentPolicies.map((policy) => (
                      <Card key={policy.id} className="bg-neutral-900 border-neutral-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base font-medium">{policy.name}</CardTitle>
                          <Switch 
                            checked={policy.isActive} 
                            onCheckedChange={() => togglePolicy(policy)}
                          />
                        </CardHeader>
                        <CardContent>
                          <div className="mt-2 space-y-2">
                            {policy.rules.map((rule) => (
                              <div key={rule.id} className="flex items-center justify-between text-sm p-2 rounded bg-neutral-950 border border-neutral-800">
                                <span className="font-mono text-neutral-300">{rule.resource}</span>
                                <Badge variant={
                                  rule.action === "allow" ? "secondary" : "destructive" // Usually agent policies allow things global denies, or restrict further
                                }>
                                  {rule.action.toUpperCase()}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <Button className="mt-4 w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Agent Policy
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
