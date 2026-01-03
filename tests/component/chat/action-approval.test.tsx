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
      const header = container.querySelector(
        ".flex.items-center.justify-between",
      );
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

      expect(mockOnApprove).toHaveBeenCalledWith(
        "approval-1",
        "npm install --save",
      );
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
      expect(screen.getByText(/Skipped\. Workflow continues/)).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have constrained width in normal mode", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} isMini={false} />,
      );
      const card = container.querySelector("div[class*='border'][class*='rounded-lg']");
      expect(card).toBeInTheDocument();
      // Verify it has the max-width constraint by checking the style or class
      expect(card?.className).toContain("max-w");
    });

    it("should have limited width in mini mode", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} isMini={true} />,
      );
      const card = container.querySelector("div[class*='border'][class*='rounded-lg']");
      expect(card).toBeInTheDocument();
      // Verify it has the max-width constraint by checking the style or class
      expect(card?.className).toContain("max-w");
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
      render(<ActionApproval {...defaultProps} action="npm" />);
      expect(screen.getByText(/npm/)).toBeInTheDocument();
    });

    it("should handle long action names", () => {
      const longAction =
        "npm install --save-dev @types/node @types/react typescript";
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

  describe("Editing and Submission", () => {
    it("should allow editing action when canEdit is true", () => {
      render(<ActionApproval {...defaultProps} canEdit={true} />);
      const input = screen.getByDisplayValue("npm install");
      expect(input).toBeInTheDocument();
      expect(input).not.toHaveAttribute("disabled");
    });

    it("should not allow editing action when canEdit is false", () => {
      render(<ActionApproval {...defaultProps} canEdit={false} />);
      const input = screen.queryByDisplayValue("npm install");
      expect(input).not.toBeInTheDocument();
      const readOnlyText = screen.getByText("$ npm install");
      expect(readOnlyText).toBeInTheDocument();
    });

    it("should update input value when user types", () => {
      render(<ActionApproval {...defaultProps} canEdit={true} />);
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;

      // Simulate user typing
      fireEvent.change(input, {
        target: { value: "npm install --save react" },
      });

      expect(input.value).toBe("npm install --save react");
    });

    it("should pass original action if not edited", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      expect(onApproveMock).toHaveBeenCalledWith(
        defaultProps.id,
        "npm install",
      );
    });

    it("should call onReject callback when reject button is clicked", () => {
      const onRejectMock = vi.fn();
      render(<ActionApproval {...defaultProps} onReject={onRejectMock} />);

      const rejectButton = screen.getByText(/Reject/);
      fireEvent.click(rejectButton);

      expect(onRejectMock).toHaveBeenCalledWith(defaultProps.id);
    });

    it("should show approved state after approval", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // After approval, should show approved state
      expect(screen.getByText(/Executed:/)).toBeInTheDocument();
      expect(screen.getByText(/npm install/)).toBeInTheDocument();
    });

    it("should show rejected state after rejection", () => {
      const onRejectMock = vi.fn();
      render(<ActionApproval {...defaultProps} onReject={onRejectMock} />);

      const rejectButton = screen.getByText(/Reject/);
      fireEvent.click(rejectButton);

      // After rejection, should show rejected state
      expect(screen.getByText(/Rejected:/)).toBeInTheDocument();
      expect(screen.getByText(/npm install/)).toBeInTheDocument();
    });

    it("should handle rapid approve/reject clicks", () => {
      const onApproveMock = vi.fn();
      const onRejectMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          onApprove={onApproveMock}
          onReject={onRejectMock}
        />,
      );

      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // After approval, reject button should not be visible
      const rejectButton = screen.queryByText(/Reject/);
      expect(rejectButton).not.toBeInTheDocument();
    });

    it("should show edit icon in input field when editable", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} canEdit={true} />,
      );

      // Check for the relative group container that holds the edit icon
      const iconContainer = container.querySelector(".relative.group");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should not show edit icon when not editable", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} canEdit={false} />,
      );

      // When not editable, there should be no input field
      const input = container.querySelector("input");
      expect(input).not.toBeInTheDocument();
    });

    it("should handle input changes with fireEvent", () => {
      render(<ActionApproval {...defaultProps} canEdit={true} />);
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;

      fireEvent.change(input, {
        target: { value: "npm install --save-dev typescript" },
      });

      expect(input.value).toBe("npm install --save-dev typescript");
    });

    it("should render input with correct styling", () => {
      const { container } = render(
        <ActionApproval {...defaultProps} canEdit={true} />,
      );
      const input = container.querySelector("input");
      expect(input).toHaveClass("bg-black/40");
      expect(input).toHaveClass("border-primary/20");
    });

    it("should handle long action names", () => {
      const longAction =
        "npm install --save-dev @types/node @types/react typescript";
      render(<ActionApproval {...defaultProps} action={longAction} />);
      expect(screen.getByDisplayValue(longAction)).toBeInTheDocument();
    });

    it("should handle special characters in action", () => {
      const specialAction = 'echo "Hello & goodbye"';
      render(<ActionApproval {...defaultProps} action={specialAction} />);
      expect(screen.getByDisplayValue(specialAction)).toBeInTheDocument();
    });
  });

  describe("Edited Action Persistence in States", () => {
    it("should display edited action in approved state", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      // Edit the action
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: "npm install --save react" },
      });

      // Approve
      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Verify the edited action is displayed in the approved state
      expect(screen.getByText(/npm install --save react/)).toBeInTheDocument();
      expect(screen.queryByDisplayValue("npm install")).not.toBeInTheDocument();
    });

    it("should display edited action in rejected state", () => {
      const onRejectMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onReject={onRejectMock}
        />,
      );

      // Edit the action
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: "npm install --save-dev typescript" },
      });

      // Reject
      const rejectButton = screen.getByText(/Reject/);
      fireEvent.click(rejectButton);

      // Verify the edited action is displayed in the rejected state
      expect(
        screen.getByText(/npm install --save-dev typescript/),
      ).toBeInTheDocument();
      expect(screen.queryByDisplayValue("npm install")).not.toBeInTheDocument();
    });

    it("should display original action when not edited before approval", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      // Don't edit, just approve
      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Verify the original action is displayed
      expect(screen.getByText(/npm install/)).toBeInTheDocument();
    });

    it("should display edited MCP tool action in approved state", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          type="mcp_tool"
          action="search query"
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      // Edit the action
      const input = screen.getByDisplayValue(
        "search query",
      ) as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: "search query with filters" },
      });

      // Approve
      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Verify the edited action is displayed (first word for MCP tools)
      expect(screen.getByText(/search/)).toBeInTheDocument();
    });

    it("should show Executed status with edited action", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      // Edit the action
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: "npm install --save react --save-dev @types/react" },
      });

      // Approve
      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Verify Executed status with edited action
      const executedText = screen.getByText(/Executed:/);
      expect(executedText).toBeInTheDocument();
      expect(executedText.textContent).toContain(
        "npm install --save react --save-dev @types/react",
      );
    });

    it("should show Rejected status with edited action", () => {
      const onRejectMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onReject={onRejectMock}
        />,
      );

      // Edit the action
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: "npm install --legacy-peer-deps" },
      });

      // Reject
      const rejectButton = screen.getByText(/Reject/);
      fireEvent.click(rejectButton);

      // Verify Rejected status with edited action
      const rejectedText = screen.getByText(/Rejected:/);
      expect(rejectedText).toBeInTheDocument();
      expect(rejectedText.textContent).toContain(
        "npm install --legacy-peer-deps",
      );
    });

    it("should handle multiple edits before approval", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;

      // First edit
      fireEvent.change(input, {
        target: { value: "npm install --save react" },
      });
      expect(input.value).toBe("npm install --save react");

      // Second edit
      fireEvent.change(input, {
        target: { value: "npm install --save react typescript" },
      });
      expect(input.value).toBe("npm install --save react typescript");

      // Approve
      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Verify the final edited action is displayed
      expect(
        screen.getByText(/npm install --save react typescript/),
      ).toBeInTheDocument();
    });

    it("should not display input field after approval", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      // Edit and approve
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: "npm install --save react" },
      });

      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Input field should not be visible anymore
      expect(
        screen.queryByDisplayValue("npm install --save react"),
      ).not.toBeInTheDocument();
    });

    it("should display edited action with special characters in approved state", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          action='echo "test"'
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      // Edit with special characters
      const input = screen.getByDisplayValue('echo "test"') as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: 'echo "test with special chars: !@#$%"' },
      });

      // Approve
      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Verify the edited action with special characters is displayed
      expect(
        screen.getByText(/echo "test with special chars: !@#\$%"/),
      ).toBeInTheDocument();
    });

    it("should display edited long action in approved state", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      // Edit with a very long action
      const longAction = "npm install --save " + "package ".repeat(20);
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;
      fireEvent.change(input, { target: { value: longAction } });

      // Approve
      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Verify the long edited action is displayed
      expect(
        screen.getByText(new RegExp(longAction.substring(0, 50))),
      ).toBeInTheDocument();
    });

    it("should pass edited action to onApprove callback and display it", () => {
      const onApproveMock = vi.fn();
      render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      const editedAction = "npm install --save react --save-dev @types/react";
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;
      fireEvent.change(input, { target: { value: editedAction } });

      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Verify callback was called with edited action
      expect(onApproveMock).toHaveBeenCalledWith(defaultProps.id, editedAction);

      // Verify the edited action is displayed in the UI
      expect(screen.getByText(new RegExp(editedAction))).toBeInTheDocument();
    });

    it("should show green styling with edited action in approved state", () => {
      const onApproveMock = vi.fn();
      const { container } = render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onApprove={onApproveMock}
        />,
      );

      // Edit and approve
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: "npm install --save react" },
      });

      const approveButton = screen.getByText(/Approve/);
      fireEvent.click(approveButton);

      // Verify green styling for approved state
      const approvedCard = container.querySelector("[class*='border-green']");
      expect(approvedCard).toBeInTheDocument();

      // Verify the edited action is displayed
      expect(screen.getByText(/npm install --save react/)).toBeInTheDocument();
    });

    it("should show red styling with edited action in rejected state", () => {
      const onRejectMock = vi.fn();
      const { container } = render(
        <ActionApproval
          {...defaultProps}
          canEdit={true}
          onReject={onRejectMock}
        />,
      );

      // Edit and reject
      const input = screen.getByDisplayValue("npm install") as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: "npm install --save react" },
      });

      const rejectButton = screen.getByText(/Reject/);
      fireEvent.click(rejectButton);

      // Verify red styling for rejected state
      const rejectedCard = container.querySelector("[class*='border-red']");
      expect(rejectedCard).toBeInTheDocument();

      // Verify the edited action is displayed
      expect(screen.getByText(/npm install --save react/)).toBeInTheDocument();
    });
  });
});
