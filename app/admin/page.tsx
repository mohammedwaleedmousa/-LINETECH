import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard",
  description: "LINETECH administration control center.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardClient />;
}
