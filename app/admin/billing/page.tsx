import BillingClient from "../BillingClient";

export const metadata = {
  title: "Billing",
  description: "LINETECH subscription and billing control center.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BillingClient />;
}
