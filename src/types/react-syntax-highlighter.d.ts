declare module "react-syntax-highlighter" {
  import { ComponentType } from "react";

  interface SyntaxHighlighterProps {
    [key: string]: unknown;
  }

  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export const Light: ComponentType<SyntaxHighlighterProps>;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  const vscDarkPlus: Record<string, unknown>;
  export { vscDarkPlus };
}
