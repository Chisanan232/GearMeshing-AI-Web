import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountSettingsPage from "@/app/settings/account/page";
import * as AuthContext from "@/contexts/auth-context";
import * as PluginContext from "@/contexts/plugin-context/plugin-context";

// Mock data
const mockUser = {
  id: "test-user-id",
  name: "Test User",
  email: "test@example.com",
};

const mockUpdateUser = vi.fn();
const mockLogout = vi.fn();

// Mock contexts
vi.mock("@/contexts/auth-context", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/contexts/plugin-context/plugin-context", () => ({
  usePlugin: vi.fn(),
}));

// Mock window location
const originalLocation = window.location;

describe("AccountSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Use real timers by default to avoid issues with Radix UI Dialogs and user-event interactions
    vi.useRealTimers();

    // Mock window.location
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: vi.fn(), href: "" },
    });

    // Mock AuthContext
    (AuthContext.useAuth as any).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    // Mock PluginContext
    (PluginContext.usePlugin as any).mockReturnValue({
      authService: {
        updateUser: mockUpdateUser,
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  describe("Rendering", () => {
    it("should render page title and description", () => {
      render(<AccountSettingsPage />);
      expect(screen.getByText("Account Settings")).toBeInTheDocument();
      expect(
        screen.getByText(/Manage your personal information/i)
      ).toBeInTheDocument();
    });

    it("should render profile form with user data", () => {
      render(<AccountSettingsPage />);
      expect(screen.getByLabelText("Display Name")).toHaveValue("Test User");
      expect(screen.getByLabelText("Email Address")).toHaveValue("test@example.com");
    });

    it("should render connected accounts", () => {
      render(<AccountSettingsPage />);
      expect(screen.getByText("Connected Accounts")).toBeInTheDocument();
      expect(screen.getByText("Google")).toBeInTheDocument();
      expect(screen.getByText("Apple ID")).toBeInTheDocument();
    });

    it("should render delete account section", () => {
      render(<AccountSettingsPage />);
      expect(screen.getAllByText("Delete Account").length).toBeGreaterThan(0);
      expect(screen.getByText(/Permanently delete your account/i)).toBeInTheDocument();
    });
  });

  describe("Profile Form Interactions", () => {
    it("should update user profile", async () => {
      const user = userEvent.setup();
      render(<AccountSettingsPage />);

      const nameInput = screen.getByLabelText("Display Name");
      await user.clear(nameInput);
      await user.type(nameInput, "Updated User");

      const saveButton = screen.getByText("Save Changes");
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({
            name: "Updated User",
            email: "test@example.com"
        }));
      }, { timeout: 3000 });
      
      await waitFor(() => {
        expect(window.location.reload).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it("should show validation errors", async () => {
      const user = userEvent.setup();
      render(<AccountSettingsPage />);

      const nameInput = screen.getByLabelText("Display Name");
      await user.clear(nameInput);
      await user.type(nameInput, "A"); // Too short

      const saveButton = screen.getByText("Save Changes");
      await user.click(saveButton);

      expect(await screen.findByText("Name must be at least 2 characters")).toBeInTheDocument();
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });
  });

  describe("Delete Account Interactions", () => {
    it("should open delete confirmation dialog", async () => {
      const user = userEvent.setup();
      render(<AccountSettingsPage />);

      const deleteButton = screen.getByRole("button", { name: "Delete Account" });
      await user.click(deleteButton);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();
    });

    it("should require typing DELETE to confirm", async () => {
      const user = userEvent.setup();
      render(<AccountSettingsPage />);

      await user.click(screen.getByRole("button", { name: "Delete Account" }));

      const confirmInput = screen.getByPlaceholderText("DELETE");
      const confirmButton = screen.getByRole("button", { name: "Confirm Delete" });

      expect(confirmButton).toBeDisabled();

      await user.type(confirmInput, "DEL");
      expect(confirmButton).toBeDisabled();

      await user.type(confirmInput, "ETE");
      expect(confirmButton).toBeEnabled();
    });

    it("should call logout and redirect on successful delete", async () => {
      const user = userEvent.setup();
      render(<AccountSettingsPage />);

      await user.click(screen.getByRole("button", { name: "Delete Account" }));

      const confirmInput = screen.getByPlaceholderText("DELETE");
      await user.type(confirmInput, "DELETE");

      const confirmButton = screen.getByRole("button", { name: "Confirm Delete" });
      
      // Wait for button to be enabled (state update from typing)
      await waitFor(() => expect(confirmButton).toBeEnabled());
      
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
        expect(window.location.href).toBe("/");
      }, { timeout: 4000 });
    });
  });
});
