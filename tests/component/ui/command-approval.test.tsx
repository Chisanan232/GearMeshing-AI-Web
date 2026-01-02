import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CommandApproval } from "@/components/ui/command-approval";
import { Approval } from "@/types/api";
import { runService } from "@/services";
import { useUIStore } from "@/store/use-ui-store";

vi.mock("@/services");

type MockRunService = ReturnType<typeof vi.fn>;

describe("CommandApproval Component", () => {
  const mockApproval: Approval = {
    id: "approval-1",
    run_id: "run-123",
    risk: "medium",
    capability: "code_execution",
    reason: "Executing shell command",
    requested_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useUIStore.setState({ pendingApprovals: [] });
  });

  describe("Rendering", () => {
    it("should render approval card with all required information", () => {
      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      expect(screen.getByText("Approval Required")).toBeInTheDocument();
      expect(screen.getByText(/Risk Level: medium/i)).toBeInTheDocument();
      expect(screen.getByText("Executing shell command")).toBeInTheDocument();
      expect(screen.getByText("code_execution")).toBeInTheDocument();
    });

    it("should display risk level with correct styling for low risk", () => {
      const lowRiskApproval: Approval = {
        ...mockApproval,
        risk: "low",
      };

      const { container } = render(
        <CommandApproval approval={lowRiskApproval} runId="run-123" />,
      );

      const card = container.querySelector(".border-l-4");
      expect(card).toHaveClass("border-blue-500");
    });

    it("should display risk level with correct styling for high risk", () => {
      const highRiskApproval: Approval = {
        ...mockApproval,
        risk: "high",
      };

      const { container } = render(
        <CommandApproval approval={highRiskApproval} runId="run-123" />,
      );

      const card = container.querySelector(".border-l-4");
      expect(card).toHaveClass("border-red-500");
    });

    it("should show editable command field when not decided", () => {
      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const textarea = screen.getByPlaceholderText(
        /Enter or modify the command here/i,
      );
      expect(textarea).toBeInTheDocument();
      expect(textarea).not.toBeDisabled();
    });

    it("should show Approve and Reject buttons when not decided", () => {
      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      expect(screen.getByText("Approve")).toBeInTheDocument();
      expect(screen.getByText("Reject")).toBeInTheDocument();
    });

    it("should show approved status when decision is approved", () => {
      const decidedApproval: Approval = {
        ...mockApproval,
        decision: "approved",
        decided_at: new Date().toISOString(),
      };

      render(<CommandApproval approval={decidedApproval} runId="run-123" />);

      expect(screen.getByText("Approved")).toBeInTheDocument();
      expect(screen.queryByText("Approve")).not.toBeInTheDocument();
    });

    it("should show rejected status when decision is rejected", () => {
      const decidedApproval: Approval = {
        ...mockApproval,
        decision: "rejected",
        decided_at: new Date().toISOString(),
      };

      render(<CommandApproval approval={decidedApproval} runId="run-123" />);

      expect(screen.getByText("Rejected")).toBeInTheDocument();
      expect(screen.queryByText("Approve")).not.toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should allow editing command field", () => {
      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const textarea = screen.getByPlaceholderText(
        /Enter or modify the command here/i,
      ) as HTMLTextAreaElement;

      fireEvent.change(textarea, { target: { value: "modified command" } });

      expect(textarea.value).toBe("modified command");
    });

    it("should call submitApproval with approved decision on Approve click", async () => {
      (
        runService.submitApproval as unknown as MockRunService
      ).mockResolvedValueOnce({
        ...mockApproval,
        decision: "approved",
      });

      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const approveButton = screen.getByText("Approve");
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(runService.submitApproval).toHaveBeenCalledWith(
          "run-123",
          "approval-1",
          expect.objectContaining({
            decision: "approved",
          }),
        );
      });
    });

    it("should call submitApproval with rejected decision on Reject click", async () => {
      (
        runService.submitApproval as unknown as MockRunService
      ).mockResolvedValueOnce({
        ...mockApproval,
        decision: "rejected",
      });

      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const rejectButton = screen.getByText("Reject");
      fireEvent.click(rejectButton);

      await waitFor(() => {
        expect(runService.submitApproval).toHaveBeenCalledWith(
          "run-123",
          "approval-1",
          expect.objectContaining({
            decision: "rejected",
          }),
        );
      });
    });

    it("should include modified command in approval note", async () => {
      (
        runService.submitApproval as unknown as MockRunService
      ).mockResolvedValueOnce({
        ...mockApproval,
        decision: "approved",
      });

      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const textarea = screen.getByPlaceholderText(
        /Enter or modify the command here/i,
      );
      fireEvent.change(textarea, { target: { value: "modified command" } });

      const approveButton = screen.getByText("Approve");
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(runService.submitApproval).toHaveBeenCalledWith(
          "run-123",
          "approval-1",
          expect.objectContaining({
            note: expect.stringContaining("modified command"),
          }),
        );
      });
    });

    it("should disable buttons while loading", async () => {
      (
        runService.submitApproval as unknown as MockRunService
      ).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ...mockApproval, decision: "approved" }),
              100,
            ),
          ),
      );

      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const approveButton = screen.getByText("Approve") as HTMLButtonElement;
      fireEvent.click(approveButton);

      expect(approveButton).toBeDisabled();
      // Both buttons should be disabled during loading
      const allButtons = screen.getAllByRole("button");
      expect(allButtons.every((btn) => btn.hasAttribute("disabled"))).toBe(
        true,
      );
    });

    it("should call onApprovalResolved callback after approval", async () => {
      const onApprovalResolved = vi.fn();
      const resolvedApproval = {
        ...mockApproval,
        decision: "approved" as const,
      };

      (
        runService.submitApproval as unknown as MockRunService
      ).mockResolvedValueOnce(resolvedApproval);

      render(
        <CommandApproval
          approval={mockApproval}
          runId="run-123"
          onApprovalResolved={onApprovalResolved}
        />,
      );

      const approveButton = screen.getByText("Approve");
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(onApprovalResolved).toHaveBeenCalledWith(resolvedApproval);
      });
    });

    it("should remove approval from store after decision", async () => {
      (
        runService.submitApproval as unknown as MockRunService
      ).mockResolvedValueOnce({
        ...mockApproval,
        decision: "approved",
      });

      useUIStore.getState().addApproval(mockApproval);

      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const approveButton = screen.getByText("Approve");
      fireEvent.click(approveButton);

      await waitFor(() => {
        const state = useUIStore.getState();
        expect(
          state.pendingApprovals.find((a) => a.id === "approval-1"),
        ).toBeUndefined();
      });
    });
  });

  describe("Error Handling", () => {
    it("should show alert on API error", async () => {
      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      (
        runService.submitApproval as unknown as MockRunService
      ).mockRejectedValueOnce(new Error("API Error"));

      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const approveButton = screen.getByText("Approve");
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining("Failed to approve"),
        );
      });

      alertSpy.mockRestore();
    });

    it("should re-enable buttons after error", async () => {
      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      (
        runService.submitApproval as unknown as MockRunService
      ).mockRejectedValueOnce(new Error("API Error"));

      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const approveButton = screen.getByText("Approve") as HTMLButtonElement;
      fireEvent.click(approveButton);

      // Wait for error to be handled
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Button should be re-enabled after error
      expect(approveButton).not.toBeDisabled();

      alertSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("should handle approval with no expiration", () => {
      const noExpiryApproval: Approval = {
        ...mockApproval,
        expires_at: undefined,
      };

      render(<CommandApproval approval={noExpiryApproval} runId="run-123" />);

      expect(screen.getByText("Approval Required")).toBeInTheDocument();
    });

    it("should handle empty command field", async () => {
      (
        runService.submitApproval as unknown as MockRunService
      ).mockResolvedValueOnce({
        ...mockApproval,
        decision: "approved",
      });

      render(<CommandApproval approval={mockApproval} runId="run-123" />);

      const approveButton = screen.getByText("Approve");
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(runService.submitApproval).toHaveBeenCalledWith(
          "run-123",
          "approval-1",
          expect.objectContaining({
            decision: "approved",
            note: undefined,
          }),
        );
      });
    });
  });
});
