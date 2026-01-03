// src/hooks/useArtifactInRunningAgent.ts
// Hook for providing demo/sample content for artifact visualization
// Used in development and testing to showcase artifact rendering capabilities

export interface ArtifactDemoContent {
  mermaidCode: string;
  originalCode: string;
  modifiedCode: string;
  spec: string;
}

/**
 * Provides demo content for artifact visualization
 * Includes: ER diagrams, code diffs, and markdown specifications
 * @returns {ArtifactDemoContent} Demo content for artifacts
 */
export function useArtifactInRunningAgent(): ArtifactDemoContent {
  const mermaidCode = `
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

  const spec = `
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

  return {
    mermaidCode,
    originalCode,
    modifiedCode,
    spec,
  };
}
