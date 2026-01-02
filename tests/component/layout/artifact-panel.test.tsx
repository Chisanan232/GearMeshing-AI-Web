import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ArtifactPanel } from "@/components/layout/artifact-panel";
import { useUIStore } from "@/store/use-ui-store";

// Mock child components
vi.mock("@/components/ui/mermaid-chart", () => ({
  MermaidChart: ({ code }: { code: string }) => (
    <div data-testid="mermaid-chart">Mermaid: {code}</div>
  ),
}));

vi.mock("@/components/ui/code-diff-viewer", () => ({
  CodeDiffViewer: ({ original, modified }: { original: string; modified: string }) => (
    <div data-testid="code-diff-viewer">
      Diff: {original} vs {modified}
    </div>
  ),
}));

vi.mock("@/components/ui/markdown-renderer", () => ({
  MarkdownRenderer: ({ content }: { content: string }) => (
    <div data-testid="markdown-renderer">Markdown: {content}</div>
  ),
}));

describe("ArtifactPanel Component", () => {
  beforeEach(() => {
    useUIStore.setState({
      activeArtifact: null,
      artifactData: null,
    });
  });

  describe("Visibility", () => {
    it("should not render when no artifact is active", () => {
      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".border-l");
      expect(panel).not.toBeInTheDocument();
    });

    it("should render when artifact is active", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".border-l");
      expect(panel).toBeInTheDocument();
    });
  });

  describe("Panel Width", () => {
    it("should have narrow width for diagram", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".w-\\[380px\\]");
      expect(panel).toBeInTheDocument();
    });

    it("should have wide width for code_diff", () => {
      useUIStore.setState({
        activeArtifact: "code_diff",
        artifactData: {
          filePath: "test.ts",
          original: "const x = 1;",
          modified: "const x = 2;",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".w-\\[500px\\]");
      expect(panel).toBeInTheDocument();
    });

    it("should have wide width for markdown", () => {
      useUIStore.setState({
        activeArtifact: "markdown",
        artifactData: {
          title: "Documentation",
          content: "# Title",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".w-\\[500px\\]");
      expect(panel).toBeInTheDocument();
    });

    it("should have narrow width for task_board", () => {
      useUIStore.setState({
        activeArtifact: "task_board",
        artifactData: { tasks: [] },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".w-\\[380px\\]");
      expect(panel).toBeInTheDocument();
    });
  });

  describe("Header", () => {
    it("should render header with border", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const header = container.querySelector(".h-14.border-b");
      expect(header).toBeInTheDocument();
    });

    it("should render close button", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      render(<ArtifactPanel />);
      const closeButton = screen.getByRole("button");
      expect(closeButton).toBeInTheDocument();
    });

    it("should call closeArtifact on close button click", () => {
      const closeArtifactSpy = vi.spyOn(useUIStore.getState(), "closeArtifact");

      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      render(<ArtifactPanel />);
      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);

      expect(closeArtifactSpy).toHaveBeenCalled();
    });
  });

  describe("Diagram Header", () => {
    it("should render diagram header with icon and title", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      render(<ArtifactPanel />);
      expect(screen.getByText(/Architecture Diagram/)).toBeInTheDocument();
    });
  });

  describe("Task Board Header", () => {
    it("should render task board header with icon and title", () => {
      useUIStore.setState({
        activeArtifact: "task_board",
        artifactData: { tasks: [] },
      });

      render(<ArtifactPanel />);
      expect(screen.getByText("Task Board")).toBeInTheDocument();
    });
  });

  describe("Code Diff Header", () => {
    it("should render code diff header with file path", () => {
      useUIStore.setState({
        activeArtifact: "code_diff",
        artifactData: {
          filePath: "src/index.ts",
          original: "const x = 1;",
          modified: "const x = 2;",
        },
      });

      render(<ArtifactPanel />);
      expect(screen.getByText(/src\/index.ts/)).toBeInTheDocument();
    });

    it("should render code diff header with default title if no file path", () => {
      useUIStore.setState({
        activeArtifact: "code_diff",
        artifactData: {
          original: "const x = 1;",
          modified: "const x = 2;",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const header = container.querySelector(".h-14");
      expect(header).toBeInTheDocument();
    });

    it("should truncate long file paths", () => {
      const longPath = "src/very/long/path/to/some/file/that/is/very/long.ts";
      useUIStore.setState({
        activeArtifact: "code_diff",
        artifactData: {
          filePath: longPath,
          original: "const x = 1;",
          modified: "const x = 2;",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const truncated = container.querySelector(".truncate.max-w-\\[300px\\]");
      expect(truncated).toBeInTheDocument();
    });
  });

  describe("Markdown Header", () => {
    it("should render markdown header with title", () => {
      useUIStore.setState({
        activeArtifact: "markdown",
        artifactData: {
          title: "API Documentation",
          content: "# API Docs",
        },
      });

      render(<ArtifactPanel />);
      expect(screen.getByText(/API Documentation/)).toBeInTheDocument();
    });

    it("should render markdown header with default title if no title", () => {
      useUIStore.setState({
        activeArtifact: "markdown",
        artifactData: {
          content: "# Content",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const header = container.querySelector(".h-14");
      expect(header).toBeInTheDocument();
    });

    it("should truncate long markdown titles", () => {
      const longTitle = "A".repeat(400);
      useUIStore.setState({
        activeArtifact: "markdown",
        artifactData: {
          title: longTitle,
          content: "# Content",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const truncated = container.querySelector(".truncate.max-w-\\[300px\\]");
      expect(truncated).toBeInTheDocument();
    });
  });

  describe("Content Rendering", () => {
    it("should render panel for diagram artifact", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".border-l");
      expect(panel).toBeInTheDocument();
    });

    it("should render panel for code_diff artifact", () => {
      useUIStore.setState({
        activeArtifact: "code_diff",
        artifactData: {
          filePath: "test.ts",
          original: "const x = 1;",
          modified: "const x = 2;",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".border-l");
      expect(panel).toBeInTheDocument();
    });

    it("should render panel for markdown artifact", () => {
      useUIStore.setState({
        activeArtifact: "markdown",
        artifactData: {
          title: "Docs",
          content: "# Title\n\nContent here",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".border-l");
      expect(panel).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have flex column layout", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".flex.flex-col");
      expect(panel).toBeInTheDocument();
    });

    it("should have full height", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".h-full");
      expect(panel).toBeInTheDocument();
    });

    it("should have shadow effect", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".shadow-xl");
      expect(panel).toBeInTheDocument();
    });

    it("should have transition animation", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".transition-all");
      expect(panel).toBeInTheDocument();
    });

    it("should have border on left", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const panel = container.querySelector(".border-l");
      expect(panel).toBeInTheDocument();
    });
  });

  describe("Content Area", () => {
    it("should have flex-1 overflow hidden content area", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const contentArea = container.querySelector(".flex-1.overflow-hidden");
      expect(contentArea).toBeInTheDocument();
    });
  });

  describe("Icon Colors", () => {
    it("should have blue icon for diagram", () => {
      useUIStore.setState({
        activeArtifact: "diagram",
        artifactData: { code: "graph TD\n A --> B" },
      });

      const { container } = render(<ArtifactPanel />);
      const icon = container.querySelector(".text-blue-500");
      expect(icon).toBeInTheDocument();
    });

    it("should have green icon for task board", () => {
      useUIStore.setState({
        activeArtifact: "task_board",
        artifactData: { tasks: [] },
      });

      const { container } = render(<ArtifactPanel />);
      const icon = container.querySelector(".text-green-500");
      expect(icon).toBeInTheDocument();
    });

    it("should have purple icon for code diff", () => {
      useUIStore.setState({
        activeArtifact: "code_diff",
        artifactData: {
          filePath: "test.ts",
          original: "const x = 1;",
          modified: "const x = 2;",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const icon = container.querySelector(".text-purple-500");
      expect(icon).toBeInTheDocument();
    });

    it("should have orange icon for markdown", () => {
      useUIStore.setState({
        activeArtifact: "markdown",
        artifactData: {
          title: "Docs",
          content: "# Title",
        },
      });

      const { container } = render(<ArtifactPanel />);
      const icon = container.querySelector(".text-orange-500");
      expect(icon).toBeInTheDocument();
    });
  });
});
