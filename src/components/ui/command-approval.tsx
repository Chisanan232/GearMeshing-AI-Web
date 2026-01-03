// src/components/ui/command-approval.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Approval, RiskLevel, runService } from "@/services";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";
import { useMCPServerRegistry } from "@/hooks/useMCPServerRegistry";

interface CommandApprovalProps {
  approval: Approval;
  runId: string;
  onApprovalResolved?: (approval: Approval) => void;
}

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case "low":
      return "border-blue-500 bg-blue-500/10";
    case "medium":
      return "border-yellow-500 bg-yellow-500/10";
    case "high":
      return "border-red-500 bg-red-500/10";
    default:
      return "border-gray-500 bg-gray-500/10";
  }
};

const getRiskIcon = (risk: RiskLevel) => {
  switch (risk) {
    case "low":
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case "medium":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "high":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export function CommandApproval({
  approval,
  runId,
  onApprovalResolved,
}: CommandApprovalProps) {
  const { removeApproval } = useUIStore();
  const MCP_SERVERS = useMCPServerRegistry();
  const [isLoading, setIsLoading] = useState(false);
  const [isDecided, setIsDecided] = useState(!!approval.decision);
  const [currentCommand, setCurrentCommand] = useState(approval.action || "");
  const [selectedServer, setSelectedServer] = useState(approval.source || "");
  const [selectedTool, setSelectedTool] = useState(approval.action || "");

  // Ensure currentCommand is updated when approval.action changes
  useEffect(() => {
    if (approval.action && !isDecided) {
      setCurrentCommand(approval.action);
      setSelectedTool(approval.action);
    }
  }, [approval.action, isDecided]);

  // Update currentCommand when selectedTool changes
  useEffect(() => {
    setCurrentCommand(selectedTool);
  }, [selectedTool]);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const result = await runService.submitApproval(runId, approval.id, {
        decision: "approved",
        action: currentCommand,
        note:
          currentCommand !== (approval.action || "")
            ? `Modified: ${currentCommand}`
            : undefined,
      });

      setIsDecided(true);
      removeApproval(approval.id);

      if (onApprovalResolved) {
        onApprovalResolved(result);
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      alert("Failed to approve. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const result = await runService.submitApproval(runId, approval.id, {
        decision: "rejected",
        note: "User rejected the approval",
      });

      setIsDecided(true);
      removeApproval(approval.id);

      if (onApprovalResolved) {
        onApprovalResolved(result);
      }
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("Failed to reject. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`border-l-4 p-4 ${getRiskColor(approval.risk)} transition-all duration-300`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {getRiskIcon(approval.risk)}
          <div>
            <div className="font-semibold text-sm">Approval Required</div>
            <div className="text-xs text-muted-foreground capitalize">
              Risk Level: {approval.risk}
            </div>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-4">
        <div className="text-xs font-medium text-muted-foreground mb-2">
          Reason:
        </div>
        <div className="text-sm bg-muted/50 rounded p-2">{approval.reason}</div>
      </div>

      {/* Capability */}
      <div className="mb-4">
        <div className="text-xs font-medium text-muted-foreground mb-2">
          Capability:
        </div>
        <div className="text-sm font-mono bg-muted/50 rounded p-2">
          {approval.capability}
        </div>
      </div>

      {/* Action Type */}
      {approval.type && (
        <div className="mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Type:
          </div>
          <div className="text-sm font-mono bg-muted/50 rounded p-2 capitalize">
            {approval.type.replace(/_/g, " ")}
          </div>
        </div>
      )}

      {/* Source (for MCP tools) */}
      {approval.source && (
        <div className="mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Source:
          </div>
          <div className="text-sm font-mono bg-muted/50 rounded p-2">
            {approval.source}
          </div>
        </div>
      )}

      {/* Editable Command/Tool (if not decided) */}
      {!isDecided && (
        <>
          {approval.type === "mcp_tool" ? (
            // MCP Tool Selection with Dropdowns
            <div className="mb-4 space-y-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  MCP Server:
                </div>
                <select
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  className="w-full h-10 px-3 bg-muted/50 rounded border border-muted-foreground/20 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    paddingRight: "28px",
                  }}
                >
                  <option value="">Select MCP Server...</option>
                  {Object.entries(MCP_SERVERS).map(([key, server]) => (
                    <option key={key} value={key}>
                      {server.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedServer &&
                MCP_SERVERS[selectedServer as keyof typeof MCP_SERVERS] && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      Tool / Resource:
                    </div>
                    <select
                      value={selectedTool}
                      onChange={(e) => setSelectedTool(e.target.value)}
                      className="w-full h-10 px-3 bg-muted/50 rounded border border-muted-foreground/20 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 8px center",
                        paddingRight: "28px",
                      }}
                    >
                      <option value="">Select Tool...</option>
                      {MCP_SERVERS[
                        selectedServer as keyof typeof MCP_SERVERS
                      ].tools.map((tool) => (
                        <option key={tool} value={tool}>
                          {tool}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
            </div>
          ) : (
            // Command Line Text Input
            <div className="mb-4">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Command (Editable):
              </div>
              <textarea
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                placeholder="Enter or modify the command here..."
                className="w-full h-24 p-3 bg-muted/50 rounded border border-muted-foreground/20 text-sm font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              {currentCommand && (
                <div className="text-xs text-muted-foreground mt-2">
                  {currentCommand.length} characters
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Status Display with Command (if decided) */}
      {isDecided && (
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-2">
            {approval.decision === "approved" ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500 font-medium">
                  Approved
                </span>
              </>
            ) : approval.decision === "rejected" ? (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500 font-medium">
                  Rejected
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-500 font-medium">
                  Expired
                </span>
              </>
            )}
          </div>

          {/* Display the executed/rejected command */}
          {currentCommand && (
            <div className="text-xs font-medium text-muted-foreground">
              Command:
            </div>
          )}
          {currentCommand && (
            <div className="text-sm font-mono bg-muted/50 rounded p-2 break-words">
              {currentCommand}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!isDecided && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={handleApprove}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Processing..." : "Approve"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Processing..." : "Reject"}
          </Button>
        </div>
      )}
    </Card>
  );
}
