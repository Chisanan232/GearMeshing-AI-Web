// src/components/ui/code-diff-viewer.tsx
"use client";

import React from "react";
import { DiffEditor } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

interface CodeDiffViewerProps {
  original: string; // 修改前的程式碼
  modified: string; // 修改後的程式碼
  language?: string; // 語言 (typescript, python, json...)
}

export function CodeDiffViewer({
  original,
  modified,
  language = "typescript",
}: CodeDiffViewerProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-md border bg-[#1e1e1e]">
      <DiffEditor
        height="100%"
        language={language}
        original={original}
        modified={modified}
        theme="vs-dark" // 使用 VS Code 標準深色主題
        options={{
          renderSideBySide: true, // 並排顯示 (false 則為 Inline)
          readOnly: true, // 預設唯讀
          minimap: { enabled: false }, // 關閉右側縮圖以節省空間
          scrollBeyondLastLine: false,
          fontSize: 13,
          automaticLayout: true, // 自動適應容器大小
          diffWordWrap: "off",
        }}
        loading={
          <div className="flex h-full w-full items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading Diff Editor...</span>
          </div>
        }
      />
    </div>
  );
}
