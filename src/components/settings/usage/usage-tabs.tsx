// src/components/settings/usage-tabs.tsx
"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./overview-tab";
import { AgentInsightsTab } from "./agent-insights-tab";
import { ActivityLogsTab } from "./activity-logs-tab";

export function UsageTabs() {
  const tabVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="agent-insights">Agent Insights</TabsTrigger>
        <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <motion.div variants={tabVariants} initial="hidden" animate="visible">
          <OverviewTab />
        </motion.div>
      </TabsContent>

      <TabsContent value="agent-insights" className="mt-6">
        <motion.div variants={tabVariants} initial="hidden" animate="visible">
          <AgentInsightsTab />
        </motion.div>
      </TabsContent>

      <TabsContent value="activity-logs" className="mt-6">
        <motion.div variants={tabVariants} initial="hidden" animate="visible">
          <ActivityLogsTab />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}
