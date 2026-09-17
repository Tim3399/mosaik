import "@tim3399/mosaik/styles.css";
import "./showcase.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "mosaik showcase",
  description: "Components of @tim3399/mosaik in their supported modes and states.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-mosaik-mode="system">
      <body className="showcase-body">{children}</body>
    </html>
  );
}
