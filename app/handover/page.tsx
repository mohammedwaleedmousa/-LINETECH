import HandoverClient from "./HandoverClient";
import "./handover.css";

export const metadata = {
  title: "Project Handover",
  description: "Private LINETECH client handover workspace.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HandoverClient />;
}
