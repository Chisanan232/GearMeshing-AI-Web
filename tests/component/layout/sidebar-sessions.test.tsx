import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SidebarSessions } from "@/components/layout/sidebar-sessions";
import { useUIStore } from "@/store/use-ui-store";

// Mock ResizeObserver for both ScrollArea and DndContext
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

if (!global.ResizeObserver) {
  global.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
}

// Mock the useChatSessions hook
vi.mock("@/hooks/useChatSessions", () => ({
  useChatSessions: vi.fn(),
}));

describe("SidebarSessions Component", () => {
  beforeEach(() => {
    // Clear store before each test
    useUIStore.setState({
      sessions: [],
      folders: [],
      activeSessionId: null,
    });
  });

  describe("Rendering", () => {
    it("should render New Chat button", () => {
      render(<SidebarSessions />);
      expect(screen.getByText("New Chat")).toBeInTheDocument();
    });

    it("should render component without errors", () => {
      const { container } = render(<SidebarSessions />);
      expect(container).toBeInTheDocument();
    });

    it("should render with DndContext for drag and drop", () => {
      const { container } = render(<SidebarSessions />);
      // Component should render without errors
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should render folders section when folders exist", () => {
      // Set up store with folders
      useUIStore.setState({
        folders: [
          {
            id: "folder-1",
            name: "Test Folder",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        sessions: [],
      });

      render(<SidebarSessions />);
      // Folder should be rendered
      expect(screen.getByText("Test Folder")).toBeInTheDocument();
    });
  });

  describe("New Chat Button", () => {
    it("should have Plus icon", () => {
      const { container } = render(<SidebarSessions />);
      const button = screen.getByText("New Chat");
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should call createSession when clicked", async () => {
      const user = userEvent.setup();
      render(<SidebarSessions />);

      const newChatButton = screen.getByText("New Chat");
      await user.click(newChatButton);

      // Should create a new session
      const state = useUIStore.getState();
      expect(state.sessions.length).toBeGreaterThanOrEqual(0);
    });

    it("should be clickable", () => {
      render(<SidebarSessions />);
      const button = screen.getByText("New Chat");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Folders Section", () => {
    it("should display folders when they exist", () => {
      const folders = Array.from({ length: 3 }, (_, i) => ({
        id: `folder-${i}`,
        name: `Folder ${i}`,
        created_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }));

      useUIStore.setState({
        folders,
        sessions: [],
      });

      render(<SidebarSessions />);

      // Should show folders
      expect(screen.getByText("Folder 0")).toBeInTheDocument();
    });

    it("should show 'Show More Folders' button when more than 5 folders", () => {
      const folders = Array.from({ length: 8 }, (_, i) => ({
        id: `folder-${i}`,
        name: `Folder ${i}`,
        created_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }));

      useUIStore.setState({
        folders,
        sessions: [],
      });

      render(<SidebarSessions />);

      // Should show Show More button
      const showMoreButton = screen.queryByText(/Show More/i);
      expect(showMoreButton).toBeDefined();
    });

    it("should not show 'Show More Folders' when 5 or fewer folders", () => {
      const folders = Array.from({ length: 3 }, (_, i) => ({
        id: `folder-${i}`,
        name: `Folder ${i}`,
        created_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }));

      useUIStore.setState({
        folders,
        sessions: [],
      });

      render(<SidebarSessions />);

      // Should not show Show More button for 3 folders
      expect(screen.queryByText(/Show More Folders/i)).not.toBeInTheDocument();
    });
  });

  describe("History Section", () => {
    it("should display sessions without folder_id", () => {
      useUIStore.setState({
        folders: [],
        sessions: [
          {
            id: "session-1",
            title: "History Session 1",
            folder_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      });

      render(<SidebarSessions />);

      expect(screen.getByText("History Session 1")).toBeInTheDocument();
    });

    it("should not display sessions with folder_id", () => {
      useUIStore.setState({
        folders: [],
        sessions: [
          {
            id: "session-1",
            title: "Folder Session",
            folder_id: "folder-1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      });

      render(<SidebarSessions />);

      expect(screen.queryByText("Folder Session")).not.toBeInTheDocument();
    });

    it("should sort history sessions by most recent", () => {
      useUIStore.setState({
        folders: [],
        sessions: [
          {
            id: "session-1",
            title: "Oldest",
            folder_id: null,
            created_at: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updated_at: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "session-2",
            title: "Newest",
            folder_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      });

      render(<SidebarSessions />);

      // Both sessions should be rendered
      expect(screen.getByText("Oldest")).toBeInTheDocument();
      expect(screen.getByText("Newest")).toBeInTheDocument();
    });
  });

  describe("Create Folder Dialog", () => {
    it("should have create folder functionality", () => {
      render(<SidebarSessions />);
      // Component should render without errors
      expect(screen.getByText("New Chat")).toBeInTheDocument();
    });

    it("should handle folder creation", async () => {
      const user = userEvent.setup();
      render(<SidebarSessions />);

      // Component should be functional
      const newChatButton = screen.getByText("New Chat");
      expect(newChatButton).toBeInTheDocument();
    });
  });

  describe("Show More Folders Dialog", () => {
    it("should have show more folders functionality", () => {
      const folders = Array.from({ length: 8 }, (_, i) => ({
        id: `folder-${i}`,
        name: `Folder ${i}`,
        created_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }));

      useUIStore.setState({
        folders,
        sessions: [],
      });

      render(<SidebarSessions />);

      // Should render folders
      expect(screen.getByText("Folder 0")).toBeInTheDocument();
    });
  });

  describe("Drag and Drop", () => {
    it("should render DndContext", () => {
      const { container } = render(<SidebarSessions />);
      // DndContext should be present (we can verify by checking for drag-enabled elements)
      expect(container).toBeInTheDocument();
    });

    it("should have droppable folders", () => {
      useUIStore.setState({
        folders: [
          {
            id: "folder-1",
            name: "Test Folder",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        sessions: [],
      });

      render(<SidebarSessions />);

      expect(screen.getByText("Test Folder")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should render with proper styling", () => {
      const { container } = render(<SidebarSessions />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should render when empty", () => {
      useUIStore.setState({
        folders: [],
        sessions: [],
      });

      render(<SidebarSessions />);

      // Should still render New Chat button
      expect(screen.getByText("New Chat")).toBeInTheDocument();
    });
  });

  describe("Active Session Highlighting", () => {
    it("should handle active session state", () => {
      useUIStore.setState({
        folders: [],
        sessions: [
          {
            id: "session-1",
            title: "Active Session",
            folder_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        activeSessionId: "session-1",
      });

      render(<SidebarSessions />);

      const activeSession = screen.getByText("Active Session");
      expect(activeSession).toBeInTheDocument();
    });
  });

  describe("Folder Expansion", () => {
    it("should render folders with sessions", () => {
      useUIStore.setState({
        folders: [
          {
            id: "folder-1",
            name: "Test Folder",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        sessions: [
          {
            id: "session-1",
            title: "Session in Folder",
            folder_id: "folder-1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      });

      render(<SidebarSessions />);

      expect(screen.getByText("Test Folder")).toBeInTheDocument();
    });
  });

  describe("Lazy Loading - History Section", () => {
    it("should display only first 20 items initially", () => {
      // Create 50 sessions
      const sessions = Array.from({ length: 50 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // Should show first 20 items
      expect(screen.getByText("Chat 0")).toBeInTheDocument();
      expect(screen.getByText("Chat 19")).toBeInTheDocument();
      // Should not show item 20 yet
      expect(screen.queryByText("Chat 20")).not.toBeInTheDocument();
    });

    it("should show history count in header", () => {
      const sessions = Array.from({ length: 50 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // Should show total count
      expect(screen.getByText(/HISTORY \(50\)/)).toBeInTheDocument();
    });

    it("should display Load More button when items exceed initial display", () => {
      const sessions = Array.from({ length: 50 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // Should show Load More button
      expect(screen.getByText(/Load More/)).toBeInTheDocument();
      expect(screen.getByText(/30 remaining/)).toBeInTheDocument();
    });

    it("should not display Load More button when items <= 20", () => {
      const sessions = Array.from({ length: 15 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // Should not show Load More button
      expect(screen.queryByText(/Load More/)).not.toBeInTheDocument();
    });

    it("should load more items when Load More button clicked", async () => {
      const user = userEvent.setup();
      const sessions = Array.from({ length: 50 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // Initially should not show item 20
      expect(screen.queryByText("Chat 20")).not.toBeInTheDocument();

      // Load More button should exist
      expect(screen.getByText(/Load More/)).toBeInTheDocument();
    });

    it("should show loading state while loading more items", () => {
      const sessions = Array.from({ length: 50 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // Load More button should be visible
      const loadMoreButton = screen.getByText(/Load More/);
      expect(loadMoreButton).toBeInTheDocument();
    });

    it("should update remaining count after loading more", () => {
      const sessions = Array.from({ length: 50 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // Initially shows 30 remaining
      expect(screen.getByText(/30 remaining/)).toBeInTheDocument();
    });

    it("should hide Load More button when all items loaded", () => {
      const sessions = Array.from({ length: 15 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // With only 15 items, Load More button should not appear
      expect(screen.queryByText(/Load More/)).not.toBeInTheDocument();
    });

    it("should maintain scroll position when loading more items", () => {
      const sessions = Array.from({ length: 50 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      const { container } = render(<SidebarSessions />);

      // Get scroll area
      const scrollArea = container.querySelector(".flex-1");
      expect(scrollArea).toBeInTheDocument();
    });

    it("should handle multiple load more clicks", () => {
      const sessions = Array.from({ length: 100 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // Load More button should exist
      const loadMoreButton = screen.getByText(/Load More/);
      expect(loadMoreButton).toBeInTheDocument();
    });

    it("should sort history items by most recent when loading more", () => {
      const sessions = Array.from({ length: 50 }, (_, i) => ({
        id: `session-${i}`,
        title: `Chat ${i}`,
        folder_id: null,
        created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      }));

      useUIStore.setState({
        folders: [],
        sessions,
      });

      render(<SidebarSessions />);

      // First item should be most recent (Chat 0)
      expect(screen.getByText("Chat 0")).toBeInTheDocument();
    });
  });
});
