// src/components/layout/sidebar-sessions.tsx
"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus, FolderOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore } from "@/store/use-ui-store";
import { useChatSessions } from "@/hooks/useChatSessions";
import { SessionItem } from "./session-item";
import { FolderItem } from "./folder-item";
import { CreateFolderDialog } from "./create-folder-dialog";
import { ShowMoreFoldersDialog } from "./show-more-folders-dialog";

const MAX_FOLDERS_DISPLAY = 5;
const INITIAL_HISTORY_DISPLAY = 20;
const HISTORY_LOAD_MORE = 20;

export function SidebarSessions() {
  const {
    sessions,
    folders,
    activeSessionId,
    setActiveSession,
    createSession,
    moveSessionToFolder,
    createFolder,
    updateSession,
    deleteSession,
  } = useUIStore();

  useChatSessions(); // Initialize mock data

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showMoreFolders, setShowMoreFolders] = useState(false);
  const [displayedHistoryCount, setDisplayedHistoryCount] = useState(
    INITIAL_HISTORY_DISPLAY,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  // Get history sessions (no folder)
  const historySessions = useMemo(
    () => sessions.filter((s) => s.folder_id === null),
    [sessions],
  );

  // Get top 5 folders sorted by most recent updated_at
  const topFolders = useMemo(() => {
    return folders
      .map((folder) => ({
        ...folder,
        sessionCount: sessions.filter((s) => s.folder_id === folder.id).length,
      }))
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      .slice(0, MAX_FOLDERS_DISPLAY);
  }, [folders, sessions]);

  const hasMoreFolders = folders.length > MAX_FOLDERS_DISPLAY;

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const sessionId = active.id as string;
    const folderId = over.id as string;

    // Only move if dropping on a folder
    if (folderId.startsWith("folder-")) {
      moveSessionToFolder(sessionId, folderId);
      // Expand the folder to show the moved session
      setExpandedFolders((prev) => new Set(prev).add(folderId));
    }
  };

  const handleNewChat = () => {
    createSession("New Chat");
  };

  const handleCreateFolder = (name: string) => {
    createFolder(name);
    setShowCreateFolder(false);
  };

  // Handle scroll to load more history items
  const handleLoadMoreHistory = useCallback(async () => {
    if (isLoadingMore || displayedHistoryCount >= historySessions.length) {
      return;
    }

    setIsLoadingMore(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    setDisplayedHistoryCount((prev) =>
      Math.min(prev + HISTORY_LOAD_MORE, historySessions.length),
    );
    setIsLoadingMore(false);
  }, [isLoadingMore, displayedHistoryCount, historySessions.length]);

  // Set up scroll detection and stable scrollbar
  useEffect(() => {
    const scrollAreaRoot = scrollAreaRef.current;
    if (!scrollAreaRoot) return;

    // Find the viewport element inside the ScrollArea (Radix UI structure)
    const viewport = scrollAreaRoot.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
    if (!viewport) return;

    // 1. Apply stable scrollbar gutter to prevent layout shift
    viewport.style.scrollbarGutter = "stable";

    // 2. Find the direct child of the viewport and override its 'display: table' style
    const content = viewport.querySelector<HTMLElement>(":scope > div");
    if (content) {
      content.style.display = "block";
    }

    // 3. Set up scroll detection for history loading
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      // Trigger load more when user scrolls to bottom (within 100px)
      if (scrollHeight - scrollTop - clientHeight < 100) {
        handleLoadMoreHistory();
      }
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [handleLoadMoreHistory]);

  return (
    <div className="flex h-full flex-col min-h-0 border-r bg-neutral-950">
      {/* New Chat Button */}
      <div className="border-b border-white/10 p-3">
        <Button
          onClick={handleNewChat}
          className="w-full bg-violet-600 hover:bg-violet-700 text-sm h-9"
        >
          <Plus className="mr-2 h-3 w-3" />
          New Chat
        </Button>
      </div>

      {/* Sessions & Folders */}
      <ScrollArea
        className="flex-1 min-h-0 [scrollbar-gutter:stable]"
        ref={scrollAreaRef}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-2 p-3">
            {/* Folders Section */}
            {topFolders.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pl-2 pr-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-semibold text-white/60">
                      FOLDERS
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateFolder(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <AnimatePresence>
                  {topFolders.map((folder) => (
                    <motion.div
                      key={folder.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FolderItem
                        folder={folder}
                        isExpanded={expandedFolders.has(folder.id)}
                        onToggle={() => toggleFolder(folder.id)}
                        sessions={sessions.filter(
                          (s) => s.folder_id === folder.id,
                        )}
                        activeSessionId={activeSessionId}
                        onSelectSession={setActiveSession}
                        folders={folders}
                        onSessionRename={(sessionId, newTitle) =>
                          updateSession(sessionId, { title: newTitle })
                        }
                        onSessionMoveToFolder={moveSessionToFolder}
                        onSessionDelete={deleteSession}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {hasMoreFolders && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMoreFolders(true)}
                    className="w-full justify-start text-xs text-white/50 hover:text-white/70"
                  >
                    Show More Folders ({folders.length - MAX_FOLDERS_DISPLAY})
                  </Button>
                )}
              </div>
            )}

            {/* History Section */}
            {historySessions.length > 0 && (
              <div className="space-y-2">
                <h3 className="px-2 text-xs font-semibold text-white/60">
                  HISTORY ({historySessions.length})
                </h3>
                <AnimatePresence>
                  {historySessions
                    .sort(
                      (a, b) =>
                        new Date(b.updated_at).getTime() -
                        new Date(a.updated_at).getTime(),
                    )
                    .slice(0, displayedHistoryCount)
                    .map((session) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SessionItem
                          session={session}
                          isActive={activeSessionId === session.id}
                          onSelect={() => setActiveSession(session.id)}
                          folders={folders}
                          onRename={(sessionId, newTitle) =>
                            updateSession(sessionId, { title: newTitle })
                          }
                          onMoveToFolder={moveSessionToFolder}
                          onDelete={deleteSession}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>

                {/* Load More Button */}
                {displayedHistoryCount < historySessions.length && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLoadMoreHistory}
                      disabled={isLoadingMore}
                      className="text-xs text-white/50 hover:text-white/70"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        `Load More (${historySessions.length - displayedHistoryCount} remaining)`
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {sessions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderOpen className="mb-2 h-8 w-8 text-white/30" />
                <p className="text-sm text-white/50">No chats yet</p>
                <p className="text-xs text-white/40">
                  Create a new chat to get started
                </p>
              </div>
            )}
          </div>
        </DndContext>
      </ScrollArea>

      {/* Dialogs */}
      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        onCreateFolder={handleCreateFolder}
      />

      <ShowMoreFoldersDialog
        open={showMoreFolders}
        onOpenChange={setShowMoreFolders}
        folders={folders}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSession}
      />
    </div>
  );
}
