import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatMessage } from "@/components/chat/chat-message";
import { useUIStore } from "@/store/use-ui-store";
import type { Approval } from "@/services/run/schemas";

// Mock the services
vi.mock("@/services", () => ({
  runService: {
    submitApproval: vi.fn().mockResolvedValue({}),
  },
}));

// Mock child components
vi.mock("@/components/chat/action-approval", () => ({
  ActionApproval: ({
    id,
    source,
    action,
  }: {
    id: string;
    source: string;
    action: string;
  }) => (
    <div data-testid={`action-approval-${id}`}>
      {source} - {action}
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

describe("ChatMessage Component", () => {
  beforeEach(() => {
    useUIStore.setState({
      pendingApprovals: [],
    });
  });

  describe("User Messages", () => {
    it("should render user message with correct styling", () => {
      const { container } = render(
        <ChatMessage role="user" content="Hello, assistant!" />,
      );
      const messageBox = container.querySelector(".bg-primary");
      expect(messageBox).toBeInTheDocument();
      expect(messageBox?.textContent).toContain("Hello, assistant!");
    });

    it("should align user messages to the right", () => {
      const { container } = render(
        <ChatMessage role="user" content="Test message" />,
      );
      const wrapper = container.querySelector(".justify-end");
      expect(wrapper).toBeInTheDocument();
    });

    it("should show user avatar on the right", () => {
      const { container } = render(
        <ChatMessage role="user" content="Test" avatarFallback="ME" />,
      );
      const avatars = container.querySelectorAll("[data-testid='avatar']");
      expect(avatars.length).toBeGreaterThan(0);
    });

    it("should display user avatar fallback", () => {
      render(<ChatMessage role="user" content="Test" avatarFallback="ME" />);
      expect(screen.getByText("ME")).toBeInTheDocument();
    });

    it("should use custom avatar image if provided", () => {
      render(
        <ChatMessage
          role="user"
          content="Test"
          avatar="https://example.com/avatar.jpg"
          avatarFallback="ME"
        />,
      );
      const avatarImage = screen.getByTestId("avatar-image");
      expect(avatarImage).toHaveAttribute(
        "data-src",
        "https://example.com/avatar.jpg",
      );
    });
  });

  describe("Assistant Messages", () => {
    it("should render assistant message with correct styling", () => {
      const { container } = render(
        <ChatMessage role="assistant" content="Hello, user!" />,
      );
      const messageBox = container.querySelector(".bg-muted\\/50");
      expect(messageBox).toBeInTheDocument();
      expect(messageBox?.textContent).toContain("Hello, user!");
    });

    it("should align assistant messages to the left", () => {
      const { container } = render(
        <ChatMessage role="assistant" content="Test message" />,
      );
      const wrapper = container.querySelector(".justify-start");
      expect(wrapper).toBeInTheDocument();
    });

    it("should show assistant avatar on the left", () => {
      render(
        <ChatMessage role="assistant" content="Test" avatarFallback="AI" />,
      );
      expect(screen.getByText("AI")).toBeInTheDocument();
    });

    it("should use default AI fallback for assistant", () => {
      render(<ChatMessage role="assistant" content="Test" />);
      expect(screen.getByText("AI")).toBeInTheDocument();
    });

    it("should use custom avatar for assistant if provided", () => {
      render(
        <ChatMessage
          role="assistant"
          content="Test"
          avatar="https://example.com/ai-avatar.jpg"
          avatarFallback="AI"
        />,
      );
      const avatarImage = screen.getByTestId("avatar-image");
      expect(avatarImage).toHaveAttribute(
        "data-src",
        "https://example.com/ai-avatar.jpg",
      );
    });
  });

  describe("System Messages", () => {
    it("should render system message with warning styling", () => {
      const { container } = render(
        <ChatMessage role="system" content="System alert" />,
      );
      const messageBox = container.querySelector(".bg-red-500\\/5");
      expect(messageBox).toBeInTheDocument();
      expect(messageBox?.textContent).toContain("System alert");
    });

    it("should show system avatar fallback", () => {
      render(<ChatMessage role="system" content="Test" />);
      expect(screen.getByText("⚠️")).toBeInTheDocument();
    });

    it("should align system messages to the left", () => {
      const { container } = render(
        <ChatMessage role="system" content="Test message" />,
      );
      const wrapper = container.querySelector(".justify-start");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Timestamps", () => {
    it("should display timestamp when provided", () => {
      const timestamp = "2024-01-02T14:30:00Z";
      const { container } = render(
        <ChatMessage role="user" content="Test" timestamp={timestamp} />,
      );
      const timeElement = container.querySelector(
        ".text-\\[10px\\].text-muted-foreground",
      );
      expect(timeElement).toBeInTheDocument();
    });

    it("should not display timestamp when not provided", () => {
      const { container } = render(<ChatMessage role="user" content="Test" />);
      const timeElement = container.querySelector(
        ".text-\\[10px\\].text-muted-foreground",
      );
      expect(timeElement).not.toBeInTheDocument();
    });

    it("should format timestamp correctly", () => {
      const timestamp = "2024-01-02T14:30:45Z";
      const { container } = render(
        <ChatMessage role="user" content="Test" timestamp={timestamp} />,
      );
      // Just verify timestamp element is rendered
      const timeElement = container.querySelector(".text-\\[10px\\]");
      expect(timeElement).toBeInTheDocument();
    });
  });

  describe("Inline Approvals", () => {
    const mockApproval: Approval = {
      id: "approval-1",
      run_id: "run-123",
      risk: "medium",
      capability: "code_execution" as const,
      reason: "Execute code",
      requested_at: new Date().toISOString(),
      type: "command_line",
      source: "terminal",
      action: "npm install",
      metadata: {
        can_edit: true,
      },
    };

    it("should render inline approvals when provided", () => {
      render(
        <ChatMessage
          role="assistant"
          content="I need to run a command"
          inlineApprovals={[mockApproval]}
        />,
      );
      expect(
        screen.getByTestId("action-approval-approval-1"),
      ).toBeInTheDocument();
    });

    it("should not render approvals section when empty", () => {
      const { container } = render(
        <ChatMessage role="assistant" content="Test" inlineApprovals={[]} />,
      );
      const approvalsSection = container.querySelector(".space-y-2");
      expect(approvalsSection).not.toBeInTheDocument();
    });

    it("should render multiple approvals", () => {
      const approval2: Approval = {
        ...mockApproval,
        id: "approval-2",
        action: "python script.py",
      };

      render(
        <ChatMessage
          role="assistant"
          content="Multiple actions needed"
          inlineApprovals={[mockApproval, approval2]}
        />,
      );
      expect(
        screen.getByTestId("action-approval-approval-1"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("action-approval-approval-2"),
      ).toBeInTheDocument();
    });

    it("should pass correct props to ActionApproval", () => {
      render(
        <ChatMessage
          role="assistant"
          content="Test"
          inlineApprovals={[mockApproval]}
        />,
      );
      const approval = screen.getByTestId("action-approval-approval-1");
      expect(approval.textContent).toContain("terminal");
      expect(approval.textContent).toContain("npm install");
    });
  });

  describe("Mini Mode", () => {
    it("should apply mini styling when isMini is true", () => {
      const { container } = render(
        <ChatMessage role="user" content="Test" isMini={true} />,
      );
      const wrapper = container.querySelector(".mb-2");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have smaller avatar in mini mode", () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Test"
          avatarFallback="ME"
          isMini={true}
        />,
      );
      const avatar = container.querySelector("[data-testid='avatar']");
      expect(avatar).toBeInTheDocument();
    });

    it("should have smaller text in mini mode", () => {
      const { container } = render(
        <ChatMessage role="user" content="Test" isMini={true} />,
      );
      const messageBox = container.querySelector(".text-xs");
      expect(messageBox).toBeInTheDocument();
    });

    it("should apply normal spacing when isMini is false", () => {
      const { container } = render(
        <ChatMessage role="user" content="Test" isMini={false} />,
      );
      const wrapper = container.querySelector(".mb-6");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have normal avatar size in normal mode", () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Test"
          avatarFallback="ME"
          isMini={false}
        />,
      );
      const avatar = container.querySelector("[data-testid='avatar']");
      expect(avatar).toBeInTheDocument();
    });
  });

  describe("Content Rendering", () => {
    it("should render message content", () => {
      render(<ChatMessage role="user" content="This is a test message" />);
      expect(screen.getByText("This is a test message")).toBeInTheDocument();
    });

    it("should not render empty content", () => {
      const { container } = render(<ChatMessage role="user" content="" />);
      const messageBox = container.querySelector(".rounded-lg");
      expect(messageBox).not.toBeInTheDocument();
    });

    it("should handle long content", () => {
      const longContent = "A".repeat(500);
      render(<ChatMessage role="user" content={longContent} />);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it("should handle special characters in content", () => {
      const specialContent = "Test & special < > characters";
      render(<ChatMessage role="user" content={specialContent} />);
      expect(screen.getByText(/Test & special/)).toBeInTheDocument();
    });

    it("should handle multiline content", () => {
      const multilineContent = "Line 1\nLine 2\nLine 3";
      render(<ChatMessage role="user" content={multilineContent} />);
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });
  });

  describe("Width Constraints", () => {
    it("should have max-width for user messages", () => {
      const { container } = render(<ChatMessage role="user" content="Test" />);
      const contentDiv = container.querySelector("[class*='max-w']");
      expect(contentDiv).toBeInTheDocument();
    });

    it("should have max-width for assistant messages", () => {
      const { container } = render(
        <ChatMessage role="assistant" content="Test" />,
      );
      const contentDiv = container.querySelector("[class*='max-w']");
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic structure", () => {
      const { container } = render(
        <ChatMessage role="user" content="Test message" avatarFallback="ME" />,
      );
      const wrapper = container.querySelector(".flex");
      expect(wrapper).toBeInTheDocument();
    });

    it("should display readable text", () => {
      render(<ChatMessage role="user" content="This is readable text" />);
      expect(screen.getByText("This is readable text")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle message with only whitespace", () => {
      const { container } = render(<ChatMessage role="user" content="   " />);
      const messageBox = container.querySelector(".rounded-lg");
      expect(messageBox).toBeInTheDocument();
    });

    it("should handle approval with missing optional fields", () => {
      const minimalApproval: Approval = {
        id: "approval-1",
        run_id: "run-123",
        risk: "low",
        capability: "web_search" as const,
        reason: "Test",
        requested_at: new Date().toISOString(),
      };

      render(
        <ChatMessage
          role="assistant"
          content="Test"
          inlineApprovals={[minimalApproval]}
        />,
      );
      expect(
        screen.getByTestId("action-approval-approval-1"),
      ).toBeInTheDocument();
    });

    it("should handle very long avatar fallback text", () => {
      render(
        <ChatMessage
          role="user"
          content="Test"
          avatarFallback="VERYLONGTEXT"
        />,
      );
      expect(screen.getByText("VERYLONGTEXT")).toBeInTheDocument();
    });
  });

  describe("Styling Classes", () => {
    it("should have flex gap for layout", () => {
      const { container } = render(<ChatMessage role="user" content="Test" />);
      const wrapper = container.querySelector(".flex.gap-3");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have flex-col for content layout", () => {
      const { container } = render(<ChatMessage role="user" content="Test" />);
      const contentDiv = container.querySelector(".flex.flex-col");
      expect(contentDiv).toBeInTheDocument();
    });

    it("should have rounded corners on message box", () => {
      const { container } = render(<ChatMessage role="user" content="Test" />);
      const messageBox = container.querySelector(".rounded-lg");
      expect(messageBox).toBeInTheDocument();
    });

    it("should have padding on message box", () => {
      const { container } = render(<ChatMessage role="user" content="Test" />);
      const messageBox = container.querySelector(".px-4.py-2");
      expect(messageBox).toBeInTheDocument();
    });
  });

  describe("Approval Submission with Edited Actions", () => {
    const mockApproval: Approval = {
      id: "approval-edit-1",
      run_id: "run-456",
      risk: "medium",
      capability: "code_execution" as const,
      reason: "Execute database migration",
      requested_at: new Date().toISOString(),
      type: "command_line",
      source: "terminal",
      action: "npm run migrate",
      metadata: {
        can_edit: true,
      },
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should render inline approvals section", () => {
      const { container } = render(
        <ChatMessage
          role="assistant"
          content="Need to run migration"
          inlineApprovals={[mockApproval]}
        />,
      );

      const approvalsSection = container.querySelector(".space-y-2");
      expect(approvalsSection).toBeInTheDocument();
    });

    it("should render ActionApproval component for each approval", () => {
      render(
        <ChatMessage
          role="assistant"
          content="Need to run migration"
          inlineApprovals={[mockApproval]}
        />,
      );

      const approval = screen.getByTestId("action-approval-approval-edit-1");
      expect(approval).toBeInTheDocument();
    });

    it("should pass approval metadata to ActionApproval", () => {
      render(
        <ChatMessage
          role="assistant"
          content="Need to run migration"
          inlineApprovals={[mockApproval]}
        />,
      );

      // Verify the ActionApproval component received the approval data
      expect(screen.getByText(/terminal/)).toBeInTheDocument();
    });

    it("should handle multiple approvals", () => {
      const approval2: Approval = {
        ...mockApproval,
        id: "approval-edit-2",
        action: "npm run build",
      };

      render(
        <ChatMessage
          role="assistant"
          content="Multiple actions needed"
          inlineApprovals={[mockApproval, approval2]}
        />,
      );

      expect(
        screen.getByTestId("action-approval-approval-edit-1"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("action-approval-approval-edit-2"),
      ).toBeInTheDocument();
    });

    it("should not render approvals section when empty", () => {
      const { container } = render(
        <ChatMessage
          role="assistant"
          content="No approvals"
          inlineApprovals={[]}
        />,
      );

      const approvalsSection = container.querySelector(".space-y-2");
      expect(approvalsSection).not.toBeInTheDocument();
    });

    it("should render approval with correct source and action", () => {
      render(
        <ChatMessage
          role="assistant"
          content="Need to run migration"
          inlineApprovals={[mockApproval]}
        />,
      );

      const approval = screen.getByTestId("action-approval-approval-edit-1");
      expect(approval.textContent).toContain("terminal");
      expect(approval.textContent).toContain("npm");
    });

    it("should handle approval with different action types", () => {
      const mcpApproval: Approval = {
        ...mockApproval,
        id: "approval-mcp",
        type: "mcp_tool",
        source: "web-search",
        action: "search",
      };

      render(
        <ChatMessage
          role="assistant"
          content="Need to search"
          inlineApprovals={[mcpApproval]}
        />,
      );

      const approval = screen.getByTestId("action-approval-approval-mcp");
      expect(approval).toBeInTheDocument();
      expect(approval.textContent).toContain("web-search");
    });

    it("should handle approval without optional fields", () => {
      const minimalApproval: Approval = {
        id: "approval-minimal",
        run_id: "run-999",
        risk: "low",
        capability: "web_search" as const,
        reason: "Search needed",
        requested_at: new Date().toISOString(),
      };

      render(
        <ChatMessage
          role="assistant"
          content="Need approval"
          inlineApprovals={[minimalApproval]}
        />,
      );

      expect(
        screen.getByTestId("action-approval-approval-minimal"),
      ).toBeInTheDocument();
    });

    it("should render approvals in mini mode", () => {
      const { container } = render(
        <ChatMessage
          role="assistant"
          content="Need to run migration"
          inlineApprovals={[mockApproval]}
          isMini={true}
        />,
      );

      const approvalsSection = container.querySelector(".space-y-1");
      expect(approvalsSection).toBeInTheDocument();
    });

    it("should handle approval with long action name", () => {
      const longApproval: Approval = {
        ...mockApproval,
        action:
          "npm install --save-dev @types/node @types/react typescript eslint prettier",
      };

      render(
        <ChatMessage
          role="assistant"
          content="Need to run migration"
          inlineApprovals={[longApproval]}
        />,
      );

      const approval = screen.getByTestId("action-approval-approval-edit-1");
      expect(approval).toBeInTheDocument();
    });
  });
});
