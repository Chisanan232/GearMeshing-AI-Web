// src/components/layout/chat-area.tsx
import { useUIStore } from "@/store/use-ui-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send, Cpu, Bot, GitCompare, FileText } from "lucide-react";

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

// 模擬變更前的程式碼
const originalCode = `
export async function getUser(id: string) {
  const user = await db.user.findUnique({
    where: { id }
  });
  
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
`;

// 模擬變更後的程式碼 (Agent 加了 Cache 和 Logger)
const modifiedCode = `
import { redis } from '@/lib/redis';
import { logger } from '@/lib/logger';

export async function getUser(id: string) {
  // Try to get from cache first
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({
    where: { id }
  });
  
  if (!user) {
    logger.warn(\`User \${id} not found\`);
    throw new Error("User not found");
  }

  // Set cache for 1 hour
  await redis.setex(\`user:\${id}\`, 3600, JSON.stringify(user));
  
  return user;
}
`;

// 模擬一份完整的 Tech Spec (Markdown)
const sampleSpec = `
# Authentication System Refactor Plan

## 1. Overview
We need to migrate from basic JWT to **OAuth2 with OIDC** support to enhance security and support third-party logins (GitHub, Google).

## 2. Proposed Architecture

### Core Components
- **Auth Service**: Handles token issuance.
- **User Service**: Manages user profiles.
- **Gateway**: Validates tokens.

### Database Schema Changes
| Table | Column | Type | Description |
|-------|--------|------|-------------|
| users | provider | varchar | e.g., 'github', 'google' |
| users | provider_id | varchar | External user ID |

## 3. Implementation Steps
1. [x] Setup Auth0 or NextAuth integration.
2. [ ] Update User Schema via Prisma.
3. [ ] Implement callback handlers.

## 4. Code Example
Here is how the new callback handler should look:

\`\`\`typescript
// src/app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const code = request.url.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
  // ... exchange code for token
  return NextResponse.redirect('/dashboard');
}
\`\`\`
`;

export function ChatArea() {
  const { openArtifact } = useUIStore();

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="flex h-14 items-center border-b px-6 flex-shrink-0">
        <span className="font-medium">Agent Team: Architecture Squad</span>
      </div>

      {/* Messages - Scrollable */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-6 space-y-6">
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

          {/* Developer Agent Message - Sequential after Architect */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarFallback>Dev</AvatarFallback>
            </Avatar>
            <div className="flex max-w-[80%] flex-col gap-2">
              <div className="font-semibold text-sm">Developer Agent</div>
              <div className="rounded-lg border bg-muted/50 px-4 py-2 text-sm">
                我已經為 `getUser` 函數添加了 Redis 快取層，並優化了錯誤日誌。
                <br />
                請檢視代碼差異。
              </div>

              {/* Code Review Card */}
              <Card
                className="group flex items-center justify-between p-3 w-[280px] gap-4 cursor-pointer hover:border-purple-500 transition-all"
                onClick={() =>
                  openArtifact("code_diff", {
                    original: originalCode,
                    modified: modifiedCode,
                    language: "typescript",
                    filePath: "src/services/user-service.ts",
                  })
                }
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <GitCompare className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Review Changes</span>
                    <span className="text-xs text-muted-foreground">
                      user-service.ts
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  Open
                </Button>
              </Card>
            </div>
          </div>

          {/* Product Manager Agent Message - Sequential after Developer */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
            <div className="flex max-w-[80%] flex-col gap-2">
              <div className="font-semibold text-sm">Product Manager Agent</div>
              <div className="rounded-lg border bg-muted/50 px-4 py-2 text-sm">
                根據剛剛的討論，我整理了一份身份驗證重構的技術規格書。
                <br />
                其中包含了資料庫變更與實作步驟，請確認。
              </div>

              {/* Spec Document Card */}
              <Card
                className="group flex items-center justify-between p-3 w-[280px] gap-4 cursor-pointer hover:border-orange-500 transition-all"
                onClick={() =>
                  openArtifact("markdown", {
                    title: "Auth Refactor Spec v1.0",
                    content: sampleSpec,
                  })
                }
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Tech Spec</span>
                    <span className="text-xs text-muted-foreground">
                      Markdown Doc
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  Read
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t p-4">
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
