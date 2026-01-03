import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateFolderDialog } from "@/components/layout/create-folder-dialog";

describe("CreateFolderDialog Component", () => {
  describe("Rendering", () => {
    it("should not render when open is false", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={false}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );
      expect(screen.queryByText("Create New Folder")).not.toBeInTheDocument();
    });

    it("should render dialog when open is true", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );
      expect(screen.getByText("Create New Folder")).toBeInTheDocument();
    });

    it("should render dialog title", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );
      expect(screen.getByText("Create New Folder")).toBeInTheDocument();
    });

    it("should render dialog description", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );
      expect(
        screen.getByText("Create a new folder to organize your chat sessions")
      ).toBeInTheDocument();
    });

    it("should render input field", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );
      const input = screen.getByPlaceholderText("Folder name...");
      expect(input).toBeInTheDocument();
    });

    it("should render Cancel button", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("should render Create Folder button", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );
      expect(screen.getByText("Create Folder")).toBeInTheDocument();
    });
  });

  describe("Input Handling", () => {
    it("should update input value when typing", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      const user = userEvent.setup();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const input = screen.getByPlaceholderText("Folder name...");
      await user.type(input, "New Project");
      expect(input).toHaveValue("New Project");
    });

    it("should have focus on input when dialog opens", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const input = screen.getByPlaceholderText("Folder name...");
      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });

    it("should handle input state properly", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      const user = userEvent.setup();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const input = screen.getByPlaceholderText("Folder name...");
      await user.type(input, "Test Folder");
      expect(input).toHaveValue("Test Folder");
    });
  });

  describe("Button States", () => {
    it("should disable Create Folder button when input is empty", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const createButton = screen.getByText("Create Folder");
      expect(createButton).toBeDisabled();
    });

    it("should disable Create Folder button when input is only whitespace", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      const user = userEvent.setup();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const input = screen.getByPlaceholderText("Folder name...");
      await user.type(input, "   ");

      const createButton = screen.getByText("Create Folder");
      expect(createButton).toBeDisabled();
    });

    it("should enable Create Folder button when input has text", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      const user = userEvent.setup();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const input = screen.getByPlaceholderText("Folder name...");
      await user.type(input, "New Folder");

      const createButton = screen.getByText("Create Folder");
      expect(createButton).not.toBeDisabled();
    });
  });

  describe("User Interactions", () => {
    it("should call onCreateFolder when Create button clicked", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      const user = userEvent.setup();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const input = screen.getByPlaceholderText("Folder name...");
      await user.type(input, "New Folder");

      const createButton = screen.getByText("Create Folder");
      await user.click(createButton);

      expect(onCreateFolder).toHaveBeenCalledWith("New Folder");
    });

    it("should call onCreateFolder when Enter key pressed", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      const user = userEvent.setup();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const input = screen.getByPlaceholderText("Folder name...");
      await user.type(input, "New Folder{Enter}");

      expect(onCreateFolder).toHaveBeenCalledWith("New Folder");
    });

    it("should call onOpenChange(false) when Cancel button clicked", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      const user = userEvent.setup();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const cancelButton = screen.getByText("Cancel");
      await user.click(cancelButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should clear input after creating folder", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      const user = userEvent.setup();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const input = screen.getByPlaceholderText("Folder name...");
      await user.type(input, "New Folder");

      const createButton = screen.getByText("Create Folder");
      await user.click(createButton);

      expect(input).toHaveValue("");
    });

    it("should call onOpenChange(false) when Cancel clicked", async () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      const user = userEvent.setup();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const cancelButton = screen.getByText("Cancel");
      await user.click(cancelButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Styling", () => {
    it("should have correct button styling", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const createButton = screen.getByText("Create Folder");
      expect(createButton).toHaveClass("bg-violet-600");
      expect(createButton).toHaveClass("hover:bg-violet-700");
    });

    it("should have correct input styling", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      const input = screen.getByPlaceholderText("Folder name...");
      expect(input).toHaveClass("rounded-md");
      expect(input).toHaveClass("border");
    });
  });

  describe("Accessibility", () => {
    it("should have proper dialog structure", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      expect(screen.getByText("Create New Folder")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Folder name...")).toBeInTheDocument();
      expect(screen.getByText("Create Folder")).toBeInTheDocument();
    });

    it("should have accessible button labels", () => {
      const onOpenChange = vi.fn();
      const onCreateFolder = vi.fn();
      render(
        <CreateFolderDialog
          open={true}
          onOpenChange={onOpenChange}
          onCreateFolder={onCreateFolder}
        />
      );

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Create Folder")).toBeInTheDocument();
    });
  });
});
