// src/lib/mock-data.ts
import { ActivityLog } from "@/components/settings/columns";

export const usageData = [
  { date: "2024-07-01", tokens: 12000, cost: 0.12 },
  { date: "2024-07-02", tokens: 15000, cost: 0.15 },
  { date: "2024-07-03", tokens: 8000, cost: 0.08 },
  { date: "2024-07-04", tokens: 22000, cost: 0.22 },
  { date: "2024-07-05", tokens: 18000, cost: 0.18 },
  { date: "2024-07-06", tokens: 30000, cost: 0.3 },
  { date: "2024-07-07", tokens: 25000, cost: 0.25 },
];

export const agentTokenDistribution = [
  { name: "Architect", value: 45000 },
  { name: "Developer", value: 68000 },
  { name: "Product Manager", value: 15000 },
  { name: "QA", value: 22000 },
];

export const activityLogs: ActivityLog[] = [
  {
    id: "run_1",
    agent: "Developer",
    action: "Execute Shell Command",
    risk: "High",
    cost: 0.05,
    timestamp: "2024-07-07T10:00:00Z",
  },
  {
    id: "run_2",
    agent: "Architect",
    action: "Generate ER Diagram",
    risk: "Low",
    cost: 0.02,
    timestamp: "2024-07-07T09:30:00Z",
  },
  {
    id: "run_3",
    agent: "Product Manager",
    action: "Web Search",
    risk: "Medium",
    cost: 0.01,
    timestamp: "2024-07-06T15:00:00Z",
  },
  // Add more logs as needed
];
