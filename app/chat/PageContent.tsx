"use client";

import Localized from "../Localized";
import ChatWorkspace from "./ChatWorkspace";



export default function ChatPage(){
  return <Localized><main className="chat-page">
    <ChatWorkspace />
  </main></Localized>;
}
