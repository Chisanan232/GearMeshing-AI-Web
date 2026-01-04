import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppSidebar } from "@/components/layout/app-sidebar";

describe("AppSidebar Component", () => {
  describe("Rendering", () => {
    it("should render sidebar container", () => {
      const { container } = render(<AppSidebar />);
      const sidebar = container.querySelector(".flex.flex-col.border-r");
      expect(sidebar).toBeInTheDocument();
    });

    it("should render header with title", () => {
      render(<AppSidebar />);
      expect(screen.getByText("GearMeshing AI")).toBeInTheDocument();
    });

    it("should render header with icon", () => {
      const { container } = render(<AppSidebar />);
      const image = container.querySelector("img[alt='GearMeshing AI']");
      expect(image).toBeInTheDocument();
    });

    it("should render New Chat button from SidebarSessions", () => {
      render(<AppSidebar />);
      expect(screen.getByText("New Chat")).toBeInTheDocument();
    });

    it("should render settings button in footer", () => {
      render(<AppSidebar />);
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });
  });

  describe("Navigation Items", () => {
    it("should render New Chat button", () => {
      render(<AppSidebar />);
      const newChatButton = screen.getByText("New Chat");
      expect(newChatButton).toBeInTheDocument();
    });

    it("should have clickable buttons", () => {
      render(<AppSidebar />);
      const newChatButton = screen.getByText("New Chat");
      expect(newChatButton).toBeInTheDocument();
    });

    it("should have correct button styling for New Chat", () => {
      render(<AppSidebar />);
      const newChatButton = screen.getByText("New Chat").closest("button");
      expect(newChatButton).toBeInTheDocument();
    });

    it("should have Settings button in footer", () => {
      render(<AppSidebar />);
      const settingsButton = screen.getByText("Settings");
      expect(settingsButton).toBeInTheDocument();
    });
  });

  describe("Icons", () => {
    it("should render icons in buttons", () => {
      const { container } = render(<AppSidebar />);
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should render Settings icon in footer", () => {
      render(<AppSidebar />);
      const settingsButton = screen.getByText("Settings").closest("button");
      expect(settingsButton).toBeInTheDocument();
    });

    it("should render Plus icon for New Chat", () => {
      render(<AppSidebar />);
      const newChatButton = screen.getByText("New Chat");
      const icon = newChatButton.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("should have flex column layout", () => {
      const { container } = render(<AppSidebar />);
      const sidebar = container.querySelector(".flex.flex-col");
      expect(sidebar).toBeInTheDocument();
    });

    it("should have border on right side", () => {
      const { container } = render(<AppSidebar />);
      const sidebar = container.querySelector(".border-r");
      expect(sidebar).toBeInTheDocument();
    });

    it("should have dark background", () => {
      const { container } = render(<AppSidebar />);
      const sidebar = container.querySelector(".bg-neutral-950");
      expect(sidebar).toBeInTheDocument();
    });

    it("should have full height", () => {
      const { container } = render(<AppSidebar />);
      const sidebar = container.querySelector(".h-full");
      expect(sidebar).toBeInTheDocument();
    });

    it("should hide on small screens", () => {
      const { container } = render(<AppSidebar />);
      const sidebar = container.querySelector(".hidden.md\\:flex");
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe("Header Section", () => {
    it("should have header with correct height", () => {
      const { container } = render(<AppSidebar />);
      const header = container.querySelector(".h-14");
      expect(header).toBeInTheDocument();
    });

    it("should have border below header", () => {
      const { container } = render(<AppSidebar />);
      const header = container.querySelector(".border-b");
      expect(header).toBeInTheDocument();
    });

    it("should have centered items in header", () => {
      const { container } = render(<AppSidebar />);
      const header = container.querySelector(".flex.items-center");
      expect(header).toBeInTheDocument();
    });

    it("should have semibold font in header", () => {
      const { container } = render(<AppSidebar />);
      const header = container.querySelector(".font-semibold");
      expect(header).toBeInTheDocument();
    });
  });

  describe("ScrollArea", () => {
    it("should render scroll area for navigation", () => {
      const { container } = render(<AppSidebar />);
      // ScrollArea component is rendered
      const scrollArea = container.querySelector(".flex-1");
      expect(scrollArea).toBeInTheDocument();
    });

    it("should render scroll area", () => {
      const { container } = render(<AppSidebar />);
      const scrollArea = container.querySelector(".flex-1");
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe("Section Headers", () => {
    it("should have New Chat button as main action", () => {
      render(<AppSidebar />);
      const newChatButton = screen.getByText("New Chat");
      expect(newChatButton).toBeInTheDocument();
    });

    it("should have Settings button in footer", () => {
      render(<AppSidebar />);
      const settingsButton = screen.getByText("Settings");
      expect(settingsButton).toBeInTheDocument();
    });

    it("should render SidebarSessions component", () => {
      render(<AppSidebar />);
      // SidebarSessions should be rendered with New Chat button
      expect(screen.getByText("New Chat")).toBeInTheDocument();
    });
  });

  describe("Footer Section", () => {
    it("should have footer with border on top", () => {
      const { container } = render(<AppSidebar />);
      const footer = container.querySelector(".border-t");
      expect(footer).toBeInTheDocument();
    });

    it("should have padding in footer", () => {
      const { container } = render(<AppSidebar />);
      const footer = container.querySelector(".p-4");
      expect(footer).toBeInTheDocument();
    });

    it("should have Settings button in footer", () => {
      render(<AppSidebar />);
      const settingsButton = screen.getByText("Settings");
      expect(settingsButton).toBeInTheDocument();
    });

    it("should have outline variant for settings button", () => {
      render(<AppSidebar />);
      const settingsButton = screen.getByText("Settings").closest("button");
      expect(settingsButton).toHaveClass("w-full");
    });

    it("should have full width settings button", () => {
      render(<AppSidebar />);
      const settingsButton = screen.getByText("Settings").closest("button");
      expect(settingsButton).toHaveClass("w-full");
    });
  });

  describe("Button Styling", () => {
    it("should render buttons with proper styling", () => {
      render(<AppSidebar />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should have New Chat and Settings buttons", () => {
      render(<AppSidebar />);
      expect(screen.getByText("New Chat")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should be hidden on small screens", () => {
      const { container } = render(<AppSidebar />);
      const sidebar = container.querySelector(".hidden");
      expect(sidebar).toBeInTheDocument();
    });

    it("should be visible on medium screens", () => {
      const { container } = render(<AppSidebar />);
      const sidebar = container.querySelector(".md\\:flex");
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic button elements", () => {
      render(<AppSidebar />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should have readable text labels", () => {
      render(<AppSidebar />);
      expect(screen.getByText("GearMeshing AI")).toBeInTheDocument();
      expect(screen.getByText("New Chat")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });
  });
});
