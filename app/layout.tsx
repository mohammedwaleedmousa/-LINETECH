import type { Metadata } from "next";
import "./globals.css";
import "./inner.css";
import "./polish.css";
import ScrollRestoration from "./scroll-restoration";

export const metadata: Metadata = {
  title: "LINETECH — Every idea starts with a line.",
  description: "LINETECH builds digital products, websites, systems and brand experiences from idea to launch.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ScrollRestoration />
        {children}
      </body>
    </html>
  );
}
