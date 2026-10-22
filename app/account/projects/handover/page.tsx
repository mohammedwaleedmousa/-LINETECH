import HandoverClient from "../../../handover/HandoverClient";
import "../../../handover/handover.css";

export const metadata = {
  title: "Project Handover",
  description: "Private LINETECH client handover workspace.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HandoverClient />;
}
