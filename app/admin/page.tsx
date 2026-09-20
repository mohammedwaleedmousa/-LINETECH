import AdminClient from "./AdminClient";
import "./admin.css";

export const metadata = {
  title: "LINETECH Admin",
  description: "Private LINETECH project administration workspace.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminClient />;
}
