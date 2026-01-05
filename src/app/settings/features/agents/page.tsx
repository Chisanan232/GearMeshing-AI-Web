"use client";

import { useState } from "react";
import { useGovernance } from "@/contexts/governance-context";
import { AgentRole } from "@/services/governance/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
import {
  BrainCircuit,
  Code2,
  FlaskConical,
  Bot,
  Settings2,
  Shield,
  Zap,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

// Helper to render icons dynamically
const IconMap: Record<string, LucideIcon> = {
  BrainCircuit,
  Code2,
  FlaskConical,
  Bot,
};

export default function AgentsPage() {
  const { roles, updateRole, isLoading } = useGovernance();
  const [selectedRole, setSelectedRole] = useState<AgentRole | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Local state for editing to avoid constant context updates
  const [editForm, setEditForm] = useState<AgentRole | null>(null);

  const handleEditClick = (role: AgentRole) => {
    setSelectedRole(role);
    setEditForm({ ...role }); // Deep copy if needed, but simple spread works for first level. Nested objects need care.
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editForm) {
      await updateRole(editForm);
      setIsEditing(false);
      setSelectedRole(null);
    }
  };

  const handleLLMChange = (field: string, value: string | number) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        llmConfig: {
          ...editForm.llmConfig,
          [field]: value,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-neutral-400">Loading agents...</div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
        <p className="text-neutral-400">
          Manage the specialized personas that power your development workflow.
          Each agent has its own &quot;brain&quot; (LLM) configuration and
          capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const Icon =
            role.icon && IconMap[role.icon] ? IconMap[role.icon] : Bot;
          return (
            <Card
              key={role.id}
              className="bg-neutral-900 border-neutral-800 flex flex-col"
            >
              <CardHeader className="flex-row gap-4 items-center space-y-0 pb-4">
                <div className="p-2 rounded-lg bg-neutral-800 text-primary-foreground">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{role.name}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {role.llmConfig.provider} / {role.llmConfig.model}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-neutral-300 mb-4 h-10 line-clamp-2">
                  {role.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {role.capabilities.slice(0, 3).map((cap) => (
                    <Badge
                      key={cap}
                      variant="secondary"
                      className="text-xs bg-neutral-800"
                    >
                      {cap.replace("cap_", "").replace("_", " ")}
                    </Badge>
                  ))}
                  {role.capabilities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.capabilities.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  className="w-full border-neutral-700 hover:bg-neutral-800"
                  onClick={() => handleEditClick(role)}
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent className="sm:max-w-2xl bg-neutral-900 border-neutral-800 text-neutral-50 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Configure {selectedRole?.name}</SheetTitle>
            <SheetDescription>
              Adjust the personality, intelligence, and permissions for this
              agent.
            </SheetDescription>
          </SheetHeader>

          {editForm && (
            <div className="space-y-8 py-6 px-4">
              {/* Identity Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                  Identity
                </h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="bg-neutral-950 border-neutral-800"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="bg-neutral-950 border-neutral-800"
                    />
                  </div>
                </div>
              </div>

              {/* LLM Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                  Intelligence (LLM)
                </h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Provider</Label>
                      <Select
                        value={editForm.llmConfig.provider}
                        onValueChange={(val) =>
                          handleLLMChange("provider", val)
                        }
                      >
                        <SelectTrigger className="bg-neutral-950 border-neutral-800">
                          <SelectValue placeholder="Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Model</Label>
                      <Select
                        value={editForm.llmConfig.model}
                        onValueChange={(val) => handleLLMChange("model", val)}
                      >
                        <SelectTrigger className="bg-neutral-950 border-neutral-800">
                          <SelectValue placeholder="Model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4-turbo">
                            GPT-4 Turbo
                          </SelectItem>
                          <SelectItem value="gpt-3.5-turbo">
                            GPT-3.5 Turbo
                          </SelectItem>
                          <SelectItem value="claude-3-opus">
                            Claude 3 Opus
                          </SelectItem>
                          <SelectItem value="claude-3-sonnet">
                            Claude 3 Sonnet
                          </SelectItem>
                          <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Temperature (Creativity)</Label>
                      <span className="text-sm text-neutral-400">
                        {editForm.llmConfig.temperature}
                      </span>
                    </div>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={editForm.llmConfig.temperature}
                      onChange={(e) =>
                        handleLLMChange(
                          "temperature",
                          parseFloat(e.target.value),
                        )
                      }
                      className="bg-neutral-950 border-neutral-800"
                    />
                    <p className="text-xs text-neutral-500">
                      Lower values (0.1) are more deterministic. Higher values
                      (0.9) are more creative.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                  Governance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-neutral-800 hover:bg-neutral-800 h-full py-4 flex-col items-start gap-1 whitespace-normal"
                    asChild
                  >
                    <Link href="/settings/features/capabilities">
                      <div className="flex items-center gap-2 font-semibold">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Capabilities
                      </div>
                      <span className="text-xs text-neutral-400 font-normal text-left break-words w-full">
                        Manage what this agent can do (File IO, Network, etc.)
                      </span>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-neutral-800 hover:bg-neutral-800 h-full py-4 flex-col items-start gap-1 whitespace-normal"
                    asChild
                  >
                    <Link href="/settings/features/policy">
                      <div className="flex items-center gap-2 font-semibold">
                        <Shield className="h-4 w-4 text-green-500" />
                        Policies
                      </div>
                      <span className="text-xs text-neutral-400 font-normal text-left break-words w-full">
                        Set guardrails and permission boundaries
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="pt-4 border-t border-neutral-800">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-neutral-800"
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Configuration</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
