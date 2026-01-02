// src/services/chat/chat.service.ts
// Domain service for chat management - pure functions, no state

import { httpClient } from "@/lib/api-client";
import { z } from "zod";
import {
  ChatSessionReadSchema,
  ChatMessageReadSchema,
  ChatHistoryReadSchema,
  ChatSessionRead,
  ChatSessionCreate,
  ChatSessionUpdate,
  ChatMessageCreate,
  ChatMessageRead,
  ChatHistoryRead,
} from "./schemas";

export const chatService = {
  // Chat Sessions
  async createChatSession(data: ChatSessionCreate): Promise<ChatSessionRead> {
    return httpClient.requestWithValidation(
      "POST",
      "/api/v1/chat-sessions",
      ChatSessionReadSchema,
      { body: data },
    );
  },

  async listChatSessions(params?: {
    tenant_id?: string;
    active_only?: boolean;
  }): Promise<ChatSessionRead[]> {
    const query = new URLSearchParams();
    if (params?.tenant_id) query.append("tenant_id", params.tenant_id);
    if (params?.active_only !== undefined)
      query.append("active_only", params.active_only.toString());

    const path = `/api/v1/chat-sessions${query.toString() ? "?" + query.toString() : ""}`;
    return httpClient.requestWithValidation(
      "GET",
      path,
      z.array(ChatSessionReadSchema),
    );
  },

  async getChatSession(sessionId: number): Promise<ChatSessionRead> {
    return httpClient.requestWithValidation(
      "GET",
      `/api/v1/chat-sessions/${sessionId}`,
      ChatSessionReadSchema,
    );
  },

  async updateChatSession(
    sessionId: number,
    data: ChatSessionUpdate,
  ): Promise<ChatSessionRead> {
    return httpClient.requestWithValidation(
      "PATCH",
      `/api/v1/chat-sessions/${sessionId}`,
      ChatSessionReadSchema,
      { body: data },
    );
  },

  async deleteChatSession(sessionId: number): Promise<void> {
    return httpClient.request("DELETE", `/api/v1/chat-sessions/${sessionId}`);
  },

  // Chat Messages
  async addMessage(
    sessionId: number,
    data: ChatMessageCreate,
  ): Promise<ChatMessageRead> {
    return httpClient.requestWithValidation(
      "POST",
      `/api/v1/chat-sessions/${sessionId}/messages`,
      ChatMessageReadSchema,
      { body: data },
    );
  },

  async getMessages(
    sessionId: number,
    params?: { limit?: number; offset?: number },
  ): Promise<ChatMessageRead[]> {
    const query = new URLSearchParams();
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.offset) query.append("offset", params.offset.toString());

    const path = `/api/v1/chat-sessions/${sessionId}/messages${query.toString() ? "?" + query.toString() : ""}`;
    return httpClient.requestWithValidation(
      "GET",
      path,
      z.array(ChatMessageReadSchema),
    );
  },

  async getChatHistory(sessionId: number): Promise<ChatHistoryRead> {
    return httpClient.requestWithValidation(
      "GET",
      `/api/v1/chat-sessions/${sessionId}/history`,
      ChatHistoryReadSchema,
    );
  },

  async deleteMessage(sessionId: number, messageId: number): Promise<void> {
    return httpClient.request(
      "DELETE",
      `/api/v1/chat-sessions/${sessionId}/messages/${messageId}`,
    );
  },
};
