import WorkspaceClient from "./WorkspaceClient";

export const metadata = {
  title: "Client Workspace",
  description: "LINETECH client workspace for project requests, status, messages, files and handover.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <WorkspaceClient />;
}
