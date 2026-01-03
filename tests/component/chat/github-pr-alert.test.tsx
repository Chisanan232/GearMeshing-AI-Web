// tests/component/chat/github-pr-alert.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { GitHubPRAlert } from "@/components/chat/github-pr-alert";
import { describe, it, expect, vi } from "vitest";

describe("GitHubPRAlert", () => {
  const defaultProps = {
    id: "github-pr-1",
    prNumber: 42,
    repoName: "GearMeshing-AI",
    prTitle: "feat: Implement OAuth2 with OIDC support",
    description:
      "This pull request implements OAuth2 with OIDC support for enhanced security and third-party login integration.",
    githubUrl: "https://github.com/Chisanan232/GearMeshing-AI/pull/42",
  };

  it("should render GitHub PR alert card", () => {
    render(<GitHubPRAlert {...defaultProps} />);
    expect(screen.getByText(/GitHub PR/i)).toBeInTheDocument();
  });

  it("should display PR number and repo name", () => {
    render(<GitHubPRAlert {...defaultProps} />);
    expect(screen.getByText(/#42/)).toBeInTheDocument();
    expect(screen.getAllByText(/GearMeshing-AI/).length).toBeGreaterThan(0);
  });

  it("should display PR title", () => {
    render(<GitHubPRAlert {...defaultProps} />);
    expect(screen.getByText(/feat: Implement OAuth2 with OIDC support/)).toBeInTheDocument();
  });

  it("should display PR description", () => {
    render(<GitHubPRAlert {...defaultProps} />);
    expect(
      screen.getByText(/This pull request implements OAuth2 with OIDC support/)
    ).toBeInTheDocument();
  });

  it("should display GitHub URL", () => {
    render(<GitHubPRAlert {...defaultProps} />);
    expect(screen.getByText(defaultProps.githubUrl)).toBeInTheDocument();
  });

  it("should render View on GitHub button", () => {
    render(<GitHubPRAlert {...defaultProps} />);
    const viewButton = screen.getByText(/View on GitHub/i);
    expect(viewButton).toBeInTheDocument();
  });

  it("should render Mark as Reviewed button", () => {
    render(<GitHubPRAlert {...defaultProps} />);
    const reviewButton = screen.getByText(/Mark as Reviewed/i);
    expect(reviewButton).toBeInTheDocument();
  });

  it("should open GitHub URL when View on GitHub button is clicked", () => {
    const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<GitHubPRAlert {...defaultProps} />);
    const viewButton = screen.getByText(/View on GitHub/i);

    fireEvent.click(viewButton);

    expect(windowOpenSpy).toHaveBeenCalledWith(defaultProps.githubUrl, "_blank");

    windowOpenSpy.mockRestore();
  });

  it("should call onConfirm callback when Mark as Reviewed is clicked", () => {
    const onConfirm = vi.fn();
    render(<GitHubPRAlert {...defaultProps} onConfirm={onConfirm} />);

    const reviewButton = screen.getByText(/Mark as Reviewed/i);
    fireEvent.click(reviewButton);

    expect(onConfirm).toHaveBeenCalledWith(defaultProps.id);
  });

  it("should show confirmed state after review is marked", () => {
    render(<GitHubPRAlert {...defaultProps} />);

    const reviewButton = screen.getByText(/Mark as Reviewed/i);
    fireEvent.click(reviewButton);

    expect(screen.getByText(/GitHub Review Acknowledged/i)).toBeInTheDocument();
    expect(screen.getByText(/PR #42 in GearMeshing-AI marked as reviewed/i)).toBeInTheDocument();
  });

  it("should hide action buttons in confirmed state", () => {
    render(<GitHubPRAlert {...defaultProps} />);

    const reviewButton = screen.getByText(/Mark as Reviewed/i);
    fireEvent.click(reviewButton);

    expect(screen.queryByText(/View on GitHub/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mark as Reviewed/i)).not.toBeInTheDocument();
  });

  it("should display check icon in confirmed state", () => {
    const { container } = render(<GitHubPRAlert {...defaultProps} />);

    const reviewButton = screen.getByText(/Mark as Reviewed/i);
    fireEvent.click(reviewButton);

    const confirmedDiv = container.querySelector("[class*='bg-green']");
    expect(confirmedDiv).toBeInTheDocument();
  });

  it("should have correct styling for pending state", () => {
    const { container } = render(<GitHubPRAlert {...defaultProps} />);

    const card = container.querySelector("[class*='border-blue']");
    expect(card).toBeInTheDocument();
  });

  it("should render GitHub icon", () => {
    const { container } = render(<GitHubPRAlert {...defaultProps} />);

    const iconElements = container.querySelectorAll("svg");
    expect(iconElements.length).toBeGreaterThan(0);
  });

  it("should handle different PR numbers", () => {
    const { rerender } = render(<GitHubPRAlert {...defaultProps} prNumber={99} />);
    expect(screen.getByText(/#99/)).toBeInTheDocument();

    rerender(<GitHubPRAlert {...defaultProps} prNumber={1} />);
    expect(screen.getByText(/#1/)).toBeInTheDocument();
  });

  it("should handle different repo names", () => {
    const { rerender } = render(
      <GitHubPRAlert {...defaultProps} repoName="my-awesome-repo" />
    );
    expect(screen.getAllByText(/my-awesome-repo/).length).toBeGreaterThan(0);

    rerender(<GitHubPRAlert {...defaultProps} repoName="another-repo" />);
    expect(screen.getAllByText(/another-repo/).length).toBeGreaterThan(0);
  });

  it("should display full GitHub URL for user reference", () => {
    const customUrl = "https://github.com/user/repo/pull/123";
    render(
      <GitHubPRAlert
        {...defaultProps}
        githubUrl={customUrl}
      />
    );

    expect(screen.getByText(customUrl)).toBeInTheDocument();
  });

  it("should maintain confirmed state after multiple renders", () => {
    const { rerender } = render(<GitHubPRAlert {...defaultProps} />);

    const reviewButton = screen.getByText(/Mark as Reviewed/i);
    fireEvent.click(reviewButton);

    expect(screen.getByText(/GitHub Review Acknowledged/i)).toBeInTheDocument();

    rerender(<GitHubPRAlert {...defaultProps} />);

    expect(screen.getByText(/GitHub Review Acknowledged/i)).toBeInTheDocument();
  });

  it("should handle onConfirm being undefined", () => {
    render(<GitHubPRAlert {...defaultProps} onConfirm={undefined} />);

    const reviewButton = screen.getByText(/Mark as Reviewed/i);
    expect(() => fireEvent.click(reviewButton)).not.toThrow();
  });

  it("should render with gradient background styling", () => {
    const { container } = render(<GitHubPRAlert {...defaultProps} />);

    const card = container.querySelector("[class*='from-blue']");
    expect(card).toBeInTheDocument();
  });

  it("should have proper button styling with icons", () => {
    render(<GitHubPRAlert {...defaultProps} />);

    const viewButton = screen.getByText(/View on GitHub/i);
    const reviewButton = screen.getByText(/Mark as Reviewed/i);

    expect(viewButton).toHaveClass("bg-blue-600");
    expect(reviewButton).toHaveClass("flex-1");
  });
});
