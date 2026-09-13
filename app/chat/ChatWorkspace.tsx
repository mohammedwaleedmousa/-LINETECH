"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  sender: "company" | "client";
  text: string;
  time: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "company-welcome",
    sender: "company",
    text: "Welcome to LINETECH Chat. This space is designed for clear project conversations between you and the LINETECH team.",
    time: "09:00",
  },
  {
    id: "company-context",
    sender: "company",
    text: "You can use this conversation to discuss scope, questions, feedback and next steps for your project.",
    time: "09:01",
  },
];

const storageKey = "linetech-chat-preview";

function currentTime(){
  return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

export default function ChatWorkspace(){
  const [messages,setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft,setDraft] = useState("");
  const [notice,setNotice] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    try{
      const saved = window.localStorage.getItem(storageKey);
      if(saved){
        const parsed = JSON.parse(saved) as ChatMessage[];
        if(Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    }catch{}
  },[]);

  useEffect(()=>{
    try{ window.localStorage.setItem(storageKey, JSON.stringify(messages)); }catch{}
    requestAnimationFrame(()=>{
      const node = listRef.current;
      if(node) node.scrollTop = node.scrollHeight;
    });
  },[messages]);

  const lastMessage = useMemo(()=>messages[messages.length-1], [messages]);

  function sendMessage(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const text = draft.trim();
    if(!text) return;
    setMessages(current=>[...current,{
      id:`client-${Date.now()}`,
      sender:"client",
      text,
      time:currentTime(),
    }]);
    setDraft("");
    setNotice("Saved in this browser only — it has not been sent to LINETECH yet.");
  }

  function clearPreview(){
    setMessages(initialMessages);
    setNotice("Local preview conversation cleared.");
  }

  function attachmentPreview(){
    setNotice("Attachments will be enabled when the real chat backend is connected.");
  }

  return <section className="chat-shell" aria-label="LINETECH client chat">
    <aside className="chat-sidebar">
      <div className="chat-sidebar-head">
        <div>
          <span className="chat-eyebrow">LINETECH / CHAT</span>
          <h1>Messages</h1>
        </div>
        <button type="button" className="chat-new" onClick={clearPreview} aria-label="Clear local preview chat">+</button>
      </div>

      <div className="chat-search-box" aria-hidden="true">
        <span>⌕</span><p>Search conversations</p>
      </div>

      <div className="chat-conversations">
        <button className="chat-conversation active" type="button">
          <span className="chat-avatar"><i/><b/></span>
          <span className="chat-conversation-copy">
            <strong>LINETECH Project Team</strong>
            <small>{lastMessage?.sender === "client" ? "You: " : ""}{lastMessage?.text || "Start a conversation"}</small>
          </span>
          <span className="chat-conversation-time">{lastMessage?.time || ""}</span>
        </button>
      </div>

      <div className="chat-sidebar-foot">
        <span className="chat-status-dot"/>
        <div><strong>Frontend preview</strong><small>Messages stay on this device</small></div>
      </div>
    </aside>

    <div className="chat-main">
      <header className="chat-header">
        <div className="chat-header-person">
          <span className="chat-avatar large"><i/><b/></span>
          <div><strong>LINETECH Project Team</strong><span><i/> Company conversation</span></div>
        </div>
        <div className="chat-header-actions">
          <button type="button" aria-label="Search conversation">⌕</button>
          <button type="button" aria-label="Conversation menu">⋯</button>
        </div>
      </header>

      <div className="chat-preview-banner">
        <span>PREVIEW</span>
        <p>This chat is currently browser-only. Nothing here is sent to LINETECH until the backend and authentication are connected.</p>
      </div>

      <div className="chat-messages" ref={listRef}>
        <div className="chat-day"><span>TODAY</span></div>
        {messages.map(message=><div key={message.id} className={`chat-message-row ${message.sender}`}>
          <div className="chat-bubble">
            {message.sender === "company" && <strong>LINETECH</strong>}
            <p>{message.text}</p>
            <span>{message.time}{message.sender === "client" ? "  ✓" : ""}</span>
          </div>
        </div>)}
      </div>

      <footer className="chat-composer-wrap">
        {notice && <p className="chat-notice" role="status">{notice}</p>}
        <form className="chat-composer" onSubmit={sendMessage}>
          <button type="button" className="chat-attach" aria-label="Attach a file" onClick={attachmentPreview}>＋</button>
          <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write a message to LINETECH..." rows={1} aria-label="Message"/>
          <button type="submit" className="chat-send" aria-label="Send message">➤</button>
        </form>
      </footer>
    </div>
  </section>;
}
