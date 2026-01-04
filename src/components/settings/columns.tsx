// src/components/settings/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type ActivityLog = {
  id: string
  agent: string
  action: string
  risk: "High" | "Medium" | "Low"
  cost: number
  timestamp: string
}

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"))
      return <div className="text-neutral-400">{date.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "agent",
    header: "Agent",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "risk",
    header: "Risk",
    cell: ({ row }) => {
      const risk = row.getValue("risk") as string
      return (
        <Badge
          variant={
            risk === "High"
              ? "destructive"
              : risk === "Medium"
              ? "secondary"
              : "outline"
          }
        >
          {risk}
        </Badge>
      )
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]
