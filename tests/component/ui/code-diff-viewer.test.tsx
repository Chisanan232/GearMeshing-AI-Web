import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeDiffViewer } from "@/components/ui/code-diff-viewer";

// Mock monaco-editor
interface DiffEditorProps {
  original: string;
  modified: string;
  language?: string;
  theme?: string;
  options?: {
    renderSideBySide?: boolean;
    readOnly?: boolean;
  };
  loading?: React.ReactNode;
}

vi.mock("@monaco-editor/react", () => ({
  DiffEditor: ({
    original,
    modified,
    language,
    theme,
    options,
    loading,
  }: DiffEditorProps) => (
    <div
      data-testid="diff-editor"
      data-language={language}
      data-theme={theme}
      data-original={original}
      data-modified={modified}
      data-render-side-by-side={options?.renderSideBySide}
      data-read-only={options?.readOnly}
    >
      {loading}
    </div>
  ),
}));

describe("CodeDiffViewer Component", () => {
  const originalCode = `function greet(name) {
  console.log("Hello " + name);
}`;

  const modifiedCode = `function greet(name) {
  const greeting = \`Hello \${name}\`;
  console.log(greeting);
}`;

  describe("Rendering", () => {
    it("should render diff editor container", () => {
      const { container } = render(
        <CodeDiffViewer original={originalCode} modified={modifiedCode} />,
      );

      const diffContainer = container.querySelector(".h-full.w-full");
      expect(diffContainer).toBeInTheDocument();
    });

    it("should render DiffEditor with correct props", () => {
      render(
        <CodeDiffViewer
          original={originalCode}
          modified={modifiedCode}
          language="javascript"
        />,
      );

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-original", originalCode);
      expect(editor).toHaveAttribute("data-modified", modifiedCode);
      expect(editor).toHaveAttribute("data-language", "javascript");
    });

    it("should use default language as typescript", () => {
      render(
        <CodeDiffViewer original={originalCode} modified={modifiedCode} />,
      );

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-language", "typescript");
    });

    it("should apply dark theme", () => {
      render(
        <CodeDiffViewer original={originalCode} modified={modifiedCode} />,
      );

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-theme", "vs-dark");
    });

    it("should render side-by-side view", () => {
      render(
        <CodeDiffViewer original={originalCode} modified={modifiedCode} />,
      );

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-render-side-by-side", "true");
    });

    it("should render as read-only", () => {
      render(
        <CodeDiffViewer original={originalCode} modified={modifiedCode} />,
      );

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-read-only", "true");
    });

    it("should show loading indicator", () => {
      render(
        <CodeDiffViewer original={originalCode} modified={modifiedCode} />,
      );

      const editor = screen.getByTestId("diff-editor");
      const loadingText = editor.textContent;
      expect(loadingText).toContain("Loading Diff Editor");
    });

    it("should apply border and background styling", () => {
      const { container } = render(
        <CodeDiffViewer original={originalCode} modified={modifiedCode} />,
      );

      const wrapper = container.querySelector(".rounded-md.border");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("bg-[#1e1e1e]");
    });
  });

  describe("Language Support", () => {
    it("should support typescript language", () => {
      render(
        <CodeDiffViewer
          original={originalCode}
          modified={modifiedCode}
          language="typescript"
        />,
      );

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-language", "typescript");
    });

    it("should support python language", () => {
      render(
        <CodeDiffViewer
          original={originalCode}
          modified={modifiedCode}
          language="python"
        />,
      );

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-language", "python");
    });

    it("should support json language", () => {
      const jsonOriginal = '{"name": "test"}';
      const jsonModified = '{"name": "test", "version": "1.0"}';

      render(
        <CodeDiffViewer
          original={jsonOriginal}
          modified={jsonModified}
          language="json"
        />,
      );

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-language", "json");
    });

    it("should support sql language", () => {
      const sqlOriginal = "SELECT * FROM users";
      const sqlModified = "SELECT id, name FROM users WHERE active = true";

      render(
        <CodeDiffViewer
          original={sqlOriginal}
          modified={sqlModified}
          language="sql"
        />,
      );

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-language", "sql");
    });
  });

  describe("Content Handling", () => {
    it("should handle empty original code", () => {
      render(<CodeDiffViewer original="" modified={modifiedCode} />);

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-original", "");
    });

    it("should handle empty modified code", () => {
      render(<CodeDiffViewer original={originalCode} modified="" />);

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-modified", "");
    });

    it("should handle multiline code with special characters", () => {
      const complexCode = `const regex = /^[a-zA-Z0-9]+$/;
const template = \`Hello \${name}\`;
const escaped = "Line 1\\nLine 2";`;

      render(<CodeDiffViewer original={complexCode} modified={complexCode} />);

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-original", complexCode);
    });

    it("should handle large code blocks", () => {
      const largeCode = Array(100).fill("console.log('line');").join("\n");

      render(<CodeDiffViewer original={largeCode} modified={largeCode} />);

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-original", largeCode);
    });
  });

  describe("Styling", () => {
    it("should have correct container classes", () => {
      const { container } = render(
        <CodeDiffViewer original={originalCode} modified={modifiedCode} />,
      );

      const wrapper = container.querySelector(".h-full.w-full.overflow-hidden");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("rounded-md", "border", "bg-[#1e1e1e]");
    });

    it("should have flex layout for editor", () => {
      const { container } = render(
        <CodeDiffViewer original={originalCode} modified={modifiedCode} />,
      );

      const wrapper = container.querySelector(".h-full.w-full");
      expect(wrapper).toHaveClass("overflow-hidden");
    });
  });

  describe("Props Variations", () => {
    it("should handle identical original and modified code", () => {
      const sameCode = "const x = 1;";

      render(<CodeDiffViewer original={sameCode} modified={sameCode} />);

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-original", sameCode);
      expect(editor).toHaveAttribute("data-modified", sameCode);
    });

    it("should handle completely different code", () => {
      const original = "function a() {}";
      const modified = "class B {}";

      render(<CodeDiffViewer original={original} modified={modified} />);

      const editor = screen.getByTestId("diff-editor");
      expect(editor).toHaveAttribute("data-original", original);
      expect(editor).toHaveAttribute("data-modified", modified);
    });
  });
});
