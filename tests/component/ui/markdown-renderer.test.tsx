import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

// Mock react-syntax-highlighter
interface PrismProps {
  children: React.ReactNode;
  language?: string;
}

vi.mock("react-syntax-highlighter", () => ({
  Prism: ({ children, language }: PrismProps) => (
    <pre data-testid="syntax-highlighter" data-language={language}>
      {children}
    </pre>
  ),
}));

vi.mock("react-syntax-highlighter/dist/esm/styles/prism", () => ({
  vscDarkPlus: {},
}));

describe("MarkdownRenderer Component", () => {
  describe("Basic Markdown Rendering", () => {
    it("should render plain text", () => {
      render(<MarkdownRenderer content="Hello World" />);
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("should render headings", () => {
      const { container } = render(<MarkdownRenderer content="# Heading 1\n## Heading 2" />);
      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
      expect(article?.textContent).toContain("Heading 1");
      expect(article?.textContent).toContain("Heading 2");
    });

    it("should render paragraphs", () => {
      const content = "This is a paragraph.\n\nThis is another paragraph.";
      render(<MarkdownRenderer content={content} />);
      const paragraphs = screen.getAllByText(/paragraph/);
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it("should render bold text", () => {
      render(<MarkdownRenderer content="This is **bold** text" />);
      const boldElement = screen.getByText("bold");
      expect(boldElement.tagName).toBe("STRONG");
    });

    it("should render italic text", () => {
      render(<MarkdownRenderer content="This is *italic* text" />);
      const italicElement = screen.getByText("italic");
      expect(italicElement.tagName).toBe("EM");
    });

    it("should render unordered lists", () => {
      const content = "- Item 1\n- Item 2\n- Item 3";
      render(<MarkdownRenderer content={content} />);
      const listItems = screen.getAllByText(/Item/);
      expect(listItems.length).toBe(3);
    });

    it("should render ordered lists", () => {
      const content = "1. First\n2. Second\n3. Third";
      render(<MarkdownRenderer content={content} />);
      const listItems = screen.getAllByText(/First|Second|Third/);
      expect(listItems.length).toBe(3);
    });
  });

  describe("Code Block Rendering", () => {
    it("should render inline code", () => {
      render(<MarkdownRenderer content="Use `const x = 1;` in code" />);
      const codeElement = screen.getByText("const x = 1;");
      expect(codeElement.tagName).toBe("CODE");
    });

    it("should render code blocks with language", () => {
      const content = "```javascript\nconst x = 1;\n```";
      render(<MarkdownRenderer content={content} />);
      const highlighter = screen.getByTestId("syntax-highlighter");
      expect(highlighter).toHaveAttribute("data-language", "javascript");
    });

    it("should render code blocks with typescript", () => {
      const content = "```typescript\nconst x: number = 1;\n```";
      render(<MarkdownRenderer content={content} />);
      const highlighter = screen.getByTestId("syntax-highlighter");
      expect(highlighter).toHaveAttribute("data-language", "typescript");
    });

    it("should render code blocks with python", () => {
      const content = "```python\nx = 1\nprint(x)\n```";
      render(<MarkdownRenderer content={content} />);
      const highlighter = screen.getByTestId("syntax-highlighter");
      expect(highlighter).toHaveAttribute("data-language", "python");
    });

    it("should render code blocks with json", () => {
      const content = '```json\n{"name": "test"}\n```';
      render(<MarkdownRenderer content={content} />);
      const highlighter = screen.getByTestId("syntax-highlighter");
      expect(highlighter).toHaveAttribute("data-language", "json");
    });

    it("should render code block without language", () => {
      const content = "```\nplain code\n```";
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText("plain code")).toBeInTheDocument();
    });

    it("should apply correct styling to inline code", () => {
      render(<MarkdownRenderer content="Use `code` here" />);
      const codeElement = screen.getByText("code");
      expect(codeElement).toHaveClass("bg-muted", "px-1.5", "py-0.5", "rounded");
    });
  });

  describe("Table Rendering", () => {
    it("should render markdown tables", () => {
      const content = `| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |
| Cell 3 | Cell 4 |`;

      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText("Header 1")).toBeInTheDocument();
      expect(screen.getByText("Cell 1")).toBeInTheDocument();
    });

    it("should render table with correct structure", () => {
      const content = `| Name | Age |
| --- | --- |
| John | 30 |`;

      const { container } = render(<MarkdownRenderer content={content} />);
      const table = container.querySelector("table");
      expect(table).toBeInTheDocument();
    });

    it("should apply styling to table headers", () => {
      const content = `| Header |
| --- |
| Data |`;

      const { container } = render(<MarkdownRenderer content={content} />);
      const thead = container.querySelector("thead");
      expect(thead).toHaveClass("bg-muted/50", "border-b");
    });

    it("should apply styling to table cells", () => {
      const content = `| Header |
| --- |
| Data |`;

      const { container } = render(<MarkdownRenderer content={content} />);
      const td = container.querySelector("td");
      expect(td).toHaveClass("px-4", "py-3", "border-b");
    });
  });

  describe("Link Rendering", () => {
    it("should render links with correct href", () => {
      render(<MarkdownRenderer content="[Google](https://google.com)" />);
      const link = screen.getByText("Google");
      expect(link).toHaveAttribute("href", "https://google.com");
    });

    it("should open links in new tab", () => {
      render(<MarkdownRenderer content="[Link](https://example.com)" />);
      const link = screen.getByText("Link");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("should have noopener noreferrer for security", () => {
      render(<MarkdownRenderer content="[Link](https://example.com)" />);
      const link = screen.getByText("Link");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should apply hover styling to links", () => {
      render(<MarkdownRenderer content="[Link](https://example.com)" />);
      const link = screen.getByText("Link");
      expect(link).toHaveClass("text-blue-400", "hover:underline", "cursor-pointer");
    });
  });

  describe("Complex Markdown Content", () => {
    it("should render mixed content", () => {
      const content = `# Title
This is a paragraph with **bold** and *italic* text.

\`\`\`javascript
const x = 1;
\`\`\`

- List item 1
- List item 2`;

      render(<MarkdownRenderer content={content} />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByText("bold")).toBeInTheDocument();
      expect(screen.getByText("italic")).toBeInTheDocument();
      expect(screen.getByText("List item 1")).toBeInTheDocument();
    });

    it("should handle nested lists", () => {
      const content = `- Item 1
  - Nested 1
  - Nested 2
- Item 2`;

      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Nested 1")).toBeInTheDocument();
    });

    it("should handle blockquotes", () => {
      const content = "> This is a quote\n> Multiple lines";
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText(/This is a quote/)).toBeInTheDocument();
    });

    it("should handle horizontal rules", () => {
      const content = "Text\n\n---\n\nMore text";
      const { container } = render(<MarkdownRenderer content={content} />);
      const hr = container.querySelector("hr");
      expect(hr).toBeInTheDocument();
    });
  });

  describe("GFM (GitHub Flavored Markdown)", () => {
    it("should render strikethrough text", () => {
      render(<MarkdownRenderer content="~~strikethrough~~" />);
      const strikethrough = screen.getByText("strikethrough");
      expect(strikethrough.tagName).toBe("DEL");
    });

    it("should render task lists", () => {
      const content = `- [x] Completed task
- [ ] Incomplete task`;

      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText(/Completed task/)).toBeInTheDocument();
      expect(screen.getByText(/Incomplete task/)).toBeInTheDocument();
    });

    it("should render tables (GFM)", () => {
      const content = `| Left | Center | Right |
| :--- | :---: | ---: |
| a | b | c |`;

      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText("Left")).toBeInTheDocument();
      expect(screen.getByText("Center")).toBeInTheDocument();
      expect(screen.getByText("Right")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty content", () => {
      const { container } = render(<MarkdownRenderer content="" />);
      expect(container.querySelector("article")).toBeInTheDocument();
    });

    it("should handle content with only whitespace", () => {
      const { container } = render(<MarkdownRenderer content="   \n\n   " />);
      expect(container.querySelector("article")).toBeInTheDocument();
    });

    it("should handle very long content", () => {
      const longContent = Array(10)
        .fill("This is a paragraph.\n")
        .join("");

      const { container } = render(<MarkdownRenderer content={longContent} />);
      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
      expect(article?.textContent).toContain("This is a paragraph");
    });

    it("should handle special characters in content", () => {
      const content = "Special chars: & < > \" '";
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText(/Special chars/)).toBeInTheDocument();
    });

    it("should handle HTML entities", () => {
      const content = "Entities: &amp; &lt; &gt;";
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText(/Entities/)).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply prose styling", () => {
      const { container } = render(<MarkdownRenderer content="# Test" />);
      const article = container.querySelector("article");
      expect(article).toHaveClass("prose", "prose-invert");
    });

    it("should apply max-width constraint", () => {
      const { container } = render(<MarkdownRenderer content="Test" />);
      const article = container.querySelector("article");
      expect(article).toHaveClass("max-w-none");
    });

    it("should apply paragraph styling", () => {
      const { container } = render(<MarkdownRenderer content="Test paragraph" />);
      const article = container.querySelector("article");
      expect(article).toHaveClass("prose-p:leading-relaxed");
    });
  });
});
