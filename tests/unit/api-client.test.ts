// tests/unit/api-client.test.ts
// Tests for HTTP client utility functions and error handling

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import axios from "axios";
import { z } from "zod";
import { APIError, HTTPClient } from "@/lib/api-client";

const mockedAxios = vi.mocked(axios);

describe("APIError class", () => {
  it("should create APIError with status and detail", () => {
    const error = new APIError(404, "Not Found");

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(404);
    expect(error.detail).toBe("Not Found");
    expect(error.name).toBe("APIError");
  });

  it("should create APIError with custom message", () => {
    const error = new APIError(500, "Internal Server Error", "Custom message");

    expect(error.message).toBe("Custom message");
    expect(error.status).toBe(500);
    expect(error.detail).toBe("Internal Server Error");
  });

  it("should create APIError with default message", () => {
    const error = new APIError(400, "Bad Request");

    expect(error.message).toBe("API Error: 400 - Bad Request");
  });

  it("should be throwable and catchable", () => {
    const error = new APIError(403, "Forbidden");

    expect(() => {
      throw error;
    }).toThrow(APIError);
  });

  it("should have correct error properties for 401 Unauthorized", () => {
    const error = new APIError(401, "Unauthorized");

    expect(error.status).toBe(401);
    expect(error.detail).toBe("Unauthorized");
  });

  it("should have correct error properties for 403 Forbidden", () => {
    const error = new APIError(403, "Forbidden");

    expect(error.status).toBe(403);
    expect(error.detail).toBe("Forbidden");
  });

  it("should have correct error properties for 500 Server Error", () => {
    const error = new APIError(500, "Internal Server Error");

    expect(error.status).toBe(500);
    expect(error.detail).toBe("Internal Server Error");
  });

  it("should be catchable as Error", () => {
    const error = new APIError(404, "Not Found");

    try {
      throw error;
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(APIError);
    }
  });
});

describe("HTTPClient - Constructor and Setup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create HTTPClient with default base URL", () => {
    const mockAxiosInstance = {
      request: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };
    mockedAxios.create.mockReturnValueOnce(mockAxiosInstance);

    new HTTPClient();

    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  });

  it("should create HTTPClient with custom base URL", () => {
    const mockAxiosInstance = {
      request: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };
    mockedAxios.create.mockReturnValueOnce(mockAxiosInstance);

    new HTTPClient("http://api.example.com");

    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "http://api.example.com",
      }),
    );
  });

  it("should set up response interceptor for error handling", () => {
    const mockAxiosInstance = {
      request: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };
    mockedAxios.create.mockReturnValueOnce(mockAxiosInstance);

    new HTTPClient();

    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
  });
});

describe("HTTPClient.request() - HTTP Transport", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAxiosInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance = {
      request: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };
    mockedAxios.create.mockReturnValueOnce(mockAxiosInstance);
  });

  it("should make GET request successfully", async () => {
    const mockResponse = { status: 200, data: { id: "1", name: "Test" } };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    const result = await client.request("GET", "/api/test");

    expect(result).toEqual({ id: "1", name: "Test" });
    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "/api/test",
      }),
    );
  });

  it("should make POST request with body", async () => {
    const mockResponse = { status: 201, data: { id: "1" } };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    const body = { name: "Test" };
    const result = await client.request("POST", "/api/test", { body });

    expect(result).toEqual({ id: "1" });
    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/api/test",
        data: body,
      }),
    );
  });

  it("should make PATCH request with body", async () => {
    const mockResponse = { status: 200, data: { id: "1", name: "Updated" } };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    const body = { name: "Updated" };
    const result = await client.request("PATCH", "/api/test/1", { body });

    expect(result).toEqual({ id: "1", name: "Updated" });
    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PATCH",
        data: body,
      }),
    );
  });

  it("should make DELETE request", async () => {
    const mockResponse = { status: 204, data: undefined };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    const result = await client.request("DELETE", "/api/test/1");

    expect(result).toBeUndefined();
    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: "/api/test/1",
      }),
    );
  });

  it("should handle 204 No Content response", async () => {
    const mockResponse = { status: 204, data: null };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    const result = await client.request("DELETE", "/api/test/1");

    expect(result).toBeUndefined();
  });

  it("should convert method to uppercase", async () => {
    const mockResponse = { status: 200, data: {} };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    await client.request("get", "/api/test");

    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should use custom timeout when provided", async () => {
    const mockResponse = { status: 200, data: {} };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    await client.request("GET", "/api/test", { timeout: 5000 });

    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 5000,
      }),
    );
  });

  it("should use custom headers when provided", async () => {
    const mockResponse = { status: 200, data: {} };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    const headers = { Authorization: "Bearer token" };
    await client.request("GET", "/api/test", { headers });

    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers,
      }),
    );
  });

  it("should use custom validateStatus when provided", async () => {
    const mockResponse = { status: 200, data: {} };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    const validateStatus = (status: number) => status < 500;
    await client.request("GET", "/api/test", { validateStatus });

    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        validateStatus,
      }),
    );
  });

  it("should use default validateStatus (< 400) when not provided", async () => {
    const mockResponse = { status: 200, data: {} };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    await client.request("GET", "/api/test");

    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        validateStatus: expect.any(Function),
      }),
    );

    // Test the default validateStatus function
    const callArgs = mockAxiosInstance.request.mock.calls[0][0];
    expect(callArgs.validateStatus(200)).toBe(true);
    expect(callArgs.validateStatus(399)).toBe(true);
    expect(callArgs.validateStatus(400)).toBe(false);
  });

  it("should not include body in config when not provided", async () => {
    const mockResponse = { status: 200, data: {} };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    await client.request("GET", "/api/test");

    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.not.objectContaining({
        data: expect.anything(),
      }),
    );
  });

  it("should handle response with complex data structure", async () => {
    const complexData = {
      id: "1",
      nested: {
        field: "value",
        array: [1, 2, 3],
      },
    };
    const mockResponse = { status: 200, data: complexData };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const client = new HTTPClient();
    const result = await client.request("GET", "/api/test");

    expect(result).toEqual(complexData);
  });
});

describe("HTTPClient.requestWithValidation() - Zod Validation", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAxiosInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance = {
      request: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };
    mockedAxios.create.mockReturnValueOnce(mockAxiosInstance);
  });

  it("should validate response against Zod schema", async () => {
    const mockResponse = { status: 200, data: { id: "1", name: "Test" } };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const schema = z.object({
      id: z.string(),
      name: z.string(),
    });

    const client = new HTTPClient();
    const result = await client.requestWithValidation(
      "GET",
      "/api/test",
      schema,
    );

    expect(result).toEqual({ id: "1", name: "Test" });
  });

  it("should throw validation error for invalid response", async () => {
    const mockResponse = { status: 200, data: { id: 1, name: "Test" } }; // id should be string
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const schema = z.object({
      id: z.string(),
      name: z.string(),
    });

    const client = new HTTPClient();

    await expect(
      client.requestWithValidation("GET", "/api/test", schema),
    ).rejects.toThrow();
  });

  it("should throw validation error for missing required field", async () => {
    const mockResponse = { status: 200, data: { id: "1" } }; // missing name
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const schema = z.object({
      id: z.string(),
      name: z.string(),
    });

    const client = new HTTPClient();

    await expect(
      client.requestWithValidation("GET", "/api/test", schema),
    ).rejects.toThrow();
  });

  it("should validate array response", async () => {
    const mockResponse = {
      status: 200,
      data: [
        { id: "1", name: "Test1" },
        { id: "2", name: "Test2" },
      ],
    };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const schema = z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    );

    const client = new HTTPClient();
    const result = await client.requestWithValidation(
      "GET",
      "/api/test",
      schema,
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("should validate nested objects", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: "1",
        user: {
          name: "John",
          email: "john@example.com",
        },
      },
    };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const schema = z.object({
      id: z.string(),
      user: z.object({
        name: z.string(),
        email: z.string(),
      }),
    });

    const client = new HTTPClient();
    const result = await client.requestWithValidation(
      "GET",
      "/api/test",
      schema,
    );

    expect(result.user.name).toBe("John");
  });

  it("should pass request options to underlying request method", async () => {
    const mockResponse = { status: 200, data: { id: "1" } };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const schema = z.object({ id: z.string() });
    const options = { timeout: 5000 };

    const client = new HTTPClient();
    await client.requestWithValidation("GET", "/api/test", schema, options);

    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 5000,
      }),
    );
  });

  it("should validate POST request with body", async () => {
    const mockResponse = { status: 201, data: { id: "1", name: "Created" } };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const schema = z.object({
      id: z.string(),
      name: z.string(),
    });

    const client = new HTTPClient();
    const result = await client.requestWithValidation(
      "POST",
      "/api/test",
      schema,
      { body: { name: "Created" } },
    );

    expect(result).toEqual({ id: "1", name: "Created" });
  });

  it("should validate optional fields", async () => {
    const mockResponse = { status: 200, data: { id: "1" } };
    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const schema = z.object({
      id: z.string(),
      description: z.string().optional(),
    });

    const client = new HTTPClient();
    const result = await client.requestWithValidation(
      "GET",
      "/api/test",
      schema,
    );

    expect(result).toEqual({ id: "1" });
  });
});

describe("HTTPClient.streamEvents() - SSE Streaming", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAxiosInstance: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockEventSource: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance = {
      request: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };
    mockedAxios.create.mockReturnValueOnce(mockAxiosInstance);

    // Mock EventSource - override the global one
    mockEventSource = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onmessage: null as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onerror: null as any,
      close: vi.fn(),
    };
    // Replace the global EventSource with a proper constructor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.EventSource = vi.fn(function (this: any) {
      Object.assign(this, mockEventSource);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create EventSource with correct URL", () => {
    const client = new HTTPClient("http://localhost:8000");
    const onEvent = vi.fn();

    client.streamEvents("/api/events", onEvent);

    expect(global.EventSource).toHaveBeenCalledWith(
      "http://localhost:8000/api/events",
    );
  });

  it("should call onEvent when message is received", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();

    client.streamEvents("/api/events", onEvent);

    // Get the onmessage callback that was set by streamEvents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onmessageCallback = (global.EventSource as any).mock.results[0].value
      .onmessage;

    // Simulate message event
    const event = new Event("message");
    Object.defineProperty(event, "data", {
      value: JSON.stringify({ type: "test", data: "hello" }),
    });
    onmessageCallback(event);

    expect(onEvent).toHaveBeenCalledWith({ type: "test", data: "hello" });
  });

  it("should handle multiple messages", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();

    client.streamEvents("/api/events", onEvent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onmessageCallback = (global.EventSource as any).mock.results[0].value
      .onmessage;

    // First message
    let event = new Event("message");
    Object.defineProperty(event, "data", {
      value: JSON.stringify({ id: 1 }),
    });
    onmessageCallback(event);

    // Second message
    event = new Event("message");
    Object.defineProperty(event, "data", {
      value: JSON.stringify({ id: 2 }),
    });
    onmessageCallback(event);

    expect(onEvent).toHaveBeenCalledTimes(2);
    expect(onEvent).toHaveBeenNthCalledWith(1, { id: 1 });
    expect(onEvent).toHaveBeenNthCalledWith(2, { id: 2 });
  });

  it("should handle invalid JSON gracefully", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    client.streamEvents("/api/events", onEvent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onmessageCallback = (global.EventSource as any).mock.results[0].value
      .onmessage;

    // Simulate invalid JSON message
    const event = new Event("message");
    Object.defineProperty(event, "data", {
      value: "invalid json {",
    });
    onmessageCallback(event);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(onEvent).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("should call onError when error occurs", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();
    const onError = vi.fn();

    client.streamEvents("/api/events", onEvent, onError);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onerrorCallback = (global.EventSource as any).mock.results[0].value
      .onerror;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const closeMethod = (global.EventSource as any).mock.results[0].value.close;

    // Simulate error event
    onerrorCallback();

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(closeMethod).toHaveBeenCalled();
  });

  it("should close EventSource on error when onError not provided", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();

    client.streamEvents("/api/events", onEvent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onerrorCallback = (global.EventSource as any).mock.results[0].value
      .onerror;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const closeMethod = (global.EventSource as any).mock.results[0].value.close;

    // Simulate error event
    onerrorCallback();

    expect(closeMethod).toHaveBeenCalled();
  });

  it("should return unsubscribe function", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();

    const unsubscribe = client.streamEvents("/api/events", onEvent);

    expect(typeof unsubscribe).toBe("function");
  });

  it("should close EventSource when unsubscribe is called", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();

    const unsubscribe = client.streamEvents("/api/events", onEvent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const closeMethod = (global.EventSource as any).mock.results[0].value.close;
    unsubscribe();

    expect(closeMethod).toHaveBeenCalled();
  });

  it("should handle complex nested JSON events", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();

    client.streamEvents("/api/events", onEvent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onmessageCallback = (global.EventSource as any).mock.results[0].value
      .onmessage;

    const complexData = {
      type: "artifact.created",
      payload: {
        id: "artifact-1",
        content: {
          type: "mermaid",
          data: "graph TD; A-->B",
        },
      },
    };

    const event = new Event("message");
    Object.defineProperty(event, "data", {
      value: JSON.stringify(complexData),
    });
    onmessageCallback(event);

    expect(onEvent).toHaveBeenCalledWith(complexData);
  });

  it("should handle empty JSON object", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();

    client.streamEvents("/api/events", onEvent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onmessageCallback = (global.EventSource as any).mock.results[0].value
      .onmessage;

    const event = new Event("message");
    Object.defineProperty(event, "data", {
      value: JSON.stringify({}),
    });
    onmessageCallback(event);

    expect(onEvent).toHaveBeenCalledWith({});
  });

  it("should handle array in JSON event", () => {
    const client = new HTTPClient();
    const onEvent = vi.fn();

    client.streamEvents("/api/events", onEvent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onmessageCallback = (global.EventSource as any).mock.results[0].value
      .onmessage;

    const event = new Event("message");
    Object.defineProperty(event, "data", {
      value: JSON.stringify([1, 2, 3]),
    });
    onmessageCallback(event);

    expect(onEvent).toHaveBeenCalledWith([1, 2, 3]);
  });
});

describe("HTTPClient - Error Interceptor", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAxiosInstance: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let errorHandler: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance = {
      request: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn((success, error) => {
            errorHandler = error;
          }),
        },
      },
    };
    mockedAxios.create.mockReturnValueOnce(mockAxiosInstance);
  });

  it("should pass through successful responses", () => {
    new HTTPClient();
    const response = { status: 200, data: {} };

    const result =
      mockAxiosInstance.interceptors.response.use.mock.calls[0][0](response);

    expect(result).toEqual(response);
  });

  it("should convert error response to APIError", () => {
    new HTTPClient();

    const axiosError = {
      response: {
        status: 404,
        data: { detail: "Not Found" },
      },
      message: "Request failed",
    };

    expect(() => {
      errorHandler(axiosError);
    }).toThrow(APIError);
  });

  it("should extract detail from error response", () => {
    new HTTPClient();

    const axiosError = {
      response: {
        status: 400,
        data: { detail: "Invalid input" },
      },
      message: "Request failed",
    };

    try {
      errorHandler(axiosError);
    } catch (e) {
      expect(e).toBeInstanceOf(APIError);
      expect((e as APIError).detail).toBe("Invalid input");
    }
  });

  it("should use error message when detail not available", () => {
    new HTTPClient();

    const axiosError = {
      response: {
        status: 500,
        data: {},
      },
      message: "Internal Server Error",
    };

    try {
      errorHandler(axiosError);
    } catch (e) {
      expect((e as APIError).detail).toBe("Internal Server Error");
    }
  });

  it("should use default message when neither detail nor message available", () => {
    new HTTPClient();

    const axiosError = {
      response: {
        status: 500,
        data: {},
      },
      message: undefined,
    };

    try {
      errorHandler(axiosError);
    } catch (e) {
      expect((e as APIError).detail).toBe("Unknown error");
    }
  });

  it("should use 500 status when response not available", () => {
    new HTTPClient();

    const axiosError = {
      response: undefined,
      message: "Network error",
    };

    try {
      errorHandler(axiosError);
    } catch (e) {
      expect((e as APIError).status).toBe(500);
    }
  });

  it("should handle various HTTP error statuses", () => {
    new HTTPClient();

    const statuses = [400, 401, 403, 404, 500, 502, 503];

    statuses.forEach((status) => {
      const axiosError = {
        response: {
          status,
          data: { detail: `Error ${status}` },
        },
        message: "Request failed",
      };

      try {
        errorHandler(axiosError);
      } catch (e) {
        expect((e as APIError).status).toBe(status);
      }
    });
  });
});
