// src/components/ui/mermaid-chart.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { AlertCircle } from "lucide-react";

interface MermaidChartProps {
  code: string;
}

// 初始化設定 (只執行一次)
mermaid.initialize({
  startOnLoad: false,
  theme: "dark", // 關鍵：配合你的 Dark Mode
  securityLevel: "loose",
  fontFamily: "inherit",
});

export function MermaidChart({ code }: MermaidChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!ref.current) return;

      try {
        setError(null);
        // 生成唯一的 ID，避免 React Re-render 時 ID 衝突
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Mermaid 渲染 API
        // parse 檢查語法是否正確
        await mermaid.parse(code);

        // render 生成 SVG
        const { svg } = await mermaid.render(id, code);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        // 捕捉並顯示錯誤，避免整個 App Crash
        setError("無法渲染圖表，可能是語法有誤。");
      }
    };

    renderChart();
  }, [code]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-400 border border-red-900/50 rounded-lg bg-red-950/10">
        <AlertCircle className="w-6 h-6 mb-2" />
        <p className="text-sm font-medium">{error}</p>
        <pre className="mt-2 text-xs text-muted-foreground bg-black/20 p-2 rounded w-full overflow-auto">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid-container w-full flex justify-center py-4 overflow-x-auto"
      // 使用 dangerouslySetInnerHTML 插入生成的 SVG
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
