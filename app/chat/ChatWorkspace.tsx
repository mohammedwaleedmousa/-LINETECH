"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  sender: "company" | "client";
  kind: "text" | "image" | "audio";
  text?: string;
  src?: string;
  fileName?: string;
  duration?: number;
  time: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "company-welcome",
    sender: "company",
    kind: "text",
    text: "Welcome to LINETECH. Send your project questions, files or voice notes here and keep the conversation in one place.",
    time: "09:00",
  },
  {
    id: "company-context",
    sender: "company",
    kind: "text",
    text: "When realtime messaging is connected, this will become the direct conversation between you and the LINETECH team.",
    time: "09:01",
  },
];

const storageKey = "linetech-chat-preview-v2";

function currentTime(){
  return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

function formatDuration(seconds = 0){
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2,"0")}`;
}

function readBlobAsDataUrl(blob: Blob){
  return new Promise<string>((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = ()=>resolve(String(reader.result || ""));
    reader.onerror = ()=>reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function compressImage(file: File){
  const source = await readBlobAsDataUrl(file);
  return new Promise<string>((resolve)=>{
    const image = new Image();
    image.onload = ()=>{
      const max = 1280;
      const scale = Math.min(1, max / Math.max(image.width,image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1,Math.round(image.width * scale));
      canvas.height = Math.max(1,Math.round(image.height * scale));
      const ctx = canvas.getContext("2d");
      if(!ctx){ resolve(source); return; }
      ctx.drawImage(image,0,0,canvas.width,canvas.height);
      resolve(canvas.toDataURL("image/jpeg",.78));
    };
    image.onerror = ()=>resolve(source);
    image.src = source;
  });
}

export default function ChatWorkspace(){
  const [messages,setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft,setDraft] = useState("");
  const [notice,setNotice] = useState("");
  const [recording,setRecording] = useState(false);
  const [recordingSeconds,setRecordingSeconds] = useState(0);
  const [dragging,setDragging] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const discardRecordingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

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
    try{
      window.localStorage.setItem(storageKey, JSON.stringify(messages));
    }catch{
      setNotice("This media is visible now, but the browser could not keep the full preview after refresh.");
    }
    requestAnimationFrame(()=>{
      const node = listRef.current;
      if(node) node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
    });
  },[messages]);

  useEffect(()=>()=>{
    if(timerRef.current) window.clearInterval(timerRef.current);
    mediaStreamRef.current?.getTracks().forEach(track=>track.stop());
  },[]);

  useEffect(()=>{
    const node = textareaRef.current;
    if(!node) return;
    node.style.height = "40px";
    node.style.height = `${Math.min(node.scrollHeight,112)}px`;
  },[draft]);

  const lastMessage = useMemo(()=>messages[messages.length-1], [messages]);

  function previewText(message?: ChatMessage){
    if(!message) return "Start a conversation";
    if(message.kind === "image") return "📷 Photo";
    if(message.kind === "audio") return "🎤 Voice message";
    return message.text || "Message";
  }

  function pushClientMessage(message: Omit<ChatMessage,"id"|"sender"|"time">){
    setMessages(current=>[...current,{
      ...message,
      id:`client-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      sender:"client",
      time:currentTime(),
    }]);
    setNotice("Saved on this device only — realtime delivery will start when the chat backend is connected.");
  }

  function sendMessage(event?:FormEvent<HTMLFormElement>){
    event?.preventDefault();
    const text = draft.trim();
    if(!text) return;
    pushClientMessage({kind:"text",text});
    setDraft("");
  }

  function handleComposerKeyDown(event:KeyboardEvent<HTMLTextAreaElement>){
    if(event.key === "Enter" && !event.shiftKey){
      event.preventDefault();
      sendMessage();
    }
  }

  async function addImages(files: FileList | File[]){
    const images = Array.from(files).filter(file=>file.type.startsWith("image/")).slice(0,4);
    if(!images.length) return;
    setNotice("Preparing image…");
    for(const file of images){
      try{
        const src = await compressImage(file);
        pushClientMessage({kind:"image",src,fileName:file.name});
      }catch{
        setNotice("This image could not be opened in the preview.");
      }
    }
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImages(event:ChangeEvent<HTMLInputElement>){
    if(event.target.files) void addImages(event.target.files);
  }

  async function startRecording(){
    if(recording) return;
    if(!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined"){
      setNotice("Voice recording is not available in this browser.");
      return;
    }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      const recorder = new MediaRecorder(stream);
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      discardRecordingRef.current = false;
      setRecordingSeconds(0);

      recorder.ondataavailable = event=>{
        if(event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = async ()=>{
        if(timerRef.current){ window.clearInterval(timerRef.current); timerRef.current = null; }
        mediaStreamRef.current?.getTracks().forEach(track=>track.stop());
        mediaStreamRef.current = null;
        setRecording(false);
        if(discardRecordingRef.current){
          chunksRef.current = [];
          setRecordingSeconds(0);
          setNotice("Voice recording cancelled.");
          return;
        }
        const blob = new Blob(chunksRef.current,{type:recorder.mimeType || "audio/webm"});
        chunksRef.current = [];
        if(!blob.size) return;
        try{
          const src = await readBlobAsDataUrl(blob);
          pushClientMessage({kind:"audio",src,duration:recordingSeconds});
        }catch{
          setNotice("Voice note could not be prepared.");
        }
        setRecordingSeconds(0);
      };

      recorder.start(200);
      setRecording(true);
      setNotice("");
      timerRef.current = window.setInterval(()=>setRecordingSeconds(value=>value+1),1000);
    }catch{
      setNotice("Microphone permission is needed to record a voice message.");
    }
  }

  function stopRecording(){
    discardRecordingRef.current = false;
    if(mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
  }

  function cancelRecording(){
    discardRecordingRef.current = true;
    if(mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
  }

  function clearPreview(){
    setMessages(initialMessages);
    try{ window.localStorage.removeItem(storageKey); }catch{}
    setNotice("Local preview conversation cleared.");
  }

  function onDrop(event:React.DragEvent<HTMLDivElement>){
    event.preventDefault();
    setDragging(false);
    if(event.dataTransfer.files?.length) void addImages(event.dataTransfer.files);
  }

  return <section className="chat-shell" aria-label="LINETECH client chat">
    <aside className="chat-sidebar">
      <div className="chat-sidebar-head">
        <div>
          <span className="chat-eyebrow">LINETECH</span>
          <h1>Chats</h1>
        </div>
        <button type="button" className="chat-new" onClick={clearPreview} aria-label="Clear local preview chat">＋</button>
      </div>

      <div className="chat-search-box" aria-hidden="true">
        <span>⌕</span><p>Search or start new chat</p>
      </div>

      <div className="chat-conversations">
        <button className="chat-conversation active" type="button">
          <span className="chat-avatar"><i/><b/></span>
          <span className="chat-conversation-copy">
            <strong>LINETECH Project Team</strong>
            <small>{lastMessage?.sender === "client" ? "You: " : ""}{previewText(lastMessage)}</small>
          </span>
          <span className="chat-conversation-time">{lastMessage?.time || ""}</span>
        </button>
      </div>

      <div className="chat-sidebar-foot">
        <span className="chat-status-dot"/>
        <div><strong>Preview mode</strong><small>Messages stay on this device</small></div>
      </div>
    </aside>

    <div className={`chat-main ${dragging?"is-dragging":""}`} onDragEnter={event=>{event.preventDefault();setDragging(true)}} onDragOver={event=>event.preventDefault()} onDragLeave={event=>{if(event.currentTarget===event.target)setDragging(false)}} onDrop={onDrop}>
      <header className="chat-header">
        <div className="chat-header-person">
          <span className="chat-avatar large"><i/><b/></span>
          <div><strong>LINETECH Project Team</strong><span><i/> Company conversation</span></div>
        </div>
        <div className="chat-header-actions">
          <button type="button" aria-label="Search conversation">⌕</button>
          <button type="button" aria-label="Conversation menu">⋮</button>
        </div>
      </header>

      <div className="chat-preview-banner">
        <span>PREVIEW</span>
        <p>Messages, photos and voice notes work locally now. Realtime delivery starts when authentication and the backend are connected.</p>
      </div>

      <div className="chat-messages" ref={listRef}>
        <div className="chat-encryption-note">🔒 This frontend preview stays on your device.</div>
        <div className="chat-day"><span>TODAY</span></div>
        {messages.map(message=><div key={message.id} className={`chat-message-row ${message.sender}`}>
          <div className={`chat-bubble ${message.kind}`}>
            {message.kind === "text" && <p>{message.text}</p>}
            {message.kind === "image" && message.src && <figure className="chat-image-message"><img src={message.src} alt={message.fileName || "Shared image"}/>{message.fileName&&<figcaption>{message.fileName}</figcaption>}</figure>}
            {message.kind === "audio" && message.src && <div className="chat-audio-message"><span className="chat-audio-avatar">●</span><div><audio controls preload="metadata" src={message.src}/><small>{formatDuration(message.duration)}</small></div></div>}
            <span className="chat-message-meta">{message.time}{message.sender === "client" ? <b aria-label="Saved locally">✓✓</b> : null}</span>
          </div>
        </div>)}
      </div>

      {dragging&&<div className="chat-drop-zone"><strong>Drop photos here</strong><span>They will be added to this conversation</span></div>}

      <footer className="chat-composer-wrap">
        {notice && <p className="chat-notice" role="status">{notice}</p>}
        {recording ? <div className="chat-recording-bar">
          <button type="button" className="recording-cancel" onClick={cancelRecording} aria-label="Cancel voice recording">×</button>
          <div className="recording-state"><i/><strong>{formatDuration(recordingSeconds)}</strong><span>Recording voice message</span></div>
          <button type="button" className="recording-send" onClick={stopRecording} aria-label="Send voice recording">➤</button>
        </div> : <form className="chat-composer" onSubmit={sendMessage}>
          <input ref={fileInputRef} className="chat-file-input" type="file" accept="image/*" multiple onChange={handleImages}/>
          <button type="button" className="chat-attach" aria-label="Add photos" onClick={()=>fileInputRef.current?.click()}>＋</button>
          <button type="button" className="chat-emoji" aria-label="Emoji">☺</button>
          <textarea ref={textareaRef} value={draft} onChange={event=>setDraft(event.target.value)} onKeyDown={handleComposerKeyDown} placeholder="Type a message" rows={1} aria-label="Message"/>
          {draft.trim()?<button type="submit" className="chat-send" aria-label="Send message">➤</button>:<button type="button" className="chat-mic" aria-label="Record voice message" onClick={startRecording}>●</button>}
        </form>}
      </footer>
    </div>
  </section>;
}
