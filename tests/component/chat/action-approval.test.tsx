import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionApproval } from "@/components/chat/action-approval";

describe("ActionApproval Component", () => {
  const mockOnApprove = vi.fn();
  const mockOnReject = vi.fn();

  const defaultProps = {
    id: "approval-1",
    type: "command_line" as const,
    source: "terminal",
    action: "npm install",
    reason: "Install dependencies",
    canEdit: true,
    isMini: false,
    onApprove: mockOnApprove,
    onReject: mockOnReject,
  };

  beforeEach(() => {
    mockOnApprove.mockClear();
    mockOnReject.mockClear();
  });

  describe("Rendering", () => {
    it("should render approval card", () => {
      const { container } = render(<ActionApproval {...defaultProps} />);
      const card = container.querySelector(".rounded-lg.border");
      expect(card).toBeInTheDocument();
    });

    it("should render header with source and action", () => {
      render(<ActionApproval {...defaultProps} />);
      expect(screen.getByText(/terminal/)).toBeInTheDocument();
      expect(screen.getByText(/npm/)).toBeInTheDocument();
    });

    it("should render badge with action type", () => {
      render(<ActionApproval {...defaultProps} />);
      expect(screen.getByText(/command line/i)).toBeInTheDocument();
    });

    it("should render action in input field", () => {
      render(<ActionApproval {...defaultProps} />);
      const input = screen.getByDisplayValue("npm install");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Expansion", () => {
    it("should be expanded by default", () => {
      render(<ActionApproval {...defaultProps} />);
      const approveButton = screen.getByText(/Approve/);
      expect(approveButton).toBeInTheDocument();
    });

    it("should be collapsed in mini mode", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} isMini={true} />,
      );
      const expandedContent = container.querySelector(".p-3.space-y-3");
      expect(expandedContent).not.toBeInTheDocument();
    });

    it("should toggle expansion on header click", () => {
      const { container } = render(<ActionApproval {...defaultProps} />);

      // Initially expanded
      let approveButton = screen.queryByText(/Approve/);
      expect(approveButton).toBeInTheDocument();

      // Click header to collapse
      const header = container.querySelector(".flex.items-center.justify-between");
      fireEvent.click(header!);

      // Should be collapsed
      approveButton = screen.queryByText(/Approve/);
      expect(approveButton).not.toBeInTheDocument();

      // Click again to expand
      fireEvent.click(header!);
      approveButton = screen.queryByText(/Approve/);
      expect(approveButton).toBeInTheDocument();
    });
  });

  describe("Action Types", () => {
    it("should render MCP tool type with correct icon", () => {
      render(
        <ActionApproval
          {...defaultProps}
          type="mcp_tool"
          source="web_search"
          action="search query"
        />,
      );
      expect(screen.getByText(/web_search/)).toBeInTheDocument();
      expect(screen.getByText(/mcp tool/i)).toBeInTheDocument();
    });

    it("should render command line type with correct icon", () => {
      render(<ActionApproval {...defaultProps} type="command_line" />);
      expect(screen.getByText(/command line/i)).toBeInTheDocument();
    });
  });

  describe("Editable Mode", () => {
    it("should render input field when editable", () => {
      render(<ActionApproval {...defaultProps} canEdit={true} />);
      const input = screen.getByDisplayValue("npm install");
      expect(input).toBeInTheDocument();
    });

    it("should show EDITABLE badge when canEdit is true", () => {
      render(<ActionApproval {...defaultProps} canEdit={true} />);
      expect(screen.getByText(/EDITABLE/)).toBeInTheDocument();
    });

    it("should render read-only display when not editable", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} canEdit={false} />,
      );
      const readOnlyDisplay = container.querySelector(".bg-black\\/40.border");
      expect(readOnlyDisplay).toBeInTheDocument();
      expect(readOnlyDisplay?.textContent).toContain("npm install");
    });

    it("should not show EDITABLE badge when canEdit is false", () => {
      render(<ActionApproval {...defaultProps} canEdit={false} />);
      expect(screen.queryByText(/EDITABLE/)).not.toBeInTheDocument();
    });

    it("should update action text when edited", () => {
      render(<ActionApproval {...defaultProps} />);
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;

      fireEvent.change(input, { target: { value: "npm install --save" } });

      expect(input.value).toBe("npm install --save");
    });
  });

  describe("Approval Actions", () => {
    it("should call onApprove with updated action on approve", () => {
      render(<ActionApproval {...defaultProps} />);
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;

      fireEvent.change(input, { target: { value: "npm install --save" } });

      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      expect(mockOnApprove).toHaveBeenCalledWith("approval-1", "npm install --save");
    });

    it("should call onReject on reject", () => {
      render(<ActionApproval {...defaultProps} />);
      const rejectButton = screen.getByText(/Reject/);
      fireEvent.click(rejectButton);

      expect(mockOnReject).toHaveBeenCalledWith("approval-1");
    });

    it("should show approved state after approval", () => {
      render(<ActionApproval {...defaultProps} />);
      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      expect(screen.getByText(/✅ Executed/)).toBeInTheDocument();
      expect(screen.getByText(/npm/)).toBeInTheDocument();
    });

    it("should show rejected state after rejection", () => {
      render(<ActionApproval {...defaultProps} />);
      const rejectButton = screen.getByText(/Reject/);
      fireEvent.click(rejectButton);

      expect(screen.getByText(/❌ Rejected/)).toBeInTheDocument();
      expect(screen.getByText(/This action was skipped/)).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have full width in normal mode", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} isMini={false} />,
      );
      const card = container.querySelector(".w-full");
      expect(card).toBeInTheDocument();
    });

    it("should have limited width in mini mode", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} isMini={true} />,
      );
      const card = container.querySelector(".max-w-\\[400px\\]");
      expect(card).toBeInTheDocument();
    });

    it("should have shadow in normal mode", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} isMini={false} />,
      );
      const card = container.querySelector(".shadow-sm");
      expect(card).toBeInTheDocument();
    });

    it("should not have shadow in mini mode", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} isMini={true} />,
      );
      const card = container.querySelector(".shadow-sm");
      expect(card).not.toBeInTheDocument();
    });
  });

  describe("Icon Display", () => {
    it("should show terminal icon for command_line type", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} type="command_line" />,
      );
      const icon = container.querySelector(".text-green-400");
      expect(icon).toBeInTheDocument();
    });

    it("should show box icon for mcp_tool type", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} type="mcp_tool" />,
      );
      const icon = container.querySelector(".text-blue-400");
      expect(icon).toBeInTheDocument();
    });

    it("should show shield icon in approved state", () => {
      const { container } = render(<ActionApproval {...defaultProps} />);
      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      const shieldIcon = container.querySelector(".text-green-500");
      expect(shieldIcon).toBeInTheDocument();
    });

    it("should show x-circle icon in rejected state", () => {
      const { container } = render(<ActionApproval {...defaultProps} />);
      const rejectButton = screen.getByText(/Reject/);
      fireEvent.click(rejectButton);

      const xIcon = container.querySelector(".text-red-500");
      expect(xIcon).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle action without spaces", () => {
      render(
        <ActionApproval
          {...defaultProps}
          action="npm"
        />,
      );
      expect(screen.getByText(/npm/)).toBeInTheDocument();
    });

    it("should handle long action names", () => {
      const longAction = "npm install --save-dev @types/node @types/react typescript";
      render(<ActionApproval {...defaultProps} action={longAction} />);
      expect(screen.getByDisplayValue(longAction)).toBeInTheDocument();
    });

    it("should handle missing reason", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} reason={undefined} />,
      );
      const card = container.querySelector(".rounded-lg.border");
      expect(card).toBeInTheDocument();
    });

    it("should handle special characters in action", () => {
      const specialAction = 'echo "Hello & goodbye"';
      render(<ActionApproval {...defaultProps} action={specialAction} />);
      expect(screen.getByDisplayValue(specialAction)).toBeInTheDocument();
    });
  });

  describe("Button States", () => {
    it("should have approve button with correct styling", () => {
      render(<ActionApproval {...defaultProps} />);
      const approveButton = screen.getByText(/Approve/).closest("button");
      expect(approveButton).toHaveClass("bg-green-600");
    });

    it("should have reject button with correct styling", () => {
      render(<ActionApproval {...defaultProps} />);
      const rejectButton = screen.getByText(/Reject/).closest("button");
      expect(rejectButton).toHaveClass("text-red-400");
    });

    it("should have full width buttons", () => {
      render(<ActionApproval {...defaultProps} />);
      const approveButton = screen.getByText(/Approve/).closest("button");
      const rejectButton = screen.getByText(/Reject/).closest("button");
      expect(approveButton).toHaveClass("flex-1");
      expect(rejectButton).toHaveClass("flex-1");
    });
  });
});
