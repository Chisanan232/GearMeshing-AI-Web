// src/components/settings/activity-logs-tab.tsx
"use client";

import { useState } from "react";
import { activityLogs } from "@/lib/mock-data";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ActivityLogsTab() {
  const [riskFilter, setRiskFilter] = useState("All");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Activity Logs</h3>
        <div className="w-[180px]">
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="bg-neutral-900 border-neutral-800">
              <SelectValue placeholder="Filter by Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Risks</SelectItem>
              <SelectItem value="High">High Risk</SelectItem>
              <SelectItem value="Medium">Medium Risk</SelectItem>
              <SelectItem value="Low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={activityLogs} 
        searchKey="action"
        riskFilter={riskFilter}
      />
    </div>
  );
}
