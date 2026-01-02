// src/services/chat/schemas.ts
// Zod schemas for chat service requests and responses

import { z } from "zod";

// Base schema
const DateStringSchema = z.string().datetime();

// Chat Session schemas
export const ChatSessionReadSchema = z.object({
  id: z.number(),
  title: z.string(),
  agent_role: z.string(),
  tenant_id: z.string().optional(),
  created_at: DateStringSchema,
  updated_at: DateStringSchema,
});

export const ChatSessionCreateSchema = z.object({
  title: z.string(),
  agent_role: z.string(),
  tenant_id: z.string().optional(),
});

export const ChatSessionUpdateSchema = z.object({
  title: z.string().optional(),
  agent_role: z.string().optional(),
});

// Chat Message schemas
export const ChatMessageReadSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  created_at: DateStringSchema,
});

export const ChatMessageCreateSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

// Chat History schema
export const ChatHistoryReadSchema = z.object({
  session_id: z.number(),
  messages: z.array(ChatMessageReadSchema),
});

// Type exports
export type ChatSessionRead = z.infer<typeof ChatSessionReadSchema>;
export type ChatSessionCreate = z.infer<typeof ChatSessionCreateSchema>;
export type ChatSessionUpdate = z.infer<typeof ChatSessionUpdateSchema>;
export type ChatMessageRead = z.infer<typeof ChatMessageReadSchema>;
export type ChatMessageCreate = z.infer<typeof ChatMessageCreateSchema>;
export type ChatHistoryRead = z.infer<typeof ChatHistoryReadSchema>;
