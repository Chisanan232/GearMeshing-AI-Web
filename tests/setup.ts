import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock axios globally before any imports
vi.mock("axios", () => {
  const createMock = vi.fn(() => ({
    request: vi.fn(),
    interceptors: {
      response: { use: vi.fn() },
    },
  }));

  return {
    default: {
      create: createMock,
    },
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock EventSource for SSE tests
class MockEventSource {
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  close = vi.fn();
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
}

// Create a constructor function that can be spied on
const EventSourceConstructor = vi.fn(function (this: MockEventSource) {
  Object.assign(this, new MockEventSource());
} as unknown as () => void);

global.EventSource = EventSourceConstructor as unknown as typeof EventSource;

// Mock fetch globally
global.fetch = vi.fn() as unknown as typeof fetch;

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});
