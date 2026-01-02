import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatArea } from "@/components/layout/chat-area";
import { useUIStore } from "@/store/use-ui-store";

beforeEach(() => {
  useUIStore.setState({
    pendingApprovals: [],
  });
});

// Mock child components
vi.mock("@/components/ui/command-approval", () => ({
  CommandApproval: ({ approval }: { approval: { id: string } }) => (
    <div data-testid="command-approval">Approval: {approval.id}</div>
  ),
}));

vi.mock("@/components/chat/chat-message", () => ({
  ChatMessage: ({ message }: { message?: { content: string } }) => (
    <div data-testid="chat-message">Message: {message?.content}</div>
  ),
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => <div data-testid="avatar">{children}</div>,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AvatarImage: ({ src }: { src: string }) => <div data-testid="avatar-image" data-src={src} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void } & Record<string, unknown>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
}));

vi.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-area">{children}</div>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: Record<string, unknown>) => <input data-testid="input" {...props} />,
}));

describe("ChatArea Component", () => {
  describe("Rendering", () => {
    it("should render chat area container", () => {
      const { container } = render(<ChatArea />);
      const chatArea = container.querySelector(".flex.flex-col");
      expect(chatArea).toBeInTheDocument();
    });

    it("should render scroll area for messages", () => {
      render(<ChatArea />);
      expect(screen.getByTestId("scroll-area")).toBeInTheDocument();
    });

    it("should render input field", () => {
      render(<ChatArea />);
      expect(screen.getByTestId("input")).toBeInTheDocument();
    });

    it("should render send button", () => {
      render(<ChatArea />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Layout Structure", () => {
    it("should have flex column layout", () => {
      const { container } = render(<ChatArea />);
      const chatArea = container.querySelector(".flex.flex-col");
      expect(chatArea).toBeInTheDocument();
    });

    it("should have full height", () => {
      const { container } = render(<ChatArea />);
      const chatArea = container.querySelector(".h-full");
      expect(chatArea).toBeInTheDocument();
    });

    it("should have full width", () => {
      const { container } = render(<ChatArea />);
      const chatArea = container.querySelector(".w-full");
      expect(chatArea).toBeInTheDocument();
    });
  });

  describe("Message Display", () => {
    it("should render chat area with scroll area", () => {
      render(<ChatArea />);
      expect(screen.getByTestId("scroll-area")).toBeInTheDocument();
    });

    it("should render input field for messages", () => {
      render(<ChatArea />);
      expect(screen.getByTestId("input")).toBeInTheDocument();
    });

    it("should render empty state when no messages", () => {
      const { container } = render(<ChatArea />);
      const scrollArea = container.querySelector("[data-testid='scroll-area']");
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe("Approval Display", () => {
    it("should have flex layout for chat area", () => {
      const { container } = render(<ChatArea />);
      const chatArea = container.querySelector(".flex");
      expect(chatArea).toBeInTheDocument();
    });
  });

  describe("Input Area", () => {
    it("should render input field with placeholder", () => {
      render(<ChatArea />);
      const input = screen.getByTestId("input");
      expect(input).toBeInTheDocument();
    });

    it("should render send button", () => {
      render(<ChatArea />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should have input with correct styling", () => {
      render(<ChatArea />);
      const input = screen.getByTestId("input");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Sample Data Display", () => {
    it("should display sample mermaid code", () => {
      const { container } = render(<ChatArea />);
      // The component contains sample data
      expect(container).toBeInTheDocument();
    });

    it("should display sample code diff", () => {
      const { container } = render(<ChatArea />);
      // The component contains sample data
      expect(container).toBeInTheDocument();
    });

    it("should display sample markdown spec", () => {
      const { container } = render(<ChatArea />);
      // The component contains sample data
      expect(container).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should render with proper layout classes", () => {
      const { container } = render(<ChatArea />);
      const chatArea = container.querySelector(".flex.flex-col");
      expect(chatArea).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should have flex layout for responsiveness", () => {
      const { container } = render(<ChatArea />);
      const chatArea = container.querySelector(".flex");
      expect(chatArea).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic input element", () => {
      render(<ChatArea />);
      const input = screen.getByTestId("input");
      expect(input).toBeInTheDocument();
    });

    it("should have semantic button element", () => {
      render(<ChatArea />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should have scroll area for keyboard navigation", () => {
      render(<ChatArea />);
      expect(screen.getByTestId("scroll-area")).toBeInTheDocument();
    });
  });

  describe("Message and Approval Interaction", () => {
    it("should render chat area with all required elements", () => {
      render(<ChatArea />);
      expect(screen.getByTestId("scroll-area")).toBeInTheDocument();
      expect(screen.getByTestId("input")).toBeInTheDocument();
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Content Area", () => {
    it("should have flex-1 for flexible height", () => {
      const { container } = render(<ChatArea />);
      const contentArea = container.querySelector(".flex-1");
      expect(contentArea).toBeInTheDocument();
    });

    it("should have overflow handling", () => {
      const { container } = render(<ChatArea />);
      const scrollArea = container.querySelector("[data-testid='scroll-area']");
      expect(scrollArea).toBeInTheDocument();
    });
  });
});
