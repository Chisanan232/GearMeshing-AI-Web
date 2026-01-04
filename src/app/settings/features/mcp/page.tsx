"use client";

import { useState } from "react";
import { useGovernance } from "@/contexts/governance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Server, Activity, Wrench, RefreshCw, Plus, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function MCPSettingsPage() {
  const { mcpServers, refreshData, isLoading } = useGovernance();
  const [isAdding, setIsAdding] = useState(false);
  const [newServerUrl, setNewServerUrl] = useState("");

  const handleAddServer = async () => {
    // In a real app, this would call an API to validate and add the server
    setIsAdding(false);
    setNewServerUrl("");
    await refreshData();
  };

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-400">Loading MCP servers...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">MCP Servers</h1>
        <p className="text-neutral-400">
          Manage connections to Model Context Protocol (MCP) servers. 
          These provide external tools and data context to your agents.
        </p>
      </div>

      <div className="grid gap-6">
        {mcpServers.map((server) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    server.status === "connected" 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-neutral-800 text-neutral-500"
                  }`}>
                    <Server className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {server.name}
                      <Badge variant="outline" className={`ml-2 text-xs font-normal ${
                         server.status === "connected" ? "border-green-900 text-green-500" : "border-neutral-700 text-neutral-500"
                      }`}>
                        {server.status === "connected" ? (
                          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Connected</span>
                        ) : (
                          <span className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Disconnected</span>
                        )}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">
                      {server.url}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" onClick={() => refreshData()}>
                    <RefreshCw className="h-4 w-4 text-neutral-400" />
                   </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mt-2">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                      <Wrench className="h-3 w-3" /> Tools Provided
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {server.tools.map(tool => (
                        <Badge key={tool} variant="secondary" className="bg-neutral-950 border-neutral-800 font-mono">
                          {tool}
                        </Badge>
                      ))}
                      {server.tools.length === 0 && (
                        <span className="text-sm text-neutral-500 italic">No tools advertised</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                     <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                      <Activity className="h-3 w-3" /> Health
                    </h4>
                    <div className="text-sm text-neutral-300 grid grid-cols-2 gap-2">
                      <span className="text-neutral-500">Last Heartbeat:</span>
                      <span className="font-mono">{server.lastHeartbeat ? new Date(server.lastHeartbeat).toLocaleString() : "Never"}</span>
                      
                      <span className="text-neutral-500">Latency:</span>
                      <span className="font-mono text-green-500">24ms</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add Server Placeholder */}
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-auto py-8 border-dashed border-neutral-800 hover:bg-neutral-900 flex flex-col gap-2">
              <div className="p-2 rounded-full bg-neutral-800">
                <Plus className="h-6 w-6 text-neutral-400" />
              </div>
              <span className="font-medium">Connect New MCP Server</span>
              <span className="text-xs text-neutral-500 font-normal">Add a local or remote MCP endpoint</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-50">
            <DialogHeader>
              <DialogTitle>Connect MCP Server</DialogTitle>
              <DialogDescription>
                Enter the URL of the Model Context Protocol server you wish to connect.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Server URL</Label>
                <Input 
                  placeholder="http://localhost:3000/mcp" 
                  value={newServerUrl}
                  onChange={(e) => setNewServerUrl(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 font-mono"
                />
              </div>
              <div className="bg-yellow-950/20 border border-yellow-900/50 p-3 rounded text-xs text-yellow-200/70 flex gap-2">
                <Activity className="h-4 w-4 shrink-0" />
                This feature is currently simulated in the mock environment. 
                Adding a server will not actually establish a connection.
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdding(false)} className="border-neutral-800">Cancel</Button>
              <Button onClick={handleAddServer}>Connect Server</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
