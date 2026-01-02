// src/components/ui/command-approval.tsx
"use client";

import React, { useState } from "react";
import { Approval, RiskLevel, runService } from "@/services";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isDecided, setIsDecided] = useState(!!approval.decision);
  const [editedCommand, setEditedCommand] = useState("");

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const result = await runService.submitApproval(runId, approval.id, {
        decision: "approved",
        note: editedCommand ? `Modified command: ${editedCommand}` : undefined,
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

      {/* Editable Command (if not decided) */}
      {!isDecided && (
        <div className="mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Command (Editable):
          </div>
          <textarea
            value={editedCommand}
            onChange={(e) => setEditedCommand(e.target.value)}
            placeholder="Enter or modify the command here..."
            className="w-full h-24 p-2 bg-muted/50 rounded border border-muted-foreground/20 text-sm font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Status Display (if decided) */}
      {isDecided && (
        <div className="mb-4 flex items-center gap-2">
          {approval.decision === "approved" ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">Approved</span>
            </>
          ) : approval.decision === "rejected" ? (
            <>
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500">Rejected</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-500">Expired</span>
            </>
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
