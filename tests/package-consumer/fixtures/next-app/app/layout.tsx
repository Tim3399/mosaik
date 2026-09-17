import "@tim3399/mosaik/styles.css";
import type { ReactNode } from "react";

export const metadata = { title: "mosaik consumer (Next.js)" };

// No data-mosaik-mode here: the default without a scope must render valid light colors.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
