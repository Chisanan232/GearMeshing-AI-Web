import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MermaidChart } from "@/components/ui/mermaid-chart";

vi.mock("mermaid");

describe("MermaidChart Component", () => {
  const validDiagramCode = `graph TD
    A[Start] --> B[Process]
    B --> C[End]`;

  const validFlowchartCode = `flowchart LR
    A[Input] --> B{Decision}
    B -->|Yes| C[Output]
    B -->|No| D[Error]`;

  describe("Rendering", () => {
    it("should render mermaid container", () => {
      const { container } = render(<MermaidChart code={validDiagramCode} />);

      const mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();
    });

    it("should apply correct styling classes", () => {
      const { container } = render(<MermaidChart code={validDiagramCode} />);

      const mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toHaveClass(
        "w-full",
        "flex",
        "justify-center",
        "py-4",
        "overflow-x-auto",
      );
    });

    it("should render SVG container with dangerouslySetInnerHTML", () => {
      const { container } = render(<MermaidChart code={validDiagramCode} />);

      const mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();
    });
  });

  describe("Diagram Types", () => {
    it("should render flowchart diagrams", () => {
      const { container } = render(<MermaidChart code={validFlowchartCode} />);

      const mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();
    });

    it("should render graph diagrams", () => {
      const graphCode = `graph TB
        A[Node A] --> B[Node B]`;

      const { container } = render(<MermaidChart code={graphCode} />);

      const mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();
    });

    it("should render state diagrams", () => {
      const stateCode = `stateDiagram-v2
        [*] --> Still
        Still --> Moving
        Moving --> Still`;

      const { container } = render(<MermaidChart code={stateCode} />);

      const mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();
    });
  });

  describe("Code Updates", () => {
    it("should render with different code props", () => {
      const { rerender, container } = render(
        <MermaidChart code={validDiagramCode} />,
      );

      let mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();

      rerender(<MermaidChart code={validFlowchartCode} />);

      mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty code", () => {
      const { container } = render(<MermaidChart code="" />);

      const mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();
    });

    it("should handle code with special characters", () => {
      const specialCode = `graph TD
        A["Node with 'quotes'"]`;

      const { container } = render(<MermaidChart code={specialCode} />);

      const mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();
    });

    it("should handle code with unicode characters", () => {
      const unicodeCode = `graph TD
        A["中文节点"]
        B["日本語ノード"]`;

      const { container } = render(<MermaidChart code={unicodeCode} />);

      const mermaidContainer = container.querySelector(".mermaid-container");
      expect(mermaidContainer).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have flex layout", () => {
      const { container } = render(<MermaidChart code={validDiagramCode} />);

      const mermaidContainer = container.querySelector(".flex.justify-center");
      expect(mermaidContainer).toBeInTheDocument();
    });

    it("should have overflow handling", () => {
      const { container } = render(<MermaidChart code={validDiagramCode} />);

      const mermaidContainer = container.querySelector(".overflow-x-auto");
      expect(mermaidContainer).toBeInTheDocument();
    });

    it("should have padding", () => {
      const { container } = render(<MermaidChart code={validDiagramCode} />);

      const mermaidContainer = container.querySelector(".py-4");
      expect(mermaidContainer).toBeInTheDocument();
    });
  });
});
