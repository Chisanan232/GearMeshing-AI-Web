// src/components/ui/markdown-renderer.tsx
"use client";

import React, { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定義 Code Block 渲染
          code({
            inline,
            className,
            children,
          }: {
            inline?: boolean;
            className?: string;
            children?: ReactNode;
          }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            return !inline && match ? (
              <div className="rounded-md overflow-hidden border bg-[#1e1e1e] my-4">
                <div className="flex items-center justify-between px-3 py-1 bg-white/5 text-xs text-muted-foreground border-b">
                  <span>{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    padding: "1rem",
                    backgroundColor: "transparent",
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-orange-300">
                {children}
              </code>
            );
          },
          // 自定義表格渲染 (讓表格在 Dark Mode 下清楚可見)
          table({ children }: { children?: ReactNode }) {
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse text-sm">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }: { children?: ReactNode }) {
            return <thead className="bg-muted/50 border-b">{children}</thead>;
          },
          th({ children }: { children?: ReactNode }) {
            return (
              <th className="px-4 py-3 text-left font-semibold">{children}</th>
            );
          },
          td({ children }: { children?: ReactNode }) {
            return (
              <td className="px-4 py-3 border-b border-muted/20">{children}</td>
            );
          },
          // 自定義連結
          a({ children, href }: { children?: ReactNode; href?: string }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline cursor-pointer"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
