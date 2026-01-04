// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";
// 你可能需要先 pnpm add next-themes 並建立 ThemeProvider
// 這裡簡單演示直接在 body 加 class

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GearMeshing AI Console",
  description: "Automated Software Development Agent",
  icons: {
    icon: "/gearmeshing-ai-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* 強制 dark class，實務上建議用 next-themes 包裹 */}
      <body
        className={`${inter.className} bg-neutral-950 text-neutral-50 antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
