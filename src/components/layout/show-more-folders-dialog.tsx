// src/components/layout/show-more-folders-dialog.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { FolderOpen, Search } from "lucide-react";
import { ChatSession, ChatFolder } from "@/store/use-ui-store";

interface ShowMoreFoldersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: ChatFolder[];
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
}

export function ShowMoreFoldersDialog({
  open,
  onOpenChange,
  folders,
  sessions,
  activeSessionId,
  onSelectSession,
}: ShowMoreFoldersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const foldersWithCounts = useMemo(() => {
    return folders
      .map((folder) => ({
        ...folder,
        sessionCount: sessions.filter((s) => s.folder_id === folder.id).length,
      }))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [folders, sessions]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return foldersWithCounts;
    return foldersWithCounts.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [foldersWithCounts, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>All Folders</DialogTitle>
          <DialogDescription>
            Browse and select from all your chat folders
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-neutral-700 bg-neutral-800 pl-10 text-neutral-100 placeholder-neutral-500 focus:border-neutral-600 focus:ring-neutral-600"
          />
        </div>

        {/* Folders Grid */}
        <ScrollArea className="h-[400px] w-full">
          <div className="grid gap-3 pr-4">
            {filteredFolders.length > 0 ? (
              filteredFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  sessions={sessions.filter((s) => s.folder_id === folder.id)}
                  activeSessionId={activeSessionId}
                  onSelectSession={onSelectSession}
                  onClose={() => onOpenChange(false)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderOpen className="mb-2 h-8 w-8 text-neutral-500" />
                <p className="text-sm text-neutral-400">
                  No folders found
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface FolderCardProps {
  folder: ChatFolder & { sessionCount: number };
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onClose: () => void;
}

function FolderCard({
  folder,
  sessions,
  activeSessionId,
  onSelectSession,
  onClose,
}: FolderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4 hover:bg-neutral-750 transition-colors">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-5 w-5 text-violet-400" />
            <div>
              <h3 className="font-medium text-neutral-100">{folder.name}</h3>
              <p className="text-xs text-neutral-400">
                {folder.sessionCount} session{folder.sessionCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <span className="text-xs text-neutral-400">
            {isExpanded ? "−" : "+"}
          </span>
        </div>
      </button>

      {/* Sessions List */}
      {isExpanded && sessions.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-neutral-700 pt-3">
          {sessions
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
            )
            .map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
                className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                  activeSessionId === session.id
                    ? "bg-violet-500/30 text-violet-200"
                    : "text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100"
                }`}
              >
                <p className="truncate font-medium">{session.title}</p>
                {session.preview && (
                  <p className="truncate text-xs opacity-70">
                    {session.preview}
                  </p>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
