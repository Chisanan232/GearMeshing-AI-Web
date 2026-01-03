// src/components/layout/folder-item.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, FolderOpen, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSession, ChatFolder } from "@/store/use-ui-store";
import { useUIStore } from "@/store/use-ui-store";
import { SessionItem } from "./session-item";
import { cn } from "@/lib/utils";

interface FolderItemProps {
  folder: ChatFolder & { sessionCount: number };
  isExpanded: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
}

export function FolderItem({
  folder,
  isExpanded,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
}: FolderItemProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
  });

  const { updateFolder, deleteFolder } = useUIStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== folder.name) {
      updateFolder(folder.id, editName);
    }
    setIsEditing(false);
    setEditName(folder.name);
  };

  const handleDeleteFolder = () => {
    if (confirm(`Delete folder "${folder.name}"? Sessions will be moved to History.`)) {
      deleteFolder(folder.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg transition-colors",
        isOver && "bg-violet-500/20",
      )}
    >
      {/* Folder Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <div className="flex-1">
          {isEditing ? (
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setEditName(folder.name);
                }
              }}
              className="w-full rounded bg-white/10 px-2 py-1 text-sm text-white outline-none focus:bg-white/20"
            />
          ) : (
            <button
              onClick={onToggle}
              className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
            >
              <FolderOpen className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 truncate">{folder.name}</span>
              <span className="text-xs text-white/50">
                {folder.sessionCount}
              </span>
            </button>
          )}
        </div>

        {/* Folder Actions */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-6 w-6 p-0"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteFolder}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Folder Contents */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 border-l border-white/10 py-1 pl-8">
              {sessions.length > 0 ? (
                sessions
                  .sort(
                    (a, b) =>
                      new Date(b.updated_at).getTime() -
                      new Date(a.updated_at).getTime(),
                  )
                  .map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={activeSessionId === session.id}
                      onSelect={() => onSelectSession(session.id)}
                    />
                  ))
              ) : (
                <p className="px-3 py-2 text-xs text-white/40">
                  No sessions yet
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
