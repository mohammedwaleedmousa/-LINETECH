"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Json = Record<string, any>;

type ProjectRow = {
  id: string;
  title?: string | null;
  status: string;
  phase: number;
  updated_at?: string | null;
  due_date?: string | null;
  latest_update?: string | null;
  next_action_title?: string | null;
  next_action_body?: string | null;
  next_action_required?: boolean;
  request?: Json | null;
  client?: Json | null;
};

type ProjectDetail = {
  project: ProjectRow;
  request?: Json | null;
  activity?: Json[];
  files?: Json[];
  handover?: Json[];
};

async function readJson(response: Response) {
  return response.json().catch(() => null) as Promise<Json | null>;
}

function dateTime(value?: string | null) {
  if (!value) return "—";
  try { return new Date(value).toLocaleString(); } catch { return value; }
}

export default function AdminClient() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<ProjectDetail | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [chat, setChat] = useState<Json[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [handover, setHandover] = useState<Json[]>([]);
  const [handoverTitle, setHandoverTitle] = useState("");
  const [handoverDescription, setHandoverDescription] = useState("");

  const selected = useMemo(
    () => projects.find(project => project.id === selectedId) || null,
    [projects, selectedId],
  );

  const loadProjects = useCallback(async () => {
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    if (response.status === 403) {
      setAuthorized(false);
      setChecking(false);
      return;
    }
    const payload = await readJson(response);
    if (!response.ok || !payload?.ok) throw new Error("Could not load projects.");
    const rows = Array.isArray(payload.projects) ? payload.projects as ProjectRow[] : [];
    setProjects(rows);
    setSelectedId(current => current || rows[0]?.id || "");
  }, []);

  const loadProject = useCallback(async (projectId: string) => {
    if (!projectId) {
      setDetail(null);
      setChat([]);
      setHandover([]);
      return;
    }
    const [projectResponse, chatResponse, handoverResponse] = await Promise.all([
      fetch(`/api/admin/project?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" }),
      fetch(`/api/admin/chat?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" }),
      fetch(`/api/admin/handover?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" }),
    ]);
    const [projectPayload, chatPayload, handoverPayload] = await Promise.all([
      readJson(projectResponse), readJson(chatResponse), readJson(handoverResponse),
    ]);
    if (!projectResponse.ok || !projectPayload?.ok) throw new Error("Could not load project.");
    setDetail(projectPayload as unknown as ProjectDetail);
    setChat(chatResponse.ok && chatPayload?.ok && Array.isArray(chatPayload.messages) ? chatPayload.messages : []);
    setHandover(handoverResponse.ok && handoverPayload?.ok && Array.isArray(handoverPayload.items) ? handoverPayload.items : []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const session = await fetch("/api/auth/session", { cache: "no-store" });
        if (session.status === 401) {
          window.location.assign("/login?next=/admin");
          return;
        }
        const sessionPayload = await readJson(session);
        const isAdmin = session.ok && sessionPayload?.user?.app_metadata?.role === "admin";
        if (!isAdmin) {
          if (!cancelled) {
            setAuthorized(false);
            setChecking(false);
          }
          return;
        }
        if (!cancelled) setAuthorized(true);
        await loadProjects();
      } catch {
        if (!cancelled) setError("Admin workspace could not be loaded.");
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadProjects]);

  useEffect(() => {
    if (!authorized || !selectedId) return;
    setError("");
    void loadProject(selectedId).catch(() => setError("Project details could not be loaded."));
  }, [authorized, selectedId, loadProject]);

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail?.project?.id) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/admin/project", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: detail.project.id,
          status: form.get("status"),
          phase: Number(form.get("phase")),
          requestStatus: form.get("requestStatus"),
          latestUpdate: String(form.get("latestUpdate") || ""),
          dueDate: String(form.get("dueDate") || ""),
          nextActionTitle: String(form.get("nextActionTitle") || ""),
          nextActionBody: String(form.get("nextActionBody") || ""),
          nextActionRequired: form.get("nextActionRequired") === "on",
          activityTitle: String(form.get("activityTitle") || ""),
          activityDetail: String(form.get("activityDetail") || ""),
          notifyClient: form.get("notifyClient") === "on",
          notificationTitle: String(form.get("notificationTitle") || ""),
          notificationBody: String(form.get("notificationBody") || ""),
        }),
      });
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok) throw new Error();
      setNotice("Project updated.");
      await Promise.all([loadProjects(), loadProject(detail.project.id)]);
    } catch {
      setError("Project update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;
    const form = new FormData(event.currentTarget);
    form.set("projectId", selectedId);
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/admin/files", { method: "POST", body: form });
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok) throw new Error();
      setNotice("Project file uploaded.");
      event.currentTarget.reset();
      await loadProject(selectedId);
    } catch {
      setError("File upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = chatDraft.trim();
    if (!selectedId || !text) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/chat?projectId=${encodeURIComponent(selectedId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok) throw new Error();
      setChatDraft("");
      await loadProject(selectedId);
    } catch {
      setError("Message could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  async function addHandover(event: FormEvent) {
    event.preventDefault();
    if (!selectedId || !handoverTitle.trim()) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/handover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedId,
          title: handoverTitle.trim(),
          description: handoverDescription.trim(),
        }),
      });
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok) throw new Error();
      setHandoverTitle("");
      setHandoverDescription("");
      await loadProject(selectedId);
    } catch {
      setError("Handover item could not be added.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleHandover(item: Json) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/handover", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, completed: !item.completed }),
      });
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok) throw new Error();
      await loadProject(selectedId);
    } catch {
      setError("Handover item could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  if (checking) return <main className="admin-page"><div className="admin-state">Checking admin access…</div></main>;

  if (!authorized) {
    return <main className="admin-page"><div className="admin-state"><strong>Admin access required.</strong><span>This account does not have LINETECH admin permission.</span></div></main>;
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><span>LINETECH / ADMIN</span><h1>Project operations.</h1></div>
        <div><strong>{projects.length}</strong><span>projects</span></div>
      </header>

      {(notice || error) && <div className={error ? "admin-feedback is-error" : "admin-feedback"}>{error || notice}</div>}

      <div className="admin-layout">
        <aside className="admin-projects">
          <div className="admin-section-label">PROJECTS</div>
          {projects.length ? projects.map(project => (
            <button
              key={project.id}
              type="button"
              className={selectedId === project.id ? "admin-project is-active" : "admin-project"}
              onClick={() => setSelectedId(project.id)}
            >
              <span>{project.request?.reference_number || "NO REF"}</span>
              <strong>{project.title || project.request?.service || "Project"}</strong>
              <small>{project.client?.full_name || project.request?.name || "Client"} · {project.status} · P{project.phase}</small>
            </button>
          )) : <p className="admin-empty">No projects yet.</p>}
        </aside>

        <section className="admin-detail">
          {!selected || !detail ? <div className="admin-state">Select a project.</div> : <>
            <div className="admin-project-head">
              <div>
                <span>{detail.request?.reference_number || "PROJECT"}</span>
                <h2>{detail.project.title || detail.request?.service || "Project"}</h2>
                <p>{detail.request?.name || "Client"}{detail.request?.company ? ` · ${detail.request.company}` : ""}</p>
              </div>
              <div><strong>Phase {detail.project.phase}/5</strong><span>{detail.project.status}</span></div>
            </div>

            <form className="admin-card admin-update-form" onSubmit={saveProject}>
              <div className="admin-card-title"><span>01</span><strong>Project control</strong></div>
              <div className="admin-grid two">
                <label>Status<select name="status" defaultValue={detail.project.status}>
                  {["planned","active","waiting_client","review","completed","archived"].map(value => <option key={value}>{value}</option>)}
                </select></label>
                <label>Phase<select name="phase" defaultValue={String(detail.project.phase)}>
                  {[1,2,3,4,5].map(value => <option key={value} value={value}>{value}</option>)}
                </select></label>
                <label>Request status<select name="requestStatus" defaultValue={detail.request?.status || "submitted"}>
                  {["submitted","reviewing","scoped","accepted","declined"].map(value => <option key={value}>{value}</option>)}
                </select></label>
                <label>Due date<input name="dueDate" type="date" defaultValue={detail.project.due_date?.slice(0,10) || ""} /></label>
              </div>
              <label>Latest update<textarea name="latestUpdate" defaultValue={detail.project.latest_update || ""} rows={3} /></label>
              <div className="admin-grid two">
                <label>Next action title<input name="nextActionTitle" defaultValue={detail.project.next_action_title || ""} /></label>
                <label className="admin-check"><input name="nextActionRequired" type="checkbox" defaultChecked={Boolean(detail.project.next_action_required)} />Action required</label>
              </div>
              <label>Next action body<textarea name="nextActionBody" defaultValue={detail.project.next_action_body || ""} rows={3} /></label>
              <div className="admin-divider" />
              <div className="admin-grid two">
                <label>Activity title<input name="activityTitle" placeholder="Optional activity log" /></label>
                <label>Activity detail<input name="activityDetail" placeholder="Optional detail" /></label>
              </div>
              <label className="admin-check"><input name="notifyClient" type="checkbox" />Notify client</label>
              <div className="admin-grid two">
                <label>Notification title<input name="notificationTitle" placeholder="Project updated" /></label>
                <label>Notification body<input name="notificationBody" placeholder="Optional client message" /></label>
              </div>
              <button className="admin-primary" type="submit" disabled={busy}>Save project</button>
            </form>

            <div className="admin-columns">
              <section className="admin-card">
                <div className="admin-card-title"><span>02</span><strong>Activity</strong></div>
                <div className="admin-list">
                  {(detail.activity || []).length ? (detail.activity || []).map(item => <article key={item.id}>
                    <strong>{item.title}</strong><p>{item.detail || "—"}</p><small>{dateTime(item.created_at)}</small>
                  </article>) : <p className="admin-empty">No activity yet.</p>}
                </div>
              </section>

              <section className="admin-card">
                <div className="admin-card-title"><span>03</span><strong>Files</strong></div>
                <form className="admin-stack" onSubmit={uploadFile}>
                  <input name="file" type="file" required />
                  <div className="admin-grid two">
                    <select name="category" defaultValue="deliverable">
                      {["brief","reference","deliverable","handover","other"].map(value => <option key={value}>{value}</option>)}
                    </select>
                    <select name="status" defaultValue="ready">
                      {["in-progress","ready","review","approved"].map(value => <option key={value}>{value}</option>)}
                    </select>
                  </div>
                  <input name="detail" placeholder="File note" />
                  <button className="admin-secondary" type="submit" disabled={busy}>Upload file</button>
                </form>
                <div className="admin-list">
                  {(detail.files || []).map(file => <article key={file.id}><strong>{file.file_name}</strong><p>{file.category} · {file.status}</p><small>{dateTime(file.updated_at)}</small></article>)}
                </div>
              </section>
            </div>

            <div className="admin-columns">
              <section className="admin-card">
                <div className="admin-card-title"><span>04</span><strong>Project chat</strong></div>
                <div className="admin-chat-log">
                  {chat.length ? chat.map(message => <div key={message.id} className={message.sender === "company" ? "is-company" : ""}>
                    <span>{message.sender === "company" ? "LINETECH" : "CLIENT"}</span>
                    <p>{message.deleted ? "Message deleted." : message.text || message.fileName || message.kind}</p>
                    <small>{message.time || ""}</small>
                  </div>) : <p className="admin-empty">No messages yet.</p>}
                </div>
                <form className="admin-chat-form" onSubmit={sendMessage}>
                  <textarea value={chatDraft} onChange={event => setChatDraft(event.target.value)} rows={3} placeholder="Write to the client…" />
                  <button className="admin-secondary" type="submit" disabled={busy || !chatDraft.trim()}>Send message</button>
                </form>
              </section>

              <section className="admin-card">
                <div className="admin-card-title"><span>05</span><strong>Handover</strong></div>
                <form className="admin-stack" onSubmit={addHandover}>
                  <input value={handoverTitle} onChange={event => setHandoverTitle(event.target.value)} placeholder="Handover item" required />
                  <textarea value={handoverDescription} onChange={event => setHandoverDescription(event.target.value)} placeholder="Description" rows={2} />
                  <button className="admin-secondary" type="submit" disabled={busy}>Add item</button>
                </form>
                <div className="admin-list">
                  {handover.length ? handover.map(item => <button key={item.id} className="admin-handover" type="button" onClick={() => toggleHandover(item)}>
                    <span>{item.completed ? "✓" : "○"}</span><div><strong>{item.title}</strong><p>{item.description || "—"}</p></div>
                  </button>) : <p className="admin-empty">No handover items yet.</p>}
                </div>
              </section>
            </div>
          </>}
        </section>
      </div>
    </main>
  );
}
