"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Policy } from "@/services/governance/types";

interface AddPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: "global" | "agent";
  agentId?: string; // Required if scope is "agent"
  onAdd: (policy: Policy) => Promise<void>;
}

export function AddPolicyDialog({
  open,
  onOpenChange,
  scope,
  agentId,
  onAdd,
}: AddPolicyDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    setIsSubmitting(true);

    try {
      const newPolicy: Policy = {
        id: `pol_${Date.now()}`,
        name,
        description,
        scope,
        agentId: scope === "agent" ? agentId : undefined,
        isActive: true,
        lastUpdated: new Date().toISOString(),
        rules: [], // Initialize with empty rules, or add a default one if needed
      };

      await onAdd(newPolicy);
      onOpenChange(false);
      // Reset form
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add policy", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add {scope === "global" ? "Global" : "Agent"} Policy
          </DialogTitle>
          <DialogDescription>
            Create a new policy to define boundaries and safety rules.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. No Internet Access"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this policy"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Policy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
