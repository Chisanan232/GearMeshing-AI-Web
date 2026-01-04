// src/components/layout/create-folder-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MAX_FOLDER_NAME_LENGTH = 20;

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFolder: (name: string) => void;
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  onCreateFolder,
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");

  const isAtMaxLength = folderName.length >= MAX_FOLDER_NAME_LENGTH;
  const isValid = folderName.trim().length > 0 && !isAtMaxLength;

  const handleCreate = () => {
    if (isValid) {
      onCreateFolder(folderName);
      setFolderName("");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFolderName("");
    }
    onOpenChange(newOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_FOLDER_NAME_LENGTH) {
      setFolderName(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your chat sessions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <input
              autoFocus
              type="text"
              placeholder="Folder name..."
              value={folderName}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isValid) handleCreate();
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">
                {folderName.length}/{MAX_FOLDER_NAME_LENGTH}
              </span>
              {isAtMaxLength && (
                <span className="text-xs text-red-500">
                  Maximum length reached
                </span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!isValid}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
          >
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
