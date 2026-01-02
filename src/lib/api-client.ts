// src/lib/api-client.ts
// HTTP transport layer using axios - no domain logic, no state

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { z } from "zod";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  validateStatus?: (status: number) => boolean;
}

export class APIError extends Error {
  constructor(
    public status: number,
    public detail: string,
    message?: string,
  ) {
    super(message || `API Error: ${status} - ${detail}`);
    this.name = "APIError";
  }
}

export class HTTPClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds default timeout
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status || 500;
        const detail =
          (error.response?.data as Record<string, unknown>)?.detail ||
          error.message ||
          "Unknown error";

        throw new APIError(status, String(detail), error.message);
      },
    );
  }

  async request<T>(
    method: string,
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method: method.toUpperCase(),
      url: path,
      timeout: options?.timeout,
      headers: options?.headers,
      validateStatus: options?.validateStatus || ((status) => status < 400),
    };

    if (options?.body) {
      config.data = options.body;
    }

    const response = await this.axiosInstance.request<T>(config);

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.data;
  }

  /**
   * Validate response data against a Zod schema
   * Throws validation error if data doesn't match schema
   */
  async requestWithValidation<T>(
    method: string,
    path: string,
    schema: z.ZodSchema<T>,
    options?: RequestOptions,
  ): Promise<T> {
    const data = await this.request<unknown>(method, path, options);
    return schema.parse(data);
  }

  streamEvents(
    path: string,
    onEvent: (data: unknown) => void,
    onError?: (error: Error) => void,
  ): () => void {
    const url = `${this.baseURL}${path}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent(data);
      } catch (error) {
        console.error("Failed to parse SSE event:", error);
      }
    };

    eventSource.onerror = () => {
      if (onError) {
        onError(new Error("SSE connection error"));
      }
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }
}

export const httpClient = new HTTPClient();
