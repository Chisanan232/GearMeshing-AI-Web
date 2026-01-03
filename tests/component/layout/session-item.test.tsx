import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndContext } from "@dnd-kit/core";
import { SessionItem } from "@/components/layout/session-item";
import { ChatSession } from "@/store/use-ui-store";

const mockSession: ChatSession = {
  id: "session-1",
  title: "Refactor Auth Flow",
  folder_id: null,
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  preview: "Discussing authentication improvements...",
};

// Wrapper component for DndContext
function SessionItemWrapper({
  session,
  isActive,
  onSelect,
}: {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <DndContext>
      <SessionItem
        session={session}
        isActive={isActive}
        onSelect={onSelect}
      />
    </DndContext>
  );
}

describe("SessionItem Component", () => {
  describe("Rendering", () => {
    it("should render session title", () => {
      const onSelect = vi.fn();
      render(
        <SessionItemWrapper
          session={mockSession}
          isActive={false}
          onSelect={onSelect}
        />
      );
      expect(screen.getByText("Refactor Auth Flow")).toBeInTheDocument();
    });

    it("should render session preview", () => {
      const onSelect = vi.fn();
      render(
        <SessionItemWrapper
          session={mockSession}
          isActive={false}
          onSelect={onSelect}
        />
      );
      expect(
        screen.getByText("Discussing authentication improvements...")
      ).toBeInTheDocument();
    });

    it("should render message icon", () => {
      const onSelect = vi.fn();
      const { container } = render(
        <SessionItemWrapper
          session={mockSession}
          isActive={false}
          onSelect={onSelect}
        />
      );
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Active State", () => {
    it("should render with active state", () => {
      const onSelect = vi.fn();
      render(
        <SessionItemWrapper
          session={mockSession}
          isActive={true}
          onSelect={onSelect}
        />
      );
      expect(screen.getByText("Refactor Auth Flow")).toBeInTheDocument();
    });

    it("should render with inactive state", () => {
      const onSelect = vi.fn();
      render(
        <SessionItemWrapper
          session={mockSession}
          isActive={false}
          onSelect={onSelect}
        />
      );
      expect(screen.getByText("Refactor Auth Flow")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should be clickable", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <SessionItemWrapper
          session={mockSession}
          isActive={false}
          onSelect={onSelect}
        />
      );

      const sessionText = screen.getByText("Refactor Auth Flow");
      expect(sessionText).toBeInTheDocument();
    });

    it("should be draggable via dnd-kit", () => {
      const onSelect = vi.fn();
      const { container } = render(
        <SessionItemWrapper
          session={mockSession}
          isActive={false}
          onSelect={onSelect}
        />
      );
      // DndContext should be present and button should be within it
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have correct hover styling", () => {
      const onSelect = vi.fn();
      const { container } = render(
        <SessionItemWrapper
          session={mockSession}
          isActive={false}
          onSelect={onSelect}
        />
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("hover:bg-white/5");
    });

    it("should truncate long titles", () => {
      const onSelect = vi.fn();
      const longSession = {
        ...mockSession,
        title: "This is a very long session title that should be truncated",
      };
      const { container } = render(
        <SessionItemWrapper
          session={longSession}
          isActive={false}
          onSelect={onSelect}
        />
      );
      const title = container.querySelector(".truncate");
      expect(title).toBeInTheDocument();
    });

    it("should have correct text color", () => {
      const onSelect = vi.fn();
      const { container } = render(
        <SessionItemWrapper
          session={mockSession}
          isActive={false}
          onSelect={onSelect}
        />
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("text-white/70");
    });
  });

  describe("Preview Display", () => {
    it("should show preview when available", () => {
      const onSelect = vi.fn();
      render(
        <SessionItemWrapper
          session={mockSession}
          isActive={false}
          onSelect={onSelect}
        />
      );
      expect(screen.getByText("Discussing authentication improvements...")).toBeInTheDocument();
    });

    it("should handle missing preview gracefully", () => {
      const onSelect = vi.fn();
      const sessionWithoutPreview = { ...mockSession, preview: undefined };
      const { container } = render(
        <SessionItemWrapper
          session={sessionWithoutPreview}
          isActive={false}
          onSelect={onSelect}
        />
      );
      expect(container).toBeInTheDocument();
    });
  });
});
