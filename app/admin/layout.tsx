import type { Metadata } from "next";
import AdminShell from "./AdminShell";
import "./admin.css";
import "./admin-shell.css";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s — LINETECH Admin",
  },
  description: "Private LINETECH administration workspace.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
