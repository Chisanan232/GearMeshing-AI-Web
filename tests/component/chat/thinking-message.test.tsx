// tests/component/chat/thinking-message.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { ThinkingMessage } from "@/components/chat/thinking-message";
import { describe, it, expect, vi } from "vitest";

describe("ThinkingMessage", () => {
  const defaultProps = {
    id: "thinking-1",
    content: "This is a thinking message",
    isStreaming: false,
  };

  it("should render thinking message container", () => {
    render(<ThinkingMessage {...defaultProps} />);
    expect(screen.getByText(/Agent is thinking/i)).toBeInTheDocument();
  });

  it("should display thinking content", async () => {
    render(<ThinkingMessage {...defaultProps} />);

    // Wait for content to stream in (with timeout for streaming animation)
    await waitFor(
      () => {
        expect(screen.getByText(/This is a thinking message/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("should be expanded by default", () => {
    const { container } = render(<ThinkingMessage {...defaultProps} />);

    // Check if expanded content is visible
    const expandedContent = container.querySelector("[class*='bg-violet']");
    expect(expandedContent).toBeInTheDocument();
  });

  it("should toggle expansion on button click", () => {
    const { container, rerender } = render(
      <ThinkingMessage {...defaultProps} />
    );

    const button = screen.getByText(/Agent is thinking/i);

    // Initially expanded, so content should be visible
    let expandedContent = container.querySelector("[class*='border-violet-500/20']");
    expect(expandedContent).toBeInTheDocument();

    // Click to collapse
    button.click();

    rerender(<ThinkingMessage {...defaultProps} />);

    // After collapse, expanded content should not be visible
    expandedContent = container.querySelector("[class*='border-violet-500/20']");
    expect(expandedContent).not.toBeInTheDocument();
  });

  it("should show streaming indicator when isStreaming is true", () => {
    render(<ThinkingMessage {...defaultProps} isStreaming={true} />);

    expect(screen.getByText(/Streaming.../i)).toBeInTheDocument();
  });

  it("should show completion indicator when not streaming", async () => {
    render(<ThinkingMessage {...defaultProps} isStreaming={false} />);

    await waitFor(() => {
      expect(screen.getByText(/Thinking complete/i)).toBeInTheDocument();
    });
  });

  it("should have pulsing indicator", () => {
    const { container } = render(<ThinkingMessage {...defaultProps} />);

    const pulsingElement = container.querySelector("[style*='animation']");
    expect(pulsingElement).toBeInTheDocument();
  });

  it("should display Zap icon", () => {
    const { container } = render(<ThinkingMessage {...defaultProps} />);

    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("should handle long thinking content", async () => {
    const longContent = "This is a very long thinking message. ".repeat(10);

    render(<ThinkingMessage {...defaultProps} content={longContent} />);

    await waitFor(
      () => {
        expect(screen.getByText(new RegExp(longContent.substring(0, 30)))).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("should call onComplete when thinking finishes", async () => {
    const onComplete = vi.fn();

    render(
      <ThinkingMessage
        {...defaultProps}
        isStreaming={false}
        onComplete={onComplete}
      />
    );

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(defaultProps.id);
    });
  });

  it("should not call onComplete while streaming", () => {
    const onComplete = vi.fn();

    render(
      <ThinkingMessage
        {...defaultProps}
        isStreaming={true}
        onComplete={onComplete}
      />
    );

    // onComplete should not be called while streaming
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("should display multiline thinking content correctly", async () => {
    const multilineContent = `First line of thinking
Second line of thinking
Third line of thinking`;

    render(
      <ThinkingMessage {...defaultProps} content={multilineContent} />
    );

    await waitFor(() => {
      expect(screen.getByText(/First line of thinking/)).toBeInTheDocument();
    });
  });

  it("should have proper styling for violet theme", () => {
    const { container } = render(<ThinkingMessage {...defaultProps} />);

    const button = container.querySelector("button");
    expect(button).toHaveClass("text-violet-300");
    expect(button).toHaveClass("border-violet-500/30");
  });

  it("should render with different content", async () => {
    const { rerender } = render(<ThinkingMessage {...defaultProps} />);

    const newContent = "Different thinking content";
    rerender(
      <ThinkingMessage {...defaultProps} content={newContent} />
    );

    // Content should update (wait for streaming)
    await waitFor(
      () => {
        expect(screen.getByText(/Different thinking content/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("should handle empty content", () => {
    render(<ThinkingMessage {...defaultProps} content="" />);

    expect(screen.getByText(/Agent is thinking/i)).toBeInTheDocument();
  });

  it("should display bouncing dots animation when streaming", () => {
    const { container } = render(
      <ThinkingMessage {...defaultProps} isStreaming={true} />
    );

    const bouncingDots = container.querySelectorAll("[class*='animate-bounce']");
    expect(bouncingDots.length).toBeGreaterThan(0);
  });

  it("should have proper spacing and layout", () => {
    const { container } = render(<ThinkingMessage {...defaultProps} />);

    const mainDiv = container.querySelector("[class*='flex gap-3']");
    expect(mainDiv).toBeInTheDocument();
  });
});
