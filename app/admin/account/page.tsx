import AdminAccountClient from "./AdminAccountClient";
import "./admin-account.css";

export const metadata = {
  title: "Admin Account",
  description: "LINETECH administrator account settings.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminAccountClient />;
}
