// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { PluginProvider } from "@/contexts/plugin-context/plugin-context";
import { GovernanceProvider } from "@/contexts/governance-context";
import "./globals.css";
// You might want to pnpm add next-themes and create a ThemeProvider later
// For now, we simply add the class to the body

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
      {/* Forced dark class, practically suggested to wrap with next-themes */}
      <body
        className={`${inter.className} bg-neutral-950 text-neutral-50 antialiased`}
      >
        <PluginProvider>
          <AuthProvider>
            <GovernanceProvider>{children}</GovernanceProvider>
          </AuthProvider>
        </PluginProvider>
      </body>
    </html>
  );
}
