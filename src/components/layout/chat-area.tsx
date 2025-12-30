// src/components/layout/chat-area.tsx
import { useUIStore } from "@/store/use-ui-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send, Cpu, Bot } from "lucide-react";

// 定義一個測試用的 ER Diagram
const sampleMermaidCode = `
erDiagram
    USER ||--o{ POST : writes
    USER {
        string username
        string email
    }
    POST ||--|{ COMMENT : contains
    POST {
        string title
        string content
        boolean published
    }
    COMMENT {
        string body
        date created_at
    }
`;

export function ChatArea() {
  const { openArtifact } = useUIStore();

  return (
    <div className="flex h-full flex-1 flex-col">
      {/* Chat Header */}
      <div className="flex h-14 items-center border-b px-6">
        <span className="font-medium">Agent Team: Architecture Squad</span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* User Message */}
          <div className="flex justify-end gap-3">
            <div className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
              我們需要重新設計 user table 的 schema。
            </div>
            <Avatar>
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>

          {/* AI Message with Action */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarImage src="/bot.png" />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex max-w-[80%] flex-col gap-2">
              <div className="font-semibold text-sm">Architect Agent</div>
              <div className="rounded-lg border bg-muted/50 px-4 py-2 text-sm">
                沒問題。我已經根據當前的業務需求草擬了一份新的 Schema 設計。
                <br />
                請查看右側的 ER Diagram。
              </div>

              {/* Tool / Artifact Trigger Card */}
              <Card
                className="flex items-center justify-between p-3 w-fit gap-4 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => openArtifact("diagram", { type: "mermaid" })}
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  Generated Artifact
                </div>
                <Button size="sm" variant="secondary" className="h-7 text-xs">
                  View Schema
                </Button>
              </Card>
              {/* Tool / Artifact Trigger Card */}
              <Card
                className="flex items-center justify-between p-3 w-fit gap-4 cursor-pointer hover:bg-muted/80 transition-colors border-l-4 border-l-blue-500"
                // 點擊時傳入 content
                onClick={() =>
                  openArtifact("diagram", {
                    type: "mermaid",
                    content: sampleMermaidCode,
                  })
                }
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  Generated Artifact
                </div>
                <Button size="sm" variant="secondary" className="h-7 text-xs">
                  View Schema
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="relative">
          <Input placeholder="Message to GearMeshing AI..." className="pr-12" />
          <Button
            size="icon"
            className="absolute right-1 top-1 h-8 w-8"
            variant="ghost"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
