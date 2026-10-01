"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  client_id?: string | null;
  request_id?: string | null;
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

type ClientOverview = {
  client: {
    id: string;
    fullName: string;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    contact?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
  stats: {
    projectCount: number;
    activeProjects: number;
    completedProjects: number;
    requestCount: number;
    messageCount: number;
  };
  projects: Array<ProjectRow & { request?: Json | null }>;
  activity: Array<{
    id: string;
    type: string;
    projectId?: string | null;
    projectTitle?: string | null;
    title: string;
    detail?: string | null;
    at?: string | null;
  }>;
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
  const [users, setUsers] = useState<Json[]>([]);
  const [members, setMembers] = useState<Json[]>([]);
  const [memberUserId, setMemberUserId] = useState("");
  const [memberRole, setMemberRole] = useState("staff");
  const [projectQuery, setProjectQuery] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [clientOverview, setClientOverview] = useState<ClientOverview | null>(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [subscription, setSubscription] = useState<Json | null>(null);
  const [plans, setPlans] = useState<Json[]>([]);
  const [chatUploading, setChatUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const discardRecordingRef = useRef(false);
  const recordingTimerRef = useRef<number | null>(null);
  const recordingSecondsRef = useRef(0);

  const selected = useMemo(
    () => projects.find(project => project.id === selectedId) || null,
    [projects, selectedId],
  );

  const visibleProjects = useMemo(() => {
    const query = projectQuery.trim().toLowerCase();
    return projects.filter(project => {
      if (projectStatusFilter !== "all" && project.status !== projectStatusFilter) return false;
      if (!query) return true;
      const haystack = [
        project.title,
        project.status,
        project.request?.reference_number,
        project.request?.service,
        project.request?.name,
        project.request?.company,
        project.client?.full_name,
        project.client?.company,
        project.client?.email,
        project.client?.phone,
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [projects, projectQuery, projectStatusFilter]);

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
    setSelectedId(current => {
      if (current) return current;
      const requested = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("project") || ""
        : "";
      return rows.some(project => project.id === requested) ? requested : rows[0]?.id || "";
    });
  }, []);

  const loadUsers = useCallback(async () => {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const payload = await readJson(response);
    if (!response.ok || !payload?.ok) throw new Error("Could not load users.");
    const rows = Array.isArray(payload.users) ? payload.users : [];
    setUsers(rows);
    setMemberUserId(current => current || rows[0]?.id || "");
  }, []);

  const loadClient = useCallback(async (userId: string) => {
    if (!userId) {
      setClientOverview(null);
      return;
    }
    setClientLoading(true);
    try {
      const response = await fetch(`/api/admin/client?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok || !payload.client) throw new Error();
      setClientOverview(payload as unknown as ClientOverview);
    } catch {
      setClientOverview(null);
    } finally {
      setClientLoading(false);
    }
  }, []);

  const loadProject = useCallback(async (projectId: string) => {
    if (!projectId) {
      setDetail(null);
      setChat([]);
      setHandover([]);
      return;
    }
    const [projectResponse, chatResponse, handoverResponse, membersResponse] = await Promise.all([
      fetch(`/api/admin/project?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" }),
      fetch(`/api/admin/chat?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" }),
      fetch(`/api/admin/handover?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" }),
      fetch(`/api/admin/members?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" }),
    ]);
    const [projectPayload, chatPayload, handoverPayload, membersPayload] = await Promise.all([
      readJson(projectResponse), readJson(chatResponse), readJson(handoverResponse), readJson(membersResponse),
    ]);
    if (!projectResponse.ok || !projectPayload?.ok) throw new Error("Could not load project.");
    const nextDetail = projectPayload as unknown as ProjectDetail;
    setDetail(nextDetail);
    const clientId = String(nextDetail.project?.client_id || "");
    if (clientId) {
      void loadClient(clientId);
      const subscriptionResponse = await fetch(`/api/admin/subscription?clientId=${encodeURIComponent(clientId)}`, { cache: "no-store" });
      const subscriptionPayload = await readJson(subscriptionResponse);
      if (subscriptionResponse.ok && subscriptionPayload?.ok) {
        setSubscription(subscriptionPayload.subscription || null);
        setPlans(Array.isArray(subscriptionPayload.plans) ? subscriptionPayload.plans : []);
      } else {
        setSubscription(null);
        setPlans([]);
      }
    } else {
      setClientOverview(null);
      setSubscription(null);
      setPlans([]);
    }
    setChat(chatResponse.ok && chatPayload?.ok && Array.isArray(chatPayload.messages) ? chatPayload.messages : []);
    setHandover(handoverResponse.ok && handoverPayload?.ok && Array.isArray(handoverPayload.items) ? handoverPayload.items : []);
    setMembers(membersResponse.ok && membersPayload?.ok && Array.isArray(membersPayload.members) ? membersPayload.members : []);
  }, [loadClient]);

  const loadAdminChat = useCallback(async (projectId: string) => {
    if (!projectId) return;
    const response = await fetch(`/api/admin/chat?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" });
    const payload = await readJson(response);
    if (response.ok && payload?.ok && Array.isArray(payload.messages)) {
      setChat(payload.messages);
    }
  }, []);

  const refreshAdmin = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      await Promise.all([
        loadProjects(),
        loadUsers(),
        selectedId ? loadProject(selectedId) : Promise.resolve(),
      ]);
      setNotice("Admin data refreshed.");
    } catch {
      setError("Admin data could not be refreshed.");
    } finally {
      setRefreshing(false);
    }
  }, [loadProjects, loadUsers, loadProject, selectedId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const session = await fetch("/api/auth/session", { cache: "no-store" });
        if (session.status === 401) {
          window.location.assign(`/admin/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
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
        await Promise.all([loadProjects(), loadUsers()]);
      } catch {
        if (!cancelled) setError("Admin workspace could not be loaded.");
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadProjects, loadUsers]);

  useEffect(() => {
    if (!authorized || !selectedId) return;
    setError("");
    void loadProject(selectedId).catch(() => setError("Project details could not be loaded."));
  }, [authorized, selectedId, loadProject]);

  useEffect(() => {
    if (!authorized || !selectedId) return;
    const timer = window.setInterval(() => void loadAdminChat(selectedId), 5000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void loadAdminChat(selectedId);
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [authorized, selectedId, loadAdminChat]);

  useEffect(() => () => {
    if (recordingTimerRef.current) window.clearInterval(recordingTimerRef.current);
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
  }, []);


  async function saveSubscription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clientId = String(detail?.project?.client_id || "");
    if (!clientId) return;
    const form = new FormData(event.currentTarget);
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/subscription", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          planCode: form.get("planCode"),
          status: form.get("subscriptionStatus"),
          billingCycle: form.get("billingCycle"),
        }),
      });
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok) throw new Error();
      setSubscription(payload.subscription || null);
      setNotice("Client subscription updated.");
    } catch {
      setError("Subscription update failed.");
    } finally {
      setBusy(false);
    }
  }

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

  async function uploadAdminChatFile(file: File, kind?: "image" | "audio" | "document", duration?: number) {
    if (!selectedId) return;
    const resolvedKind = kind || (file.type.startsWith("image/") ? "image" : file.type.startsWith("audio/") ? "audio" : "document");
    const form = new FormData();
    form.append("projectId", selectedId);
    form.append("file", file);
    form.append("kind", resolvedKind);
    if (typeof duration === "number") form.append("duration", String(duration));

    setChatUploading(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/chat/upload", { method: "POST", body: form });
      const payload = await readJson(response);
      if (response.status === 429) throw new Error("Too many uploads. Wait a minute and try again.");
      if (response.status === 413) throw new Error("This attachment is too large.");
      if (response.status === 415) throw new Error("This file type is not supported.");
      if (!response.ok || !payload?.ok) throw new Error("Attachment could not be sent.");
      setNotice(resolvedKind === "audio" ? "Voice note sent." : "Attachment sent.");
      await loadProject(selectedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Attachment could not be sent.");
    } finally {
      setChatUploading(false);
    }
  }

  async function handleAdminChatFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 4);
    event.target.value = "";
    for (const file of files) {
      await uploadAdminChatFile(file);
    }
  }

  async function startVoiceRecording() {
    if (recording || chatUploading) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Voice recording is not available in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      mediaChunksRef.current = [];
      discardRecordingRef.current = false;
      recordingSecondsRef.current = 0;
      setRecordingSeconds(0);

      recorder.ondataavailable = event => {
        if (event.data.size) mediaChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        if (recordingTimerRef.current) {
          window.clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        setRecording(false);

        if (discardRecordingRef.current) {
          mediaChunksRef.current = [];
          recordingSecondsRef.current = 0;
          setRecordingSeconds(0);
          return;
        }

        const blob = new Blob(mediaChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        mediaChunksRef.current = [];
        if (blob.size) {
          const extension = blob.type.includes("ogg") ? "ogg" : blob.type.includes("mp4") ? "m4a" : "webm";
          const file = new File([blob], `linetech-voice-${Date.now()}.${extension}`, { type: blob.type || "audio/webm" });
          await uploadAdminChatFile(file, "audio", recordingSecondsRef.current);
        }
        recordingSecondsRef.current = 0;
        setRecordingSeconds(0);
      };

      recorder.start(200);
      setRecording(true);
      setError("");
      setNotice("");
      recordingTimerRef.current = window.setInterval(() => {
        recordingSecondsRef.current += 1;
        setRecordingSeconds(recordingSecondsRef.current);
      }, 1000);
    } catch {
      setError("Microphone permission is required to record a voice note.");
    }
  }

  function stopVoiceRecording() {
    discardRecordingRef.current = false;
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
  }

  function cancelVoiceRecording() {
    discardRecordingRef.current = true;
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
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


  async function updateProjectFile(fileId: string, status: string) {
    if (!fileId || !status || !selectedId) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/files", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, status }),
      });
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok) throw new Error();
      setNotice("File status updated.");
      await loadProject(selectedId);
    } catch {
      setError("File status could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  async function addMember(event: FormEvent) {
    event.preventDefault();
    if (!selectedId || !memberUserId) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedId,
          userId: memberUserId,
          memberRole: memberRole.trim() || "staff",
        }),
      });
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok) throw new Error();
      setNotice("Project member updated.");
      await loadProject(selectedId);
    } catch {
      setError("Project member could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(userId: string) {
    if (!selectedId || !userId) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(
        `/api/admin/members?projectId=${encodeURIComponent(selectedId)}&userId=${encodeURIComponent(userId)}`,
        { method: "DELETE" },
      );
      const payload = await readJson(response);
      if (!response.ok || !payload?.ok) throw new Error();
      setNotice("Project member removed.");
      await loadProject(selectedId);
    } catch {
      setError("Project member could not be removed.");
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
        <div className="admin-header-actions">
          <button type="button" onClick={() => void refreshAdmin()} disabled={refreshing || busy}>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <div><strong>{projects.length}</strong><span>projects</span></div>
        </div>
      </header>

      {(notice || error) && <div className={error ? "admin-feedback is-error" : "admin-feedback"}>{error || notice}</div>}

      <div className="admin-layout">
        <aside className="admin-projects">
          <div className="admin-section-label">PROJECTS</div>
          <div className="admin-project-tools">
            <input
              type="search"
              value={projectQuery}
              onChange={event => setProjectQuery(event.target.value)}
              placeholder="Search projects…"
              aria-label="Search projects"
            />
            <select
              value={projectStatusFilter}
              onChange={event => setProjectStatusFilter(event.target.value)}
              aria-label="Filter projects by status"
            >
              <option value="all">All statuses</option>
              {["planned","active","waiting_client","review","completed","archived"].map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
          {visibleProjects.length ? visibleProjects.map(project => (
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
          )) : <p className="admin-empty">{projects.length ? "No projects match this filter." : "No projects yet."}</p>}
        </aside>

        <section className="admin-detail">
          {!selected || !detail ? <div className="admin-state">Select a project.</div> : <>
            <div className="admin-project-head">
              <div>
                <span>{detail.request?.reference_number || "PROJECT"}</span>
                <h2>{detail.project.title || detail.request?.service || "Project"}</h2>
                <p>{detail.request?.name || "Client"}{detail.request?.company ? ` · ${detail.request.company}` : ""}</p>
              </div>
              <div className="admin-project-head-actions">
                <div><strong>Phase {detail.project.phase}/5</strong><span>{detail.project.status}</span></div>
                <button type="button" onClick={() => setClientOpen(value => !value)} disabled={clientLoading}>
                  {clientLoading ? "Loading client…" : clientOpen ? "Hide client profile" : "Client profile"}
                </button>
              </div>
            </div>

            {clientOpen && (
              <section className="admin-card admin-client-profile">
                <div className="admin-card-title"><span>CL</span><strong>Client profile</strong></div>
                {clientLoading && !clientOverview ? (
                  <p className="admin-empty">Loading client profile…</p>
                ) : clientOverview ? (
                  <>
                    <div className="admin-client-identity">
                      <div>
                        <span>CLIENT</span>
                        <h3>{clientOverview.client.fullName || "Client"}</h3>
                        <p>{clientOverview.client.company || "No company / brand"}</p>
                      </div>
                      <div className="admin-client-contact">
                        <div><span>Email</span>{clientOverview.client.email ? <a href={`mailto:${clientOverview.client.email}`}>{clientOverview.client.email}</a> : <strong>—</strong>}</div>
                        <div><span>Phone</span>{clientOverview.client.phone ? <a href={`tel:${clientOverview.client.phone}`}>{clientOverview.client.phone}</a> : <strong>—</strong>}</div>
                        <div><span>Latest request contact</span><strong>{clientOverview.client.contact || "—"}</strong></div>
                        <div><span>Client since</span><strong>{dateTime(clientOverview.client.createdAt)}</strong></div>
                      </div>
                    </div>

                    <div className="admin-client-stats">
                      <div><strong>{clientOverview.stats.projectCount}</strong><span>Projects</span></div>
                      <div><strong>{clientOverview.stats.activeProjects}</strong><span>Active</span></div>
                      <div><strong>{clientOverview.stats.completedProjects}</strong><span>Completed</span></div>
                      <div><strong>{clientOverview.stats.messageCount}</strong><span>Client messages</span></div>
                    </div>

                    <div className="admin-client-columns">
                      <div>
                        <div className="admin-client-subhead"><span>PROJECTS</span><strong>All client work</strong></div>
                        <div className="admin-client-project-list">
                          {clientOverview.projects.length ? clientOverview.projects.map(project => (
                            <button
                              key={project.id}
                              type="button"
                              className={selectedId === project.id ? "is-current" : ""}
                              onClick={() => setSelectedId(project.id)}
                            >
                              <span>{project.request?.reference_number || "PROJECT"}</span>
                              <strong>{project.title || project.request?.service || "Project"}</strong>
                              <small>{project.status} · Phase {project.phase}/5 · {dateTime(project.updated_at)}</small>
                            </button>
                          )) : <p className="admin-empty">No projects for this client.</p>}
                        </div>
                      </div>

                      <div>
                        <div className="admin-client-subhead"><span>RECENT ACTIVITY</span><strong>Latest client timeline</strong></div>
                        <div className="admin-client-activity">
                          {clientOverview.activity.length ? clientOverview.activity.slice(0, 10).map(item => (
                            <article key={item.id}>
                              <span>{item.type}</span>
                              <strong>{item.title}</strong>
                              <p>{item.detail || item.projectTitle || "—"}</p>
                              <small>{dateTime(item.at)}</small>
                            </article>
                          )) : <p className="admin-empty">No recent client activity.</p>}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="admin-empty">Client profile could not be loaded.</p>
                )}
              </section>
            )}

            <section className="admin-card admin-request-brief">
              <div className="admin-card-title"><span>00</span><strong>Client request</strong></div>
              <div className="admin-request-grid">
                <div><span>Client</span><strong>{detail.request?.name || "—"}</strong></div>
                <div><span>Company</span><strong>{detail.request?.company || "—"}</strong></div>
                <div><span>Service</span><strong>{detail.request?.service || detail.project.title || "—"}</strong></div>
                <div><span>Contact</span><strong>{detail.request?.contact || "—"}</strong></div>
                <div><span>Goal</span><strong>{detail.request?.goal || "—"}</strong></div>
                <div><span>Timing</span><strong>{detail.request?.timing || "—"}</strong></div>
                <div><span>Budget</span><strong>{detail.request?.budget || "—"}</strong></div>
                <div className="is-wide"><span>Project need</span><strong>{detail.request?.idea || "—"}</strong></div>
              </div>
            </section>


            <form key={`subscription-${detail.project.id}-${subscription?.updated_at || "new"}`} className="admin-card admin-update-form admin-subscription-card" onSubmit={saveSubscription}>
              <div className="admin-card-title"><span>SUB</span><strong>Client subscription</strong></div>
              <div className="admin-request-grid">
                <div><span>Requested plan</span><strong>{detail.request?.selected_plan_code ? String(detail.request.selected_plan_code).replaceAll("_", " ").toUpperCase() : "—"}</strong></div>
                <div><span>Current subscription</span><strong>{subscription?.plan_code ? String(subscription.plan_code).replaceAll("_", " ").toUpperCase() : "Not activated"}</strong></div>
                <div><span>Recurring price</span><strong>{subscription?.recurring_price_usd != null ? `${subscription.recurring_price_usd} / ${subscription.billing_cycle || "month"}` : "—"}</strong></div>
                <div><span>Next billing</span><strong>{subscription?.next_billing_at ? dateTime(subscription.next_billing_at) : "—"}</strong></div>
              </div>
              <div className="admin-grid three">
                <label>Plan<select name="planCode" defaultValue={subscription?.plan_code || detail.request?.selected_plan_code || plans[0]?.code || ""} required>
                  {plans.map(item => <option key={String(item.code)} value={String(item.code)}>{item.name} · ${item.monthly_price_usd}/mo</option>)}
                </select></label>
                <label>Status<select name="subscriptionStatus" defaultValue={subscription?.status || "active"}>
                  {["trial","active","past_due","suspended","cancelled"].map(value => <option key={value} value={value}>{value}</option>)}
                </select></label>
                <label>Billing<select name="billingCycle" defaultValue={subscription?.billing_cycle || "monthly"}>
                  {["monthly","yearly","custom"].map(value => <option key={value} value={value}>{value}</option>)}
                </select></label>
              </div>
              <p className="admin-subscription-note">Activating this records the commercial subscription. It does not change the plan originally requested by the client.</p>
              <button className="admin-primary" type="submit" disabled={busy || !plans.length}>{subscription ? "Update subscription" : "Activate subscription"}</button>
            </form>

            <form key={detail.project.id} className="admin-card admin-update-form" onSubmit={saveProject}>
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
              <label className="admin-check"><input name="notifyClient" type="checkbox" defaultChecked />Notify client</label>
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
                <div className="admin-list admin-file-list">
                  {(detail.files || []).length ? (detail.files || []).map(file => (
                    <article key={file.id}>
                      <div className="admin-file-main">
                        <strong>{file.file_name}</strong>
                        <p>{file.category + (file.detail ? " · " + file.detail : "")}</p>
                        <small>{dateTime(file.updated_at)}</small>
                      </div>
                      <div className="admin-file-actions">
                        <select
                          value={file.status || "ready"}
                          onChange={event => void updateProjectFile(String(file.id), event.target.value)}
                          disabled={busy}
                          aria-label={"Status for " + (file.file_name || "file")}
                        >
                          {["in-progress","ready","review","approved"].map(value => <option key={value} value={value}>{value}</option>)}
                        </select>
                        <a href={"/api/files/download?fileId=" + encodeURIComponent(String(file.id))} target="_blank" rel="noreferrer">Open ↗</a>
                      </div>
                    </article>
                  )) : <p className="admin-empty">No project files yet.</p>}
                </div>
              </section>
            </div>

            <div className="admin-columns">
              <section className="admin-card">
                <div className="admin-card-title"><span>04</span><strong>Project chat</strong></div>
                <div className="admin-chat-log">
                  {chat.length ? chat.map(message => <div key={message.id} className={message.sender === "company" ? "is-company" : ""}>
                    <span>{message.sender === "company" ? "LINETECH" : "CLIENT"}</span>
                    {message.deleted ? <p>Message deleted.</p> : <>
                      {message.kind === "text" && <p>{message.text || ""}</p>}
                      {message.kind === "image" && message.src && <a className="admin-chat-image" href={message.src} target="_blank" rel="noreferrer"><img src={message.src} alt={message.fileName || "Shared image"} /></a>}
                      {message.kind === "audio" && message.src && <audio className="admin-chat-audio" src={message.src} controls preload="metadata" />}
                      {message.kind === "document" && message.src && <a className="admin-chat-document" href={message.src} target="_blank" rel="noreferrer"><strong>{message.fileName || "Document"}</strong><span>Open ↗</span></a>}
                      {!["text","image","audio","document"].includes(String(message.kind)) && <p>{message.text || message.fileName || message.kind}</p>}
                    </>}
                    <small>{message.time || ""}</small>
                  </div>) : <p className="admin-empty">No messages yet.</p>}
                </div>
                <input
                  ref={chatFileInputRef}
                  className="admin-chat-file-input"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,audio/webm,audio/ogg,audio/mp4,audio/mpeg,audio/wav"
                  onChange={handleAdminChatFiles}
                />
                <div className="admin-chat-tools">
                  <button type="button" onClick={() => chatFileInputRef.current?.click()} disabled={busy || chatUploading || recording}>Attach file</button>
                  {!recording ? (
                    <button type="button" onClick={() => void startVoiceRecording()} disabled={busy || chatUploading}>Voice note</button>
                  ) : (
                    <div className="admin-recording">
                      <span><i /> Recording {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2,"0")}</span>
                      <button type="button" onClick={cancelVoiceRecording}>Cancel</button>
                      <button type="button" onClick={stopVoiceRecording}>Send voice</button>
                    </div>
                  )}
                </div>
                <form className="admin-chat-form" onSubmit={sendMessage}>
                  <textarea value={chatDraft} onChange={event => setChatDraft(event.target.value)} rows={3} placeholder="Write to the client…" />
                  <button className="admin-secondary" type="submit" disabled={busy || chatUploading || recording || !chatDraft.trim()}>Send message</button>
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

            <section className="admin-card">
              <div className="admin-card-title"><span>06</span><strong>Team access</strong></div>
              <form className="admin-stack" onSubmit={addMember}>
                <div className="admin-grid two">
                  <select value={memberUserId} onChange={event => setMemberUserId(event.target.value)} required>
                    <option value="" disabled>Select account</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.id}{user.company ? ` · ${user.company}` : ""}
                      </option>
                    ))}
                  </select>
                  <input value={memberRole} onChange={event => setMemberRole(event.target.value)} placeholder="staff" />
                </div>
                <button className="admin-secondary" type="submit" disabled={busy || !memberUserId}>Add / update member</button>
              </form>
              <div className="admin-list">
                {members.length ? members.map(member => (
                  <div className="admin-member" key={member.user_id}>
                    <div>
                      <strong>{member.profile?.full_name || member.user_id}</strong>
                      <p>{member.member_role || "staff"}{member.profile?.company ? ` · ${member.profile.company}` : ""}</p>
                    </div>
                    <button type="button" onClick={() => removeMember(String(member.user_id))} disabled={busy}>Remove</button>
                  </div>
                )) : <p className="admin-empty">No additional project members.</p>}
              </div>
            </section>
          </>}
        </section>
      </div>
    </main>
  );
}
