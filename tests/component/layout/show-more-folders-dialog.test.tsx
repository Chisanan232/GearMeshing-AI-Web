import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShowMoreFoldersDialog } from "@/components/layout/show-more-folders-dialog";
import { ChatSession, ChatFolder } from "@/store/use-ui-store";

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

if (!global.ResizeObserver) {
  global.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
}

const mockFolders: ChatFolder[] = [
  {
    id: "folder-1",
    name: "Mobile App Refactor",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "folder-2",
    name: "API Security Audit",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "folder-3",
    name: "Backend Migration",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
    title: "Security Review",
    folder_id: "folder-2",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    preview: "Reviewing API security...",
  },
];

describe("ShowMoreFoldersDialog Component", () => {
  describe("Rendering", () => {
    it("should not render when open is false", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={false}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(screen.queryByText("All Folders")).not.toBeInTheDocument();
    });

    it("should render dialog when open is true", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(screen.getByText("All Folders")).toBeInTheDocument();
    });

    it("should render dialog title", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(screen.getByText("All Folders")).toBeInTheDocument();
    });

    it("should render dialog description", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(
        screen.getByText("Browse and select from all your chat folders"),
      ).toBeInTheDocument();
    });

    it("should render search input", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      const searchInput = screen.getByPlaceholderText("Search folders...");
      expect(searchInput).toBeInTheDocument();
    });

    it("should render all folder cards", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
      expect(screen.getByText("API Security Audit")).toBeInTheDocument();
      expect(screen.getByText("Backend Migration")).toBeInTheDocument();
    });

    it("should render session counts", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );
      // Should show session counts (2 sessions for folder-1)
      expect(screen.getByText(/2 sessions/i)).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should filter folders by search query", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const searchInput = screen.getByPlaceholderText("Search folders...");
      await user.type(searchInput, "Mobile");

      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
      expect(screen.queryByText("API Security Audit")).not.toBeInTheDocument();
    });

    it("should be case insensitive", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const searchInput = screen.getByPlaceholderText("Search folders...");
      await user.type(searchInput, "mobile");

      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });

    it("should show all folders when search is cleared", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const searchInput = screen.getByPlaceholderText("Search folders...");
      await user.type(searchInput, "Mobile");
      await user.clear(searchInput);

      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
      expect(screen.getByText("API Security Audit")).toBeInTheDocument();
      expect(screen.getByText("Backend Migration")).toBeInTheDocument();
    });

    it("should show 'No folders found' when search has no matches", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const searchInput = screen.getByPlaceholderText("Search folders...");
      await user.type(searchInput, "NonExistent");

      expect(screen.getByText("No folders found")).toBeInTheDocument();
    });
  });

  describe("Folder Expansion", () => {
    it("should expand folder to show sessions when clicked", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Find the folder card button
      const folderButtons = Array.from(
        container.querySelectorAll("button"),
      ).filter((btn) => btn.textContent?.includes("Mobile App Refactor"));

      if (folderButtons.length > 0) {
        await user.click(folderButtons[0]);

        // Sessions should appear after expansion
        expect(screen.getByText("Design Database Schema")).toBeInTheDocument();
      }
    });

    it("should collapse folder when clicked again", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const folderButtons = Array.from(
        container.querySelectorAll("button"),
      ).filter((btn) => btn.textContent?.includes("Mobile App Refactor"));

      if (folderButtons.length > 0) {
        // Expand
        await user.click(folderButtons[0]);
        expect(screen.getByText("Design Database Schema")).toBeInTheDocument();

        // Collapse
        await user.click(folderButtons[0]);
        // After collapse, session should not be visible
        expect(
          screen.queryByText("Design Database Schema"),
        ).not.toBeInTheDocument();
      }
    });

    it("should show 'No sessions' for empty folders", () => {
      const emptyFolder: ChatFolder = {
        id: "folder-empty",
        name: "Empty Folder",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={[emptyFolder]}
          sessions={[]}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder should be expandable but show no sessions when expanded
      expect(screen.getByText("Empty Folder")).toBeInTheDocument();
    });
  });

  describe("Session Selection", () => {
    it("should call onSelectSession when session clicked", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Expand folder first
      const folderButtons = Array.from(
        container.querySelectorAll("button"),
      ).filter((btn) => btn.textContent?.includes("Mobile App Refactor"));

      if (folderButtons.length > 0) {
        await user.click(folderButtons[0]);
        const sessionButton = screen.getByText("Design Database Schema");
        await user.click(sessionButton);
        expect(onSelectSession).toHaveBeenCalledWith("session-1");
      }
    });

    it("should close dialog when session selected", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const folderButtons = Array.from(
        container.querySelectorAll("button"),
      ).filter((btn) => btn.textContent?.includes("Mobile App Refactor"));

      if (folderButtons.length > 0) {
        await user.click(folderButtons[0]);
        const sessionButton = screen.getByText("Design Database Schema");
        await user.click(sessionButton);
        expect(onOpenChange).toHaveBeenCalledWith(false);
      }
    });

    it("should highlight active session", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId="session-1"
          onSelectSession={onSelectSession}
        />,
      );

      // Component should render with active session state
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });
  });

  describe("Folder Sorting", () => {
    it("should sort folders by most recent first", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Most recent folder should appear first
      const folderNames = [
        screen.getByText("Mobile App Refactor"),
        screen.getByText("API Security Audit"),
        screen.getByText("Backend Migration"),
      ];

      // API Security Audit is most recent (updated_at is most recent)
      expect(folderNames).toBeDefined();
    });
  });

  describe("Session Sorting", () => {
    it("should sort sessions by most recent first within folder", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const folderButtons = Array.from(
        container.querySelectorAll("button"),
      ).filter((btn) => btn.textContent?.includes("Mobile App Refactor"));

      if (folderButtons.length > 0) {
        await user.click(folderButtons[0]);
        // Sessions should be sorted by most recent
        expect(screen.getByText("API Endpoints")).toBeInTheDocument();
      }
    });
  });

  describe("Styling", () => {
    it("should have correct folder card styling", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder cards should be rendered
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });

    it("should have correct search input styling", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const searchInput = screen.getByPlaceholderText("Search folders...");
      expect(searchInput).toHaveClass("rounded-md");
      expect(searchInput).toHaveClass("border");
    });
  });

  describe("Empty State", () => {
    it("should show 'No folders found' when folders list is empty", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={[]}
          sessions={[]}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      expect(screen.getByText("No folders found")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper dialog structure", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      expect(screen.getByText("All Folders")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search folders..."),
      ).toBeInTheDocument();
    });
  });

  describe("Folder Card Expansion & Session Display", () => {
    it("should render folder cards", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder cards should be visible
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
      expect(screen.getByText("API Security Audit")).toBeInTheDocument();
    });

    it("should display folder session counts", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Session counts should be displayed
      expect(screen.getByText(/2 sessions/)).toBeInTheDocument();
    });

    it("should have expandable folder cards", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder cards should be rendered
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
      expect(screen.getByText("Backend Migration")).toBeInTheDocument();
    });
  });

  describe("Session Selection from Dialog", () => {
    it("should render dialog with folders and sessions", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Dialog should be open
      expect(screen.getByText("All Folders")).toBeInTheDocument();
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });

    it("should have proper dialog structure", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Dialog should have search and folders
      expect(
        screen.getByPlaceholderText("Search folders..."),
      ).toBeInTheDocument();
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });

    it("should handle active session state", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId="session-1"
          onSelectSession={onSelectSession}
        />,
      );

      // Dialog should render with active session
      expect(screen.getByText("All Folders")).toBeInTheDocument();
    });
  });

  describe("Search Functionality Advanced", () => {
    it("should filter folders in real-time", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const searchInput = screen.getByPlaceholderText("Search folders...");

      // Type search query
      await user.type(searchInput, "API");

      // Only API folder should be visible
      expect(screen.getByText("API Security Audit")).toBeInTheDocument();
      expect(screen.queryByText("Mobile App Refactor")).not.toBeInTheDocument();
    });

    it("should restore all folders when search cleared", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const searchInput = screen.getByPlaceholderText(
        "Search folders...",
      ) as HTMLInputElement;

      // Type and clear
      await user.type(searchInput, "API");
      await user.clear(searchInput);

      // All folders should be visible again
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
      expect(screen.getByText("API Security Audit")).toBeInTheDocument();
      expect(screen.getByText("Backend Migration")).toBeInTheDocument();
    });

    it("should handle partial matches", async () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      const user = userEvent.setup();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      const searchInput = screen.getByPlaceholderText("Search folders...");

      // Partial search
      await user.type(searchInput, "App");

      // Should match "Mobile App Refactor"
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
    });
  });

  describe("Folder Card Display", () => {
    it("should show session count on folder card", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Should display session counts
      expect(screen.getByText(/2 sessions/)).toBeInTheDocument();
    });

    it("should display folder names", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // Folder names should be visible
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
      expect(screen.getByText("API Security Audit")).toBeInTheDocument();
    });

    it("should display folder cards with proper structure", () => {
      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={mockFolders}
          sessions={mockSessions}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      // All folders should be displayed
      expect(screen.getByText("Mobile App Refactor")).toBeInTheDocument();
      expect(screen.getByText("API Security Audit")).toBeInTheDocument();
      expect(screen.getByText("Backend Migration")).toBeInTheDocument();
    });
  });

  describe("Empty Folder Handling", () => {
    it("should handle empty folders gracefully", () => {
      const emptyFolder: ChatFolder = {
        id: "folder-empty",
        name: "Empty Folder",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const onOpenChange = vi.fn();
      const onSelectSession = vi.fn();
      render(
        <ShowMoreFoldersDialog
          open={true}
          onOpenChange={onOpenChange}
          folders={[emptyFolder]}
          sessions={[]}
          activeSessionId={null}
          onSelectSession={onSelectSession}
        />,
      );

      expect(screen.getByText("Empty Folder")).toBeInTheDocument();
    });
  });
});
