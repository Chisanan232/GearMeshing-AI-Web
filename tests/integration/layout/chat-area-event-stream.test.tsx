import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatArea } from "@/components/layout/chat-area";
import { useUIStore } from "@/store/use-ui-store";
import * as useRunAgentEventStreamModule from "@/hooks/useRunAgentEventStream";

// Mock the useRunAgentEventStream hook to control event data
vi.mock("@/hooks/useRunAgentEventStream", () => ({
  useRunAgentEventStream: vi.fn(),
}));

const mockUseRunAgentEventStream = vi.mocked(useRunAgentEventStreamModule.useRunAgentEventStream);

// Mock child components but keep their props for testing
vi.mock("@/components/ui/command-approval", () => ({
  CommandApproval: ({
    approval,
    onApprovalResolved,
  }: {
    approval: { id: string; reason: string };
    onApprovalResolved: (resolved: unknown) => void;
  }) => (
    <div data-testid={`command-approval-${approval.id}`}>
      <div data-testid="approval-reason">{approval.reason}</div>
      <button
        data-testid={`approve-btn-${approval.id}`}
        onClick={() => onApprovalResolved({ decision: "approved" })}
      >
        Approve
      </button>
    </div>
  ),
}));

vi.mock("@/components/chat/chat-message", () => ({
  ChatMessage: ({
    content,
    inlineApprovals,
    avatarFallback,
  }: {
    content: string;
    inlineApprovals?: Array<{ id: string }>;
    avatarFallback?: string;
  }) => (
    <div data-testid="chat-message">
      <div data-testid="message-content">{content}</div>
      {avatarFallback && (
        <div data-testid="message-avatar">{avatarFallback}</div>
      )}
      {inlineApprovals && inlineApprovals.length > 0 && (
        <div data-testid="inline-approvals">
          {inlineApprovals.map((approval) => (
            <div key={approval.id} data-testid={`inline-approval-${approval.id}`}>
              Inline Approval: {approval.id}
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
  AvatarImage: ({ src }: { src: string }) => (
    <div data-testid="avatar-image" data-src={src} />
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: { children: React.ReactNode; onClick?: () => void } & Record<
    string,
    unknown
  >) => (
    <button onClick={onClick} {...props} data-testid="button">
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div data-testid="card" onClick={onClick}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area">{children}</div>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: Record<string, unknown>) => (
    <input data-testid="input" {...props} />
  ),
}));

describe("ChatArea Integration Tests - Event Stream", () => {
  const mockOpenArtifact = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useUIStore.setState({
      pendingApprovals: [],
      openArtifact: mockOpenArtifact,
    });
  });

  describe("Artifact Rendering and Interaction (Lines 107-112)", () => {
    it("should render diagram artifact and call openArtifact with correct params", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "artifact-1",
            type: "artifact",
            artifact: {
              id: "artifact-1",
              type: "diagram",
              title: "ER Diagram",
              content: "erDiagram\n    USER ||--o{ POST",
              metadata: { filePath: "schema.mermaid" },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      const card = screen.getByTestId("card");
      fireEvent.click(card);

      expect(mockOpenArtifact).toHaveBeenCalledWith("diagram", {
        type: "mermaid",
        content: "erDiagram\n    USER ||--o{ POST",
        title: "ER Diagram",
      });
    });

    it("should render code diff artifact and call openArtifact with original/modified code (Lines 143-149)", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "artifact-2",
            type: "artifact",
            artifact: {
              id: "artifact-2",
              type: "code_diff",
              title: "Code Changes",
              content: "diff",
              metadata: {
                original: "const x = 1;",
                modified: "const x = 2;",
                language: "typescript",
                filePath: "src/index.ts",
              },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      const card = screen.getByTestId("card");
      fireEvent.click(card);

      expect(mockOpenArtifact).toHaveBeenCalledWith("code_diff", {
        original: "const x = 1;",
        modified: "const x = 2;",
        language: "typescript",
        filePath: "src/index.ts",
      });
    });

    it("should render markdown artifact and call openArtifact with title and content (Lines 189-193)", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "artifact-3",
            type: "artifact",
            artifact: {
              id: "artifact-3",
              type: "markdown",
              title: "Tech Spec",
              content: "# Technical Specification\n\nThis is a spec.",
              metadata: { filePath: "docs/spec.md" },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      const card = screen.getByTestId("card");
      fireEvent.click(card);

      expect(mockOpenArtifact).toHaveBeenCalledWith("markdown", {
        title: "Tech Spec",
        content: "# Technical Specification\n\nThis is a spec.",
      });
    });

    it("should handle code diff with missing metadata gracefully", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "artifact-4",
            type: "artifact",
            artifact: {
              id: "artifact-4",
              type: "code_diff",
              title: "Changes",
              content: "diff",
              metadata: {}, // Empty metadata
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      const card = screen.getByTestId("card");
      fireEvent.click(card);

      expect(mockOpenArtifact).toHaveBeenCalledWith("code_diff", {
        original: "",
        modified: "",
        language: "typescript",
        filePath: undefined,
      });
    });
  });

  describe("Inline Approval Rendering", () => {
    it("should render message with inline approval using ChatMessage component", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "msg-1",
            type: "message",
            message: {
              id: "msg-1",
              role: "assistant",
              agentName: "Developer",
              content: "I need to run a command",
              timestamp: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
          },
          {
            id: "approval-1",
            type: "approval",
            approval: {
              id: "approval-1",
              run_id: "run-1",
              risk: "high",
              capability: "code_execution",
              reason: "Execute migration",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 3600000).toISOString(),
              type: "command_line",
              source: "terminal",
              action: "npm install",
              metadata: { can_edit: true },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      // Should render ChatMessage with inline approval
      expect(screen.getByTestId("chat-message")).toBeInTheDocument();
      expect(screen.getByTestId("message-content")).toHaveTextContent(
        "I need to run a command"
      );
      expect(screen.getByTestId("inline-approvals")).toBeInTheDocument();
      expect(screen.getByTestId("inline-approval-approval-1")).toBeInTheDocument();
    });

    it("should not render approval twice when it's inline", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "msg-1",
            type: "message",
            message: {
              id: "msg-1",
              role: "assistant",
              agentName: "Dev",
              content: "Running command",
              timestamp: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
          },
          {
            id: "approval-1",
            type: "approval",
            approval: {
              id: "approval-1",
              run_id: "run-1",
              risk: "medium",
              capability: "code_execution",
              reason: "Deploy",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 3600000).toISOString(),
              type: "command_line",
              source: "terminal",
              action: "deploy",
              metadata: { can_edit: true },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      // Should only have one inline approval, not rendered twice
      const inlineApprovals = screen.queryAllByTestId("inline-approval-approval-1");
      expect(inlineApprovals.length).toBe(1);

      // Should not have standalone approval card
      const standaloneApprovalCards = screen.queryAllByTestId(
        "command-approval-approval-1"
      );
      expect(standaloneApprovalCards.length).toBe(0);
    });
  });

  describe("Standalone Approval Rendering and Callback (Lines 276-278)", () => {
    it("should render standalone approval when not preceded by message", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "approval-1",
            type: "approval",
            approval: {
              id: "approval-1",
              run_id: "run-1",
              risk: "high",
              capability: "code_execution",
              reason: "Execute database migration",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 3600000).toISOString(),
              type: "command_line",
              source: "terminal",
              action: "npx prisma migrate deploy",
              metadata: { can_edit: true },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      expect(screen.getByTestId("command-approval-approval-1")).toBeInTheDocument();
      expect(screen.getByTestId("approval-reason")).toHaveTextContent(
        "Execute database migration"
      );
    });

    it("should call onApprovalResolved callback when approval is resolved", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "approval-1",
            type: "approval",
            approval: {
              id: "approval-1",
              run_id: "run-1",
              risk: "medium",
              capability: "code_execution",
              reason: "Deploy service",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 3600000).toISOString(),
              type: "command_line",
              source: "deployment",
              action: "kubectl apply",
              metadata: { can_edit: true },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      const consoleSpy = vi.spyOn(console, "log");

      render(<ChatArea />);

      const approveBtn = screen.getByTestId("approve-btn-approval-1");
      fireEvent.click(approveBtn);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Approval resolved:",
        expect.objectContaining({ decision: "approved" })
      );

      consoleSpy.mockRestore();
    });

    it("should render multiple standalone approvals with different risk levels", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "approval-high",
            type: "approval",
            approval: {
              id: "approval-high",
              run_id: "run-1",
              risk: "high",
              capability: "code_execution",
              reason: "High risk operation",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 3600000).toISOString(),
              type: "command_line",
              source: "terminal",
              action: "rm -rf /",
              metadata: { can_edit: true },
            },
            timestamp: new Date().toISOString(),
          },
          {
            id: "approval-medium",
            type: "approval",
            approval: {
              id: "approval-medium",
              run_id: "run-1",
              risk: "medium",
              capability: "code_execution",
              reason: "Medium risk operation",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 3600000).toISOString(),
              type: "command_line",
              source: "terminal",
              action: "npm install",
              metadata: { can_edit: true },
            },
            timestamp: new Date().toISOString(),
          },
          {
            id: "approval-low",
            type: "approval",
            approval: {
              id: "approval-low",
              run_id: "run-1",
              risk: "low",
              capability: "shell_exec",
              reason: "Low risk operation",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 3600000).toISOString(),
              type: "command_line",
              source: "terminal",
              action: "echo hello",
              metadata: { can_edit: true },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      expect(screen.getByTestId("command-approval-approval-high")).toBeInTheDocument();
      expect(screen.getByTestId("command-approval-approval-medium")).toBeInTheDocument();
      expect(screen.getByTestId("command-approval-approval-low")).toBeInTheDocument();
    });
  });

  describe("Complex Event Stream Scenarios (Lines 286-287)", () => {
    it("should handle mixed event types in correct order", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "msg-1",
            type: "message",
            message: {
              id: "msg-1",
              role: "user",
              content: "Design the database",
              timestamp: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
          },
          {
            id: "msg-2",
            type: "message",
            message: {
              id: "msg-2",
              role: "assistant",
              agentName: "Architect",
              content: "Here is the ER diagram",
              timestamp: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
          },
          {
            id: "artifact-1",
            type: "artifact",
            artifact: {
              id: "artifact-1",
              type: "diagram",
              title: "ER Diagram",
              content: "erDiagram",
              metadata: {},
            },
            timestamp: new Date().toISOString(),
          },
          {
            id: "msg-3",
            type: "message",
            message: {
              id: "msg-3",
              role: "assistant",
              agentName: "Developer",
              content: "I need to deploy",
              timestamp: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
          },
          {
            id: "approval-1",
            type: "approval",
            approval: {
              id: "approval-1",
              run_id: "run-1",
              risk: "high",
              capability: "code_execution",
              reason: "Deploy to production",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 3600000).toISOString(),
              type: "command_line",
              source: "deployment",
              action: "kubectl apply",
              metadata: { can_edit: true },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      // Check that all event types are rendered
      expect(screen.getByTestId("chat-message")).toBeInTheDocument();
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("inline-approvals")).toBeInTheDocument();
    });

    it("should skip rendering null when approval is inline (Lines 286-287)", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "msg-1",
            type: "message",
            message: {
              id: "msg-1",
              role: "assistant",
              agentName: "Dev",
              content: "Message with approval",
              timestamp: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
          },
          {
            id: "approval-1",
            type: "approval",
            approval: {
              id: "approval-1",
              run_id: "run-1",
              risk: "medium",
              capability: "code_execution",
              reason: "Inline approval",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 3600000).toISOString(),
              type: "command_line",
              source: "terminal",
              action: "npm install",
              metadata: { can_edit: true },
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      const { container } = render(<ChatArea />);

      // Should have exactly one message with inline approval
      const messages = container.querySelectorAll("[data-testid='chat-message']");
      expect(messages.length).toBe(1);

      // Should not have standalone approval card
      const standaloneApprovals = container.querySelectorAll(
        "[data-testid^='command-approval-']"
      );
      expect(standaloneApprovals.length).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty event stream", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      const { container } = render(<ChatArea />);

      expect(screen.getByTestId("scroll-area")).toBeInTheDocument();
      expect(screen.getByTestId("input")).toBeInTheDocument();
      // No messages or approvals rendered
      expect(container.querySelectorAll("[data-testid='chat-message']").length).toBe(0);
    });

    it("should handle artifact without metadata", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "artifact-1",
            type: "artifact",
            artifact: {
              id: "artifact-1",
              type: "diagram",
              title: "Diagram",
              content: "diagram content",
              // No metadata
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      render(<ChatArea />);

      const card = screen.getByTestId("card");
      fireEvent.click(card);

      expect(mockOpenArtifact).toHaveBeenCalledWith("diagram", {
        type: "mermaid",
        content: "diagram content",
        title: "Diagram",
      });
    });

    it("should handle user message correctly", () => {
      mockUseRunAgentEventStream.mockReturnValue({
        events: [
          {
            id: "msg-1",
            type: "message",
            message: {
              id: "msg-1",
              role: "user",
              content: "User message",
              timestamp: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
          },
        ],
        messages: [],
        artifacts: [],
        approvals: [],
      });

      const { container } = render(<ChatArea />);

      // User message should not use ChatMessage component
      expect(screen.queryByTestId("chat-message")).not.toBeInTheDocument();
      // Should render as regular div
      expect(container.textContent).toContain("User message");
    });
  });
});
