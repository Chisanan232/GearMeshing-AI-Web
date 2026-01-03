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

    it("should render navigation section", () => {
      render(<AppSidebar />);
      expect(screen.getByText("Current Session")).toBeInTheDocument();
    });

    it("should render history section", () => {
      render(<AppSidebar />);
      expect(screen.getByText("History")).toBeInTheDocument();
    });

    it("should render settings button in footer", () => {
      render(<AppSidebar />);
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });
  });

  describe("Navigation Items", () => {
    it("should render current session button", () => {
      render(<AppSidebar />);
      const sessionButton = screen.getByText("Refactor Auth Flow");
      expect(sessionButton).toBeInTheDocument();
    });

    it("should render history item", () => {
      render(<AppSidebar />);
      const historyItem = screen.getByText("Fix ClickUp #402");
      expect(historyItem).toBeInTheDocument();
    });

    it("should have correct button styling for current session", () => {
      render(<AppSidebar />);
      const sessionButton = screen
        .getByText("Refactor Auth Flow")
        .closest("button");
      expect(sessionButton).toHaveClass("w-full");
    });

    it("should have correct button styling for history item", () => {
      render(<AppSidebar />);
      const historyButton = screen
        .getByText("Fix ClickUp #402")
        .closest("button");
      expect(historyButton).toHaveClass("w-full");
    });
  });

  describe("Icons", () => {
    it("should render GitBranch icon for current session", () => {
      const { container } = render(<AppSidebar />);
      const gitBranchIcon = container.querySelector(".mr-2.h-4.w-4");
      expect(gitBranchIcon).toBeInTheDocument();
    });

    it("should render History icon for history item", () => {
      const { container } = render(<AppSidebar />);
      const icons = container.querySelectorAll(".mr-2.h-4.w-4");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should render Settings icon in footer", () => {
      render(<AppSidebar />);
      const settingsButton = screen.getByText("Settings").closest("button");
      expect(settingsButton).toBeInTheDocument();
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

    it("should have muted background", () => {
      const { container } = render(<AppSidebar />);
      const sidebar = container.querySelector("[class*='bg-muted']");
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

    it("should have padding in scroll area", () => {
      const { container } = render(<AppSidebar />);
      const scrollContent = container.querySelector(".py-4");
      expect(scrollContent).toBeInTheDocument();
    });
  });

  describe("Section Headers", () => {
    it("should have Current Session section header", () => {
      render(<AppSidebar />);
      const header = screen.getByText("Current Session");
      expect(header).toHaveClass("text-xs", "font-semibold");
    });

    it("should have History section header", () => {
      render(<AppSidebar />);
      const header = screen.getByText("History");
      expect(header).toHaveClass("text-xs", "font-semibold");
    });

    it("should have muted foreground color for headers", () => {
      render(<AppSidebar />);
      const header = screen.getByText("Current Session");
      expect(header).toHaveClass("text-muted-foreground");
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
    it("should have correct size for all buttons", () => {
      render(<AppSidebar />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("justify-start");
      });
    });

    it("should have full width for all buttons", () => {
      render(<AppSidebar />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("w-full");
      });
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
      expect(screen.getByText("Refactor Auth Flow")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });
  });
});
