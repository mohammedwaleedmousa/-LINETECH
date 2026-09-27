import AccountClient from "./AccountClient";

export const metadata = {
  title: "Account Settings",
  description: "Manage your LINETECH client profile, email, password and active sessions.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountClient />;
}
