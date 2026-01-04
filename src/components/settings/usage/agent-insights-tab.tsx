// src/components/settings/agent-insights-tab.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { agentTokenDistribution } from "@/lib/mock-data";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function AgentInsightsTab() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Token Distribution by Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={agentTokenDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {agentTokenDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "1px solid #262626",
                  borderRadius: "6px",
                }}
                itemStyle={{ color: "#e5e5e5" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Efficiency Matrix (Cost vs. Speed)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-neutral-500">
            Coming Soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
