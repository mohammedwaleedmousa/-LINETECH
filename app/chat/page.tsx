import ChatWorkspace from "./ChatWorkspace";

export const metadata = {
  title: "Chat",
  description: "Client conversation workspace for LINETECH projects.",
  robots: { index: false, follow: false },
};

export default function ChatPage(){
  return <main className="chat-page">
    <ChatWorkspace />
  </main>;
}
