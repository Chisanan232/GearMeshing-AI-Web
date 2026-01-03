// src/components/chat/github-pr-alert.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Check } from "lucide-react";

interface GitHubPRAlertProps {
  id: string;
  prNumber: number;
  repoName: string;
  prTitle: string;
  description: string;
  githubUrl: string;
  onConfirm?: (id: string) => void;
}

export function GitHubPRAlert({
  id,
  prNumber,
  repoName,
  prTitle,
  description,
  githubUrl,
  onConfirm,
}: GitHubPRAlertProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm?.(id);
  };

  if (isConfirmed) {
    return (
      <div className="my-2 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-green-600">
              ✅ GitHub Review Acknowledged
            </div>
            <div className="text-xs text-green-600/70 mt-1">
              PR #{prNumber} in {repoName} marked as reviewed
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 rounded-lg border-2 border-blue-500/40 bg-gradient-to-br from-blue-500/8 to-blue-500/5 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with GitHub icon and PR info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
            <Github className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-blue-600 bg-blue-500/20 px-2 py-1 rounded">
              GitHub PR
            </span>
            <span className="text-xs font-medium text-blue-500">
              #{prNumber}
            </span>
            <span className="text-xs text-blue-500/70">•</span>
            <span className="text-xs text-blue-500/70">{repoName}</span>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-semibold text-blue-300 line-clamp-2">
              {prTitle}
            </h3>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-3 ml-13">
        <p className="text-sm text-blue-300/80 leading-relaxed">
          {description}
        </p>
      </div>

      {/* GitHub URL */}
      <div className="mb-4 ml-13">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 break-all hover:underline"
        >
          {githubUrl}
        </a>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 ml-13">
        <Button
          size="sm"
          className="h-8 text-xs bg-blue-600 hover:bg-blue-700 flex-1"
          onClick={() => window.open(githubUrl, "_blank")}
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          View on GitHub
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-8 text-xs flex-1"
          onClick={handleConfirm}
        >
          <Check className="h-3.5 w-3.5 mr-1.5" />
          Mark as Reviewed
        </Button>
      </div>
    </div>
  );
}
