import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent 生命周期全景",
  description: "Claude Code v2.1.88 生命周期研究展开树(ReactFlow)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}