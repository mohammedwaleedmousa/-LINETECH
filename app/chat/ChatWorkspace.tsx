"use client";

import Localized from "../Localized";

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  sender: "company" | "client";
  kind: "text" | "image" | "audio" | "document";
  text?: string;
  src?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  duration?: number;
  edited?: boolean;
  deleted?: boolean;
  time: string;
};

type IconName = "attach" | "image" | "document" | "mic" | "send" | "play" | "pause" | "edit" | "trash" | "more" | "close" | "download";

const emojis = ["👍","👏","✅","🔥","💡","🎯","🚀","🤝","😊","🙏","💙","✨"];

function Icon({name,size=18}:{name:IconName;size?:number}){
  const common = {width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round" as const,strokeLinejoin:"round" as const,"aria-hidden":true};
  if(name==="attach") return <svg {...common}><path d="M20.5 11.5 11 21a6 6 0 0 1-8.5-8.5l10-10a4 4 0 0 1 5.7 5.7L8.7 17.7a2 2 0 0 1-2.8-2.8l9-9"/></svg>;
  if(name==="image") return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-4.5-4.5L7 20"/></svg>;
  if(name==="document") return <svg {...common}><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></svg>;
  if(name==="mic") return <svg {...common}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/></svg>;
  if(name==="send") return <svg {...common}><path d="m3 11.5 18-8-7.5 17-2-7zM11.5 13.5 21 3.5"/></svg>;
  if(name==="play") return <svg {...common} fill="currentColor" stroke="none"><path d="m8 5 11 7-11 7z"/></svg>;
  if(name==="pause") return <svg {...common}><path d="M9 5v14M15 5v14"/></svg>;
  if(name==="edit") return <svg {...common}><path d="M4 20h4l11-11-4-4L4 16zM13.5 6.5l4 4"/></svg>;
  if(name==="trash") return <svg {...common}><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></svg>;
  if(name==="more") return <svg {...common}><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>;
  if(name==="close") return <svg {...common}><path d="m6 6 12 12M18 6 6 18"/></svg>;
  return <svg {...common}><path d="M12 3v12M7 10l5 5 5-5M5 20h14"/></svg>;
}

const initialMessages: ChatMessage[] = [];

function currentTime(){
  return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

function formatDuration(seconds = 0){
  const value = Number.isFinite(seconds) ? Math.max(0,Math.round(seconds)) : 0;
  const mins = Math.floor(value / 60);
  const secs = value % 60;
  return `${mins}:${String(secs).padStart(2,"0")}`;
}

function formatBytes(bytes = 0){
  if(bytes < 1024) return `${bytes} B`;
  if(bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/(1024*1024)).toFixed(1)} MB`;
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

function VoiceMessage({src,duration}:{src:string;duration?:number}){
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing,setPlaying] = useState(false);
  const [current,setCurrent] = useState(0);
  const [total,setTotal] = useState(duration || 0);

  function toggle(){
    const audio = audioRef.current;
    if(!audio) return;
    if(audio.paused){ void audio.play(); } else { audio.pause(); }
  }

  const progress = total > 0 ? Math.min(100,(current/total)*100) : 0;

  return <Localized><div className="chat-voice-message">
    <audio
      ref={audioRef}
      src={src}
      preload="metadata"
      onPlay={()=>setPlaying(true)}
      onPause={()=>setPlaying(false)}
      onEnded={()=>{setPlaying(false);setCurrent(0)}}
      onTimeUpdate={event=>setCurrent(event.currentTarget.currentTime)}
      onLoadedMetadata={event=>{
        if(Number.isFinite(event.currentTarget.duration)) setTotal(event.currentTarget.duration);
      }}
    />
    <button type="button" className="voice-play" onClick={toggle} aria-label={playing?"Pause voice message":"Play voice message"}><Icon name={playing?"pause":"play"} size={16}/></button>
    <div className="voice-track">
      <div className="voice-wave" aria-hidden="true">{Array.from({length:28},(_,i)=><i key={i} style={{height:`${7 + ((i*7)%15)}px`}}/> )}</div>
      <span className="voice-progress" style={{width:`${progress}%`}}/>
    </div>
    <div className="voice-duration"><Icon name="mic" size={13}/><span>{formatDuration(playing?current:total || duration)}</span></div>
  </div></Localized>;
}

export default function ChatWorkspace(){
  const [messages,setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft,setDraft] = useState("");
  const [notice,setNotice] = useState("");
  const [recording,setRecording] = useState(false);
  const [recordingSeconds,setRecordingSeconds] = useState(0);
  const [dragging,setDragging] = useState(false);
  const [attachmentsOpen,setAttachmentsOpen] = useState(false);
  const [emojiOpen,setEmojiOpen] = useState(false);
  const [actionMessageId,setActionMessageId] = useState<string | null>(null);
  const [editingId,setEditingId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const discardRecordingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const recordingSecondsRef = useRef(0);

  async function loadMessages(silent = false){
    try{
      const response = await fetch("/api/chat/messages", { cache: "no-store" });
      if(response.status === 401){
        window.location.assign("/login?next=/chat");
        return;
      }

      const payload = await response.json().catch(()=>null) as {
        ok?: boolean;
        messages?: ChatMessage[];
      } | null;

      if(response.ok && payload?.ok && Array.isArray(payload.messages)){
        setMessages([...initialMessages, ...payload.messages]);
      }else if(!silent){
        setNotice("Conversation could not be loaded.");
      }
    }catch{
      if(!silent) setNotice("Conversation could not be loaded.");
    }
  }

  useEffect(()=>{
    void loadMessages();
    const timer = window.setInterval(()=>void loadMessages(true), 5000);
    return ()=>window.clearInterval(timer);
  },[]);

  useEffect(()=>{
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
  const editingMessage = editingId ? messages.find(message=>message.id===editingId) : undefined;

  function previewText(message?: ChatMessage){
    if(!message) return "Start a conversation";
    if(message.deleted) return "Message deleted";
    if(message.kind === "image") return "Photo";
    if(message.kind === "audio") return "Voice message";
    if(message.kind === "document") return message.fileName || "Document";
    return message.text || "Message";
  }

  function mergeMessage(message:ChatMessage){
    setMessages(current=>{
      const without = current.filter(item=>item.id!==message.id);
      return [...without,message];
    });
    setActionMessageId(null);
    setEmojiOpen(false);
  }

  async function sendMessage(event?:FormEvent<HTMLFormElement>){
    event?.preventDefault();
    const text = draft.trim();
    if(!text) return;

    try{
      if(editingId){
        const response = await fetch("/api/chat/messages",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({messageId:editingId,text}),
        });
        const payload = await response.json().catch(()=>null) as {ok?:boolean;message?:ChatMessage}|null;
        if(!response.ok || !payload?.ok || !payload.message){
          setNotice("Message could not be edited.");
          return;
        }

        setMessages(current=>current.map(message=>message.id===editingId ? payload.message! : message));
        setEditingId(null);
        setDraft("");
        setNotice("Message edited.");
        return;
      }

      const response = await fetch("/api/chat/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({text}),
      });
      const payload = await response.json().catch(()=>null) as {ok?:boolean;message?:ChatMessage}|null;
      if(!response.ok || !payload?.ok || !payload.message){
        setNotice("Message could not be sent.");
        return;
      }

      mergeMessage(payload.message);
      setDraft("");
      setNotice("");
    }catch{
      setNotice("Message could not be sent.");
    }
  }

  function handleComposerKeyDown(event:KeyboardEvent<HTMLTextAreaElement>){
    if(event.key === "Enter" && !event.shiftKey){
      event.preventDefault();
      sendMessage();
    }
  }

  function addEmoji(emoji:string){
    setDraft(current=>`${current}${emoji}`);
    setEmojiOpen(false);
    requestAnimationFrame(()=>textareaRef.current?.focus());
  }

  function beginEdit(message:ChatMessage){
    if(message.sender!=="client" || message.kind!=="text" || message.deleted) return;
    setEditingId(message.id);
    setDraft(message.text || "");
    setActionMessageId(null);
    setAttachmentsOpen(false);
    setEmojiOpen(false);
    requestAnimationFrame(()=>textareaRef.current?.focus());
  }

  function cancelEdit(){
    setEditingId(null);
    setDraft("");
  }

  async function deleteForEveryone(messageId:string){
    try{
      const response = await fetch("/api/chat/messages",{
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messageId}),
      });
      if(!response.ok){
        setNotice("Message could not be deleted.");
        return;
      }

      setMessages(current=>current.map(message=>message.id===messageId ? {
        ...message,
        deleted:true,
        text:undefined,
        src:undefined,
        fileName:undefined,
        fileSize:undefined,
        fileType:undefined,
      } : message));
      if(editingId===messageId) cancelEdit();
      setActionMessageId(null);
      setNotice("Message deleted.");
    }catch{
      setNotice("Message could not be deleted.");
    }
  }

  async function uploadChatFile(file:File, kind:"image"|"audio"|"document", duration?:number){
    const form = new FormData();
    form.append("file",file);
    form.append("kind",kind);
    if(typeof duration === "number") form.append("duration",String(duration));

    const response = await fetch("/api/chat/upload",{method:"POST",body:form});
    const payload = await response.json().catch(()=>null) as {ok?:boolean;message?:ChatMessage}|null;
    if(!response.ok || !payload?.ok || !payload.message) throw new Error("Upload failed");
    mergeMessage(payload.message);
    return payload.message;
  }

  async function addImages(files: FileList | File[]){
    const images = Array.from(files).filter(file=>file.type.startsWith("image/")).slice(0,4);
    if(!images.length) return;
    setAttachmentsOpen(false);
    setEmojiOpen(false);
    setNotice("Preparing image…");
    for(const file of images){
      try{
        const src = await compressImage(file);
        const blob = await (await fetch(src)).blob();
        const upload = new File([blob],file.name,{type:blob.type || "image/jpeg"});
        await uploadChatFile(upload,"image");
        setNotice("");
      }catch{
        setNotice("This image could not be uploaded.");
      }
    }
    if(imageInputRef.current) imageInputRef.current.value = "";
  }

  async function addDocuments(files: FileList | File[]){
    const documents = Array.from(files).filter(file=>!file.type.startsWith("image/")).slice(0,3);
    if(!documents.length) return;
    setAttachmentsOpen(false);
    setEmojiOpen(false);
    for(const file of documents){
      if(file.size > 5 * 1024 * 1024){
        setNotice(`${file.name} is larger than 5 MB. Choose a smaller document.`);
        continue;
      }
      try{
        await uploadChatFile(file,"document");
        setNotice("");
      }catch{
        setNotice(`${file.name} could not be uploaded.`);
      }
    }
    if(documentInputRef.current) documentInputRef.current.value = "";
  }

  function handleImages(event:ChangeEvent<HTMLInputElement>){
    if(event.target.files) void addImages(event.target.files);
  }

  function handleDocuments(event:ChangeEvent<HTMLInputElement>){
    if(event.target.files) void addDocuments(event.target.files);
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
      recordingSecondsRef.current = 0;
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
          recordingSecondsRef.current = 0;
          setRecordingSeconds(0);
          setNotice("Voice recording cancelled.");
          return;
        }
        const blob = new Blob(chunksRef.current,{type:recorder.mimeType || "audio/webm"});
        chunksRef.current = [];
        if(!blob.size) return;
        try{
          const extension = blob.type.includes("ogg") ? "ogg" : blob.type.includes("mp4") ? "m4a" : "webm";
          const file = new File([blob],`voice-${Date.now()}.${extension}`,{type:blob.type || "audio/webm"});
          await uploadChatFile(file,"audio",recordingSecondsRef.current);
          setNotice("");
        }catch{
          setNotice("Voice note could not be uploaded.");
        }
        recordingSecondsRef.current = 0;
        setRecordingSeconds(0);
      };

      recorder.start(200);
      setRecording(true);
      setAttachmentsOpen(false);
      setEmojiOpen(false);
      setNotice("");
      timerRef.current = window.setInterval(()=>{
        recordingSecondsRef.current += 1;
        setRecordingSeconds(recordingSecondsRef.current);
      },1000);
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
    setEditingId(null);
    setDraft("");
    setAttachmentsOpen(false);
    setEmojiOpen(false);
    setActionMessageId(null);
    setNotice("");
    void loadMessages();
  }

  function onDrop(event:React.DragEvent<HTMLDivElement>){
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files || []);
    if(!files.length) return;
    const images = files.filter(file=>file.type.startsWith("image/"));
    const documents = files.filter(file=>!file.type.startsWith("image/"));
    if(images.length) void addImages(images);
    if(documents.length) void addDocuments(documents);
  }

  return <Localized><section className="chat-shell" aria-label="LINETECH client chat">
    <aside className="chat-sidebar">
      <div className="chat-sidebar-head">
        <div><span className="chat-eyebrow">LINETECH</span><h1>Chats</h1></div>
        <button type="button" className="chat-new" onClick={clearPreview} aria-label="Refresh project conversation">＋</button>
      </div>

      <div className="chat-search-box" aria-hidden="true"><span>⌕</span><p>Search or start new chat</p></div>

      <div className="chat-conversations">
        <button className="chat-conversation active" type="button">
          <span className="chat-avatar"><i/><b/></span>
          <span className="chat-conversation-copy"><strong>LINETECH Project Team</strong><small>{lastMessage?.sender === "client" ? "You: " : ""}<span data-no-translate={Boolean(lastMessage && !lastMessage.deleted && (lastMessage.sender === "client" && lastMessage.kind === "text" || lastMessage.kind === "document" && lastMessage.fileName))}>{previewText(lastMessage)}</span></small></span>
          <span className="chat-conversation-time">{lastMessage?.time || ""}</span>
        </button>
      </div>

      <div className="chat-sidebar-foot"><span className="chat-status-dot"/><div><strong>Project conversation</strong><small>Synced with your workspace</small></div></div>
    </aside>

    <div className={`chat-main ${dragging?"is-dragging":""}`} onDragEnter={event=>{event.preventDefault();setDragging(true)}} onDragOver={event=>event.preventDefault()} onDragLeave={event=>{if(event.currentTarget===event.target)setDragging(false)}} onDrop={onDrop}>
      <header className="chat-header">
        <div className="chat-header-person"><span className="chat-avatar large"><i/><b/></span><div><strong>LINETECH Project Team</strong><span><i/> Project conversation</span></div></div>
        <div className="chat-header-actions"><button type="button" aria-label="Search conversation">⌕</button><button type="button" aria-label="Conversation menu"><Icon name="more"/></button></div>
      </header>

      <div className="chat-preview-banner"><span>PROJECT WORKSPACE</span><p>Messages, photos, documents and voice notes are securely connected to this project.</p></div>

      <div className="chat-messages" ref={listRef}>
        <div className="chat-encryption-note">This conversation is connected to your LINETECH workspace.</div>
        <div className="chat-day"><span>TODAY</span></div>
        {messages.map(message=><div key={message.id} className={`chat-message-row ${message.sender}`}>
          <div className={`chat-bubble ${message.deleted?"deleted":message.kind}`}>
            {message.sender==="client" && !message.deleted && <div className={`chat-message-actions ${actionMessageId===message.id?"open":""}`}>
              <button type="button" className="chat-message-more" aria-label="Message actions" onClick={()=>setActionMessageId(current=>current===message.id?null:message.id)}><Icon name="more" size={16}/></button>
              {actionMessageId===message.id && <div className="chat-message-menu">
                {message.kind==="text" && <button type="button" onClick={()=>beginEdit(message)}><Icon name="edit" size={15}/><span>Edit message</span></button>}
                <button type="button" className="danger" onClick={()=>deleteForEveryone(message.id)}><Icon name="trash" size={15}/><span>Delete message</span></button>
              </div>}
            </div>}

            {message.deleted ? <div className="chat-deleted-message"><Icon name="trash" size={15}/><span>This message was deleted.</span></div> : <>
              {message.kind === "text" && <p data-no-translate={message.sender === "client"}>{message.text}</p>}
              {message.kind === "image" && message.src && <figure className="chat-image-message"><img src={message.src} alt="Shared image"/>{message.fileName&&<figcaption><Icon name="image" size={13}/><span data-no-translate>{message.fileName}</span></figcaption>}</figure>}
              {message.kind === "audio" && message.src && <VoiceMessage src={message.src} duration={message.duration}/>} 
              {message.kind === "document" && message.src && <div className="chat-document-message">
                <span className="chat-document-icon"><Icon name="document" size={22}/></span>
                <div><strong data-no-translate={Boolean(message.fileName)}>{message.fileName || "Document"}</strong><small>{formatBytes(message.fileSize)}</small></div>
                <a href={message.src} download={message.fileName || "document"} aria-label="Download document"><Icon name="download" size={17}/></a>
              </div>}
            </>}
            <span className="chat-message-meta">{message.edited&&!message.deleted?<em>edited</em>:null}{message.time}{message.sender === "client" && !message.deleted ? <b aria-label="Saved to project workspace">✓✓</b> : null}</span>
          </div>
        </div>)}
      </div>

      {dragging&&<div className="chat-drop-zone"><strong>Drop files here</strong><span>Photos and documents will be added to this conversation</span></div>}

      <footer className="chat-composer-wrap">
        {notice && <p className="chat-notice" role="status">{notice}</p>}
        {editingMessage && <div className="chat-editing-bar"><span><Icon name="edit" size={15}/></span><div><strong>Editing message</strong><small data-no-translate>{editingMessage.text}</small></div><button type="button" onClick={cancelEdit} aria-label="Cancel editing"><Icon name="close" size={17}/></button></div>}

        {attachmentsOpen && !recording && <div className="chat-attachment-menu">
          <button type="button" onClick={()=>imageInputRef.current?.click()}><span className="attachment-icon image"><Icon name="image" size={20}/></span><div><strong>Photos</strong><small>Upload up to 4 images</small></div></button>
          <button type="button" onClick={()=>documentInputRef.current?.click()}><span className="attachment-icon document"><Icon name="document" size={20}/></span><div><strong>Document</strong><small>PDF, Word, Excel and more</small></div></button>
        </div>}

        {emojiOpen && !recording && <div className="chat-emoji-menu" role="dialog" aria-label="Choose emoji">
          {emojis.map(emoji=><button type="button" key={emoji} onClick={()=>addEmoji(emoji)} aria-label={`Add ${emoji}`}>{emoji}</button>)}
        </div>}

        {recording ? <div className="chat-recording-bar">
          <button type="button" className="recording-cancel" onClick={cancelRecording} aria-label="Cancel voice recording"><Icon name="close" size={20}/></button>
          <div className="recording-state"><i/><strong>{formatDuration(recordingSeconds)}</strong><span><Icon name="mic" size={14}/> Recording voice</span></div>
          <button type="button" className="recording-send" onClick={stopRecording} aria-label="Save voice recording"><Icon name="send" size={17}/></button>
        </div> : <form className="chat-composer" onSubmit={sendMessage}>
          <input ref={imageInputRef} className="chat-file-input" type="file" accept="image/*" multiple onChange={handleImages}/>
          <input ref={documentInputRef} className="chat-file-input" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,application/pdf,text/plain" multiple onChange={handleDocuments}/>
          <button type="button" className={`chat-attach ${attachmentsOpen?"active":""}`} aria-label="Add attachment" aria-expanded={attachmentsOpen} onClick={()=>{setAttachmentsOpen(open=>!open);setEmojiOpen(false)}}><Icon name="attach" size={20}/></button>
          <button type="button" className={`chat-emoji ${emojiOpen?"active":""}`} aria-label="Emoji" aria-expanded={emojiOpen} onClick={()=>{setEmojiOpen(open=>!open);setAttachmentsOpen(false)}}>☺</button>
          <textarea ref={textareaRef} value={draft} onChange={event=>setDraft(event.target.value)} onKeyDown={handleComposerKeyDown} placeholder={editingId?"Edit your message":"Type a message"} rows={1} aria-label="Message"/>
          {draft.trim()?<button type="submit" className="chat-send" aria-label={editingId?"Save edit":"Save message"}><Icon name="send" size={18}/></button>:<button type="button" className="chat-mic" aria-label="Record voice message" onClick={startRecording}><Icon name="mic" size={18}/></button>}
        </form>}
      </footer>
    </div>
  </section></Localized>;
}
