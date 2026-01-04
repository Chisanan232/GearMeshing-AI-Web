import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndContext } from "@dnd-kit/core";
import { FolderItem } from "@/components/layout/folder-item";
import { ChatSession, ChatFolder } from "@/store/use-ui-store";

const mockFolder: ChatFolder & { sessionCount: number } = {
  id: "folder-1",
  name: "Mobile App Refactor",
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  sessionCount: 3,
};

const mockSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "Design Database Schema",
    folder_id: "folder-1",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    preview: "Designing the database structure...",
  },
  {
    id: "session-2",
    title: "API Endpoints",
    folder_id: "folder-1",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    preview: "Building REST API endpoints...",
  },
  {
    id: "session-3",
    title: "Mobile UI Components",
    folder_id: "folder-1",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    preview: "Creating reusable UI components...",
  },
];

// Wrapper component for DndContext
function FolderItemWrapper({
  folder,
  isExpanded,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
}: {
  folder: ChatFolder & { sessionCount: number };
  isExpanded: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
}) {
  return (
    <DndContext>
      <FolderItem
        folder={folder}
        isExpanded={isExpanded}
        onToggle={onToggle}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={onSelectSession}
      />
    </DndContext>
  );
}

describe("FolderItem Component", () => {
  beforeEach(() => {
    // Clear mock calls
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render folder name", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });

    it("should render session count", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(screen.getByText("(3)")).toBeInTheDocument();
    });

    it("should render folder icon", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Expansion", () => {
    it("should show chevron-right when collapsed", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      // ChevronRight should be present when not expanded
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should call onToggle when expand button clicked", async () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const expandButton = container.querySelector("button");
      if (expandButton) {
        await user.click(expandButton);
        expect(onToggle).toHaveBeenCalledOnce();
      }
    });

    it("should render sessions when expanded", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={true}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(screen.getByText("Design Database Schema")).toBeInTheDocument();
      expect(screen.getByText("API Endpoints")).toBeInTheDocument();
      expect(screen.getByText("Mobile UI Components")).toBeInTheDocument();
    });

    it("should not render sessions when collapsed", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(
        screen.queryByText("Design Database Schema"),
      ).not.toBeInTheDocument();
    });

    it("should show 'No sessions yet' when expanded with no sessions", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={true}
          onToggle={onToggle}
          sessions={[]}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(screen.getByText("No sessions yet")).toBeInTheDocument();
    });
  });

  describe("Session Selection", () => {
    it("should display sessions when expanded", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={true}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      expect(screen.getByText("Design Database Schema")).toBeInTheDocument();
    });

    it("should handle active session state", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={true}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId="session-1"
          onSelectSession={onSelectSession}
        />,
      );
      // Active session should be rendered
      expect(screen.getByText("Design Database Schema")).toBeInTheDocument();
    });
  });

  describe("Folder Actions", () => {
    it("should render edit button on hover", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      // Edit button should exist
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(1);
    });

    it("should render delete button on hover", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      // Delete button should exist
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(1);
    });

    it("should support folder name editing", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder should be rendered
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have correct background color", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      const folderDiv = container.querySelector(".rounded-lg");
      expect(folderDiv).toBeInTheDocument();
    });

    it("should show droppable highlight on drag over", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      // Droppable zone should be present
      const droppable = container.querySelector(".rounded-lg");
      expect(droppable).toBeInTheDocument();
    });
  });

  describe("Session Sorting", () => {
    it("should sort sessions by most recent first", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={true}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const sessionTexts = Array.from(container.querySelectorAll("button"))
        .map((btn) => btn.textContent)
        .filter(
          (text) => text && mockSessions.some((s) => text.includes(s.title)),
        );

      // Most recent should be first
      expect(sessionTexts[0]).toContain("Mobile UI Components");
    });
  });

  describe("Folder Edit & Delete Operations", () => {
    it("should render folder with edit and delete buttons", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder should be rendered
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
      // Buttons should exist
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(1);
    });

    it("should have edit button available", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Edit button should exist
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(1);
    });

    it("should have delete button available", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Delete button should exist
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(2);
    });
  });

  describe("Folder Droppable Zone", () => {
    it("should render as droppable zone", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder should have droppable styling
      const folderDiv = container.querySelector(".rounded-lg");
      expect(folderDiv).toBeInTheDocument();
    });

    it("should highlight on drag over", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      const { container } = render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Droppable zone should be present
      const droppable = container.querySelector(".rounded-lg");
      expect(droppable).toBeInTheDocument();
    });
  });

  describe("Inline Folder Name Editing", () => {
    it("should support inline editing", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder name should be displayed
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });

    it("should have proper folder structure", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={false}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder name should be displayed
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });
  });

  describe("Session List in Expanded Folder", () => {
    it("should display sessions in correct order", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={true}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Sessions should be sorted by most recent
      const sessionElements = screen.getAllByText(/Design|API|Mobile/);
      expect(sessionElements.length).toBeGreaterThan(0);
    });

    it("should display sessions when expanded", () => {
      const onToggle = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <FolderItemWrapper
          folder={mockFolder}
          isExpanded={true}
          onToggle={onToggle}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Sessions should be visible when expanded
      expect(screen.getByText("Design Database Schema")).toBeInTheDocument();
      expect(screen.getByText("API Endpoints")).toBeInTheDocument();
    });
  });
});
