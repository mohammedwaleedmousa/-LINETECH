import AdminLoginClient from "./AdminLoginClient";
import "./admin-login.css";

export const metadata = {
  title: "Admin Sign In",
  description: "Private LINETECH administration sign in.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminLoginClient />;
}
