"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  AgentRole,
  Capability,
  Policy,
  MCPServer,
} from "@/services/governance/types";
import { governanceService } from "@/services/governance/mock-service";

interface GovernanceContextType {
  roles: AgentRole[];
  capabilities: Capability[];
  policies: Policy[];
  mcpServers: MCPServer[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateRole: (role: AgentRole) => Promise<void>;
  updatePolicy: (policy: Policy) => Promise<void>;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(
  undefined,
);

export function GovernanceProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState<AgentRole[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [rolesData, capsData, policiesData, mcpData] = await Promise.all([
        governanceService.getRoles(),
        governanceService.getCapabilities(),
        governanceService.getPolicies(),
        governanceService.getMCPServers(),
      ]);
      setRoles(rolesData);
      setCapabilities(capsData);
      setPolicies(policiesData);
      setMcpServers(mcpData);
    } catch (error) {
      console.error("Failed to load governance data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateRole = async (updatedRole: AgentRole) => {
    // Optimistic update
    setRoles((prev) =>
      prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)),
    );
    try {
      await governanceService.updateRole(updatedRole);
    } catch (error) {
      console.error("Failed to update role", error);
      refreshData(); // Revert on failure
    }
  };

  const updatePolicy = async (updatedPolicy: Policy) => {
    // Optimistic update
    setPolicies((prev) =>
      prev.map((p) => (p.id === updatedPolicy.id ? updatedPolicy : p)),
    );
    try {
      await governanceService.updatePolicy(updatedPolicy);
    } catch (error) {
      console.error("Failed to update policy", error);
      refreshData(); // Revert on failure
    }
  };

  return (
    <GovernanceContext.Provider
      value={{
        roles,
        capabilities,
        policies,
        mcpServers,
        isLoading,
        refreshData,
        updateRole,
        updatePolicy,
      }}
    >
      {children}
    </GovernanceContext.Provider>
  );
}

export function useGovernance() {
  const context = useContext(GovernanceContext);
  if (context === undefined) {
    throw new Error("useGovernance must be used within a GovernanceProvider");
  }
  return context;
}
