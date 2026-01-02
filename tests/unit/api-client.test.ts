// tests/unit/api-client.test.ts
// Tests for HTTP client utility functions and error handling

import { describe, it, expect } from "vitest";
import { APIError } from "@/lib/api-client";

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

describe("HTTPClient - Integration with Axios", () => {
  it("should export httpClient singleton", async () => {
    const { httpClient } = await import("@/lib/api-client");

    expect(httpClient).toBeDefined();
    expect(httpClient).toHaveProperty("request");
    expect(httpClient).toHaveProperty("requestWithValidation");
    expect(httpClient).toHaveProperty("streamEvents");
  });

  it("should have request method", async () => {
    const { httpClient } = await import("@/lib/api-client");

    expect(typeof httpClient.request).toBe("function");
  });

  it("should have requestWithValidation method", async () => {
    const { httpClient } = await import("@/lib/api-client");

    expect(typeof httpClient.requestWithValidation).toBe("function");
  });

  it("should have streamEvents method", async () => {
    const { httpClient } = await import("@/lib/api-client");

    expect(typeof httpClient.streamEvents).toBe("function");
  });
});
