const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

for (const file of [
  "worker/index.ts",
  "worker/core.ts",
  "worker/auth.ts",
  "worker/client.ts",
  "worker/admin.ts",
]) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing Worker backend file: ${file}`);
}

const wrangler = read("wrangler.jsonc");
assert.match(wrangler, /"main"\s*:\s*"\.\/worker\/index\.ts"/);
assert.match(wrangler, /"binding"\s*:\s*"ASSETS"/);
for (const route of ["/api/*","/workspace*","/chat*","/admin*","/handover*"]) {
  assert.ok(wrangler.includes(route), `Missing Worker-first route: ${route}`);
}
assert.match(wrangler, /"observability"\s*:\s*\{/);
assert.match(wrangler, /"enabled"\s*:\s*true/);
assert.match(wrangler, /"head_sampling_rate"\s*:\s*1/);

const staticHeaders = read("public/_headers");
for (const header of [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
]) {
  assert.ok(staticHeaders.includes(header), `Missing static security header: ${header}`);
}

const workerIndex = read("worker/index.ts");
assert.match(workerIndex, /request\.headers\.get\("Origin"\)/);
assert.match(workerIndex, /origin!==url\.origin/);
assert.ok(workerIndex.includes('path==="/admin"'));
assert.ok(workerIndex.includes('app_metadata?.role!=="admin"'));
assert.ok(workerIndex.includes('path==="/admin/login"'));
assert.ok(workerIndex.includes("adminLoginRedirect"));
assert.ok(workerIndex.includes('app_metadata?.role==="admin"'));
assert.ok(workerIndex.includes('new URL("/admin",request.url)'));
assert.ok(workerIndex.includes('path==="/handover"'));
const clientPortalRouteStart = workerIndex.lastIndexOf('path==="/workspace"');
const clientPortalRouteEnd = workerIndex.indexOf('return env.ASSETS.fetch(request);', clientPortalRouteStart);
const clientPortalRouteBlock = workerIndex.slice(clientPortalRouteStart, clientPortalRouteEnd);
assert.ok(clientPortalRouteBlock.includes("loginRedirect"));
assert.ok(!clientPortalRouteBlock.includes('Response.redirect(new URL("/admin"'));
assert.ok(!clientPortalRouteBlock.includes('app_metadata?.role==="admin"'));
assert.ok(workerIndex.includes("withSecurityHeaders"));
assert.ok(workerIndex.includes('event:"request"'));
assert.ok(workerIndex.includes('event:"worker_error"'));

const core = read("worker/core.ts");
assert.match(core, /HttpOnly/);
assert.match(core, /Secure/);
assert.match(core, /SameSite=Lax/);
assert.match(core, /SUPABASE_PUBLISHABLE_KEY/);
assert.doesNotMatch(core, /service_role|sb_secret_/i);
assert.ok(core.includes("rateLimitAllowed"));
assert.ok(core.includes("rateLimitResponse"));
assert.ok(core.includes("Retry-After"));
assert.ok(core.includes("validateUpload"));
assert.ok(core.includes("signatureMatches"));
assert.ok(core.includes("BLOCKED_EXTENSIONS"));
assert.ok(core.includes("requestTooLarge"));
assert.ok(core.includes("boundedText"));
for (const header of [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
  "X-Request-ID",
]) {
  assert.ok(core.includes(header), `Missing security response header: ${header}`);
}

const workerIndexHealth = read("worker/index.ts");
assert.ok(workerIndexHealth.includes("/api/health"));
assert.ok(workerIndexHealth.includes("/health"));

const auth = read("worker/auth.ts");
assert.ok(auth.includes('redirectUrl.searchParams.set("confirmed","1")'));
assert.ok(auth.includes('redirectUrl.searchParams.set("recovery","1")'));
assert.ok(auth.includes('data.admin===true?"/admin/login":"/login"'));
for (const limiter of [
  "AUTH_LOGIN_RATE_LIMITER",
  "AUTH_SIGNUP_RATE_LIMITER",
  "AUTH_RECOVER_RATE_LIMITER",
  "AUTH_PASSWORD_RATE_LIMITER",
]) {
  assert.ok(auth.includes(limiter), `Auth route is not wired to ${limiter}`);
}
assert.ok(auth.includes('requestTooLarge(request,16*1024)'));
assert.ok(auth.includes('requestTooLarge(request,32*1024)'));
assert.ok(auth.includes('boundedText(data.email,320)'));
assert.ok(auth.includes('password.length>1024'));
assert.ok(auth.includes('/logout?scope=local'));
assert.ok(auth.includes('/logout?scope=others'));
assert.ok(auth.includes('"/otp"'));
assert.ok(auth.includes('create_user:false'));
assert.ok(auth.includes('"/verify"'));
assert.ok(auth.includes('type:"email"'));
assert.ok(auth.includes('/^\\d{6}$/'));

for (const endpoint of [
  "/api/auth/login",
  "/api/auth/request-code",
  "/api/auth/verify-code",
  "/api/auth/signup",
  "/api/auth/recover",
  "/api/auth/session",
  "/api/auth/update-password",
  "/api/auth/logout-others",
  "/api/auth/logout",
  "/api/account",
  "/api/account/email",
]) {
  assert.ok(auth.includes(endpoint), `Worker auth is missing ${endpoint}`);
}

const client = read("worker/client.ts");
for (const limiter of [
  "PROJECT_REQUEST_RATE_LIMITER",
  "CHAT_RATE_LIMITER",
  "UPLOAD_RATE_LIMITER",
]) {
  assert.ok(client.includes(limiter), `Client route is not wired to ${limiter}`);
}
for (const endpoint of [
  "/api/projects",
  "/api/project-request",
  "/api/workspace",
  "/api/chat/messages",
  "/api/chat/upload",
  "/api/files/download",
  "/api/notifications",
  "/api/handover",
]) {
  assert.ok(client.includes(endpoint), `Worker client API is missing ${endpoint}`);
}

const admin = read("worker/admin.ts");
for (const endpoint of [
  "/api/admin/projects",
  "/api/admin/client",
  "/api/admin/project",
  "/api/admin/files",
  "/api/admin/handover",
  "/api/admin/chat",
  "/api/admin/chat/upload",
  "/api/admin/users",
  "/api/admin/members",
]) {
  assert.ok(admin.includes(endpoint), `Worker admin API is missing ${endpoint}`);
}

const nav = read("app/SiteNav.tsx");
assert.ok(nav.includes("/api/auth/session"));
assert.ok(nav.includes("/api/auth/logout"));
assert.ok(nav.includes('"Logout"'));
assert.ok(nav.includes('"تسجيل خروج"'));
assert.ok(nav.includes("/api/notifications"));
assert.ok(nav.includes("notification-trigger"));
assert.ok(nav.includes("notificationId"));
assert.ok(nav.includes('method: "PATCH"'));
assert.ok(nav.includes("safeNotificationDestination"));
assert.ok(nav.includes("notificationKindLabel"));
assert.ok(nav.includes("markAllNotificationsRead"));
assert.ok(nav.includes("openNotification"));
assert.ok(nav.includes("setInterval"));
assert.ok(nav.includes("visibilitychange"));
assert.ok(nav.includes('href="/account"'));
assert.ok(nav.includes("Account Settings"));
assert.ok(nav.includes('href="/workspace"'));
assert.ok(nav.includes("notification-center"));
assert.ok(nav.includes("notification-panel-mobile"));
assert.ok(nav.includes("createPortal"));
assert.ok(!nav.includes("mobile-notifications-link"));
assert.ok(!nav.includes('href="/admin"'));
assert.ok(!nav.includes('adminLabel'));
assert.ok(client.includes("data.markAll===true"));
assert.ok(client.includes('"/notifications?read_at=is.null&select=id,read_at"'));

const login = read("app/login/LoginForm.tsx");
assert.ok(login.includes("safeInternalNext"));
assert.ok(login.includes('value.startsWith("//")'));
assert.ok(login.includes("const returnPath = safeInternalNext"));
assert.ok(login.includes("window.location.assign(returnPath)"));
assert.ok(auth.includes("safeReturnPath"));
assert.ok(auth.includes('redirectUrl.searchParams.set("next",next)'));
assert.ok(auth.includes('path==="/api/account"'));
assert.ok(auth.includes('path==="/api/account/email"'));
assert.ok(auth.includes('path==="/api/auth/logout-others"'));
assert.ok(auth.includes('/profiles?select=id,full_name,company,phone,created_at,updated_at'));
assert.ok(auth.includes('"/logout?scope=others"'));
assert.ok(login.includes('search.get("confirmed") === "1"'));
assert.ok(login.includes('search.get("recovery") === "1"'));
for (const endpoint of [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/recover",
  "/api/auth/session",
  "/api/auth/update-password",
]) {
  assert.ok(login.includes(endpoint), `LoginForm is not wired to ${endpoint}`);
}

const projectIntake = read("app/start/ProjectIntake.tsx");
assert.ok(projectIntake.includes("/api/project-request"));
assert.ok(projectIntake.includes("linetech-project-submission-key-v1"));
assert.ok(projectIntake.includes("window.crypto.randomUUID()"));
assert.ok(projectIntake.includes("submissionKey,"));
assert.ok(projectIntake.includes('/api/auth/session'));
assert.ok(projectIntake.includes('href="/workspace"'));
assert.ok(projectIntake.includes('href="/chat"'));
assert.ok(projectIntake.includes("requestTooLarge"));
assert.ok(projectIntake.includes("serviceUnavailable"));
assert.ok(projectIntake.includes("requestDraftTtlMs"));
assert.ok(projectIntake.includes("window.localStorage.setItem(requestDraftKey"));
assert.ok(projectIntake.includes("window.localStorage.removeItem(requestDraftKey"));
assert.ok(projectIntake.includes("window.localStorage.getItem(requestSubmissionKey"));
assert.ok(!projectIntake.includes("function editRequest()"));
const workspaceClient = read("app/workspace/WorkspaceClient.tsx");
assert.ok(workspaceClient.includes("/api/workspace"));
assert.ok(workspaceClient.includes("loadWorkspace"));
assert.ok(workspaceClient.includes("visibilitychange"));
assert.ok(workspaceClient.includes("loadError"));
assert.ok(workspaceClient.includes("handoverUnlocked"));
assert.ok(workspaceClient.includes("localizeWorkspaceText"));
assert.ok(workspaceClient.includes("ClientProjectSwitcher"));
assert.ok(workspaceClient.includes("requestedProjectSuffix"));
assert.ok(workspaceClient.includes('projectHref("/chat", currentProjectId)'));
assert.ok(workspaceClient.includes("workspace-dashboard-head"));
assert.ok(workspaceClient.includes("workspace-overview-grid"));
assert.ok(workspaceClient.includes('import "./workspace-dashboard.css"'));
assert.ok(!workspaceClient.includes("ContentHeroArt"));
assert.ok(client.includes('path==="/api/projects"'));
assert.ok(client.includes("nextMilestone:undefined"));
assert.ok(read("app/chat/ChatWorkspace.tsx").includes("/api/chat/messages"));
const chatClient = read("app/chat/ChatWorkspace.tsx");
assert.ok(chatClient.includes("/api/chat/messages"));
assert.ok(chatClient.includes("/api/chat/upload"));
assert.ok(chatClient.includes("ClientProjectSwitcher"));
assert.ok(chatClient.includes("currentProjectSuffix"));
assert.ok(chatClient.includes("currentProjectId"));
assert.ok(client.includes('validateUpload(file,kind)'));
assert.ok(client.includes('requestTooLarge(request,64*1024)'));
assert.ok(client.includes('boundedText(data.submissionKey,36)'));
assert.ok(client.includes('p_submission_key:submissionKey'));
assert.ok(client.includes('boundedText(data.text,5000)'));
assert.ok(client.includes('/object/project-files/'));
assert.ok(client.includes('{method:"DELETE"}'));
assert.ok(client.includes('sender_role:"client"'));
assert.ok(client.includes("sender_role=eq.client"));
assert.ok(client.includes("conversation_id=eq."));
assert.ok(admin.includes('validateUpload(file,"admin")'));
assert.ok(admin.includes('requestTooLarge(request,26*1024*1024)'));
assert.ok(admin.includes('requestTooLarge(request,64*1024)'));
assert.ok(admin.includes('boundedText(data.text,5000)'));
assert.ok(admin.includes('sender_role:"company"'));
assert.ok(admin.includes('row.sender_role==="company"'));
assert.ok(admin.includes('admin-chat-upload:'));
assert.ok(admin.includes('validateUpload(file,kind)'));
assert.ok(admin.includes('duration_seconds:kind==="audio"'));

const handoverClient = read("app/handover/HandoverClient.tsx");
assert.ok(handoverClient.includes("/api/handover"));
assert.ok(handoverClient.includes("files"));
assert.ok(handoverClient.includes("loadHandover"));
assert.ok(handoverClient.includes("visibilitychange"));
assert.ok(handoverClient.includes("ClientProjectSwitcher"));
assert.ok(handoverClient.includes("requestedProjectSuffix"));
assert.ok(handoverClient.includes('projectHref("/workspace", currentProjectId)'));
assert.ok(client.includes("category=in.(handover,deliverable)"));
assert.ok(client.includes("status=in.(ready,approved)"));
assert.ok(workspaceClient.includes('projectHref("/handover", currentProjectId)'));

for (const file of [
  "app/account/page.tsx",
  "app/account/AccountClient.tsx",
  "app/admin/page.tsx",
  "app/admin/AdminClient.tsx",
  "app/handover/page.tsx",
  "app/handover/HandoverClient.tsx",
]) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing protected workspace file: ${file}`);
}

const adminShell = read("app/admin/AdminShell.tsx");
const adminDashboard = read("app/admin/DashboardClient.tsx");
const adminClients = read("app/admin/ClientsClient.tsx");
const adminTeam = read("app/admin/TeamClient.tsx");
for (const file of [
  "app/admin/layout.tsx",
  "app/admin/login/page.tsx",
  "app/admin/login/AdminLoginClient.tsx",
  "app/admin/account/page.tsx",
  "app/admin/account/AdminAccountClient.tsx",
  "app/admin/projects/page.tsx",
  "app/admin/clients/page.tsx",
  "app/admin/team/page.tsx",
]) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing admin route file: ${file}`);
}
assert.ok(adminShell.includes('href: "/admin/projects"'));
assert.ok(adminShell.includes('href: "/admin/clients"'));
assert.ok(adminShell.includes('href: "/admin/team"'));
assert.ok(adminShell.includes('href: "/admin/account"'));
assert.ok(adminShell.includes('pathname === "/admin/login"'));
assert.ok(adminShell.includes('window.location.assign("/admin/login")'));
assert.ok(adminShell.includes("admin-app-sidebar"));
assert.ok(adminShell.includes("admin-app-topbar"));
assert.ok(adminShell.includes("ADMIN PORTAL"));
assert.ok(adminShell.includes("admin-app-wordmark"));
assert.ok(adminDashboard.includes("/api/admin/projects"));
assert.ok(adminDashboard.includes("/api/admin/users"));
assert.ok(adminClients.includes("/api/admin/projects"));
assert.ok(adminClients.includes("/api/admin/users"));
assert.ok(adminTeam.includes("/api/admin/users"));

const adminClient = read("app/admin/AdminClient.tsx");
assert.ok(adminClient.includes("projectQuery"));
assert.ok(adminClient.includes("projectStatusFilter"));
assert.ok(adminClient.includes("refreshAdmin"));
assert.ok(adminClient.includes("updateProjectFile"));
assert.ok(adminClient.includes("Client request"));
assert.ok(adminClient.includes("Client profile"));
assert.ok(adminClient.includes("loadClient"));
assert.ok(adminClient.includes("/api/admin/client"));
assert.ok(adminClient.includes("Latest client timeline"));
assert.ok(admin.includes('path==="/api/admin/client"'));
assert.ok(admin.includes("messageCount"));
assert.ok(admin.includes("activeProjects"));
assert.ok(adminClient.includes("loadAdminChat"));
assert.ok(adminClient.includes("visibilitychange"));
assert.ok(adminClient.includes("setInterval"));
assert.ok(adminClient.includes("uploadAdminChatFile"));
assert.ok(adminClient.includes("startVoiceRecording"));
assert.ok(adminClient.includes("admin-chat-image"));
assert.ok(adminClient.includes("admin-chat-audio"));
assert.ok(adminClient.includes("admin-chat-document"));
assert.ok(adminClient.includes("/api/admin/chat/upload"));
assert.ok(admin.includes("file_status_updated"));
assert.ok(admin.includes("Project file updated"));
assert.ok(admin.includes('action_kind:"message"'));
assert.ok(admin.includes('clientProjectPath("/chat",projectId)'));
assert.ok(admin.includes('clientProjectPath(handoverReady?"/handover":"/workspace",projectId)'));
assert.ok(admin.includes('title:"Handover updated"'));
assert.ok(admin.includes("clientProjectPath"));
assert.ok(admin.includes('title:item.completed?"Handover item completed":"Handover updated"'));
assert.ok(adminClient.includes('name="notifyClient" type="checkbox" defaultChecked'));
for (const endpoint of [
  "/api/admin/projects",
  "/api/admin/project",
  "/api/admin/files",
  "/api/admin/handover",
  "/api/admin/chat",
  "/api/admin/users",
  "/api/admin/members",
]) {
  assert.ok(adminClient.includes(endpoint), `Admin UI is not wired to ${endpoint}`);
}

const siteSurface = read("app/SiteSurface.tsx");
const clientPortalShell = read("app/ClientPortalShell.tsx");
const adminLoginClient = read("app/admin/login/AdminLoginClient.tsx");
const adminAccountClient = read("app/admin/account/AdminAccountClient.tsx");
assert.ok(siteSurface.includes('pathname === "/admin"'));
assert.ok(siteSurface.includes("if (admin) return"));
assert.ok(siteSurface.includes("clientPortal"));
assert.ok(siteSurface.includes("ClientPortalShell"));
assert.ok(clientPortalShell.includes('href: "/workspace"'));
assert.ok(clientPortalShell.includes('href: "/chat"'));
assert.ok(clientPortalShell.includes('href: "/handover"'));
assert.ok(clientPortalShell.includes('href: "/account"'));
assert.ok(clientPortalShell.includes("/api/notifications"));
assert.ok(clientPortalShell.includes("/api/auth/logout"));
assert.ok(adminLoginClient.includes("/api/auth/login"));
assert.ok(adminLoginClient.includes("/api/auth/session"));
assert.ok(adminLoginClient.includes('app_metadata?.role !== "admin"'));
assert.ok(adminLoginClient.includes("safeAdminNext"));
assert.ok(adminAccountClient.includes("/api/account"));
assert.ok(adminAccountClient.includes("/api/account/email"));
assert.ok(adminAccountClient.includes("/api/auth/update-password"));
assert.ok(adminAccountClient.includes("/api/auth/logout-others"));

const accountClient = read("app/account/AccountClient.tsx");
assert.ok(accountClient.includes("/api/account"));
assert.ok(accountClient.includes("/api/account/email"));
assert.ok(accountClient.includes("/api/auth/update-password"));
assert.ok(accountClient.includes("/api/auth/logout-others"));
assert.ok(accountClient.includes("/api/auth/logout"));
assert.ok(accountClient.includes("signOutOthers"));
assert.ok(accountClient.includes("updatePassword"));
assert.ok(accountClient.includes("updateEmail"));

console.log("PASS: LINETECH Worker backend routes, secure cookies and frontend wiring are present");
