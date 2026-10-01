const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

const intake = read("app/start/ProjectIntake.tsx");
const workspace = read("app/workspace/WorkspaceClient.tsx");
const chat = read("app/chat/ChatWorkspace.tsx");
const handover = read("app/handover/HandoverClient.tsx");
const client = read("worker/client.ts");
const admin = read("worker/admin.ts");
const auth = read("worker/auth.ts");
const schema = read("supabase/schema.sql");
const workerIndex = read("worker/index.ts");
const siteSurface = read("app/SiteSurface.tsx");
const adminShell = read("app/admin/AdminShell.tsx");
const adminClients = read("app/admin/ClientsClient.tsx");
const adminDashboard = read("app/admin/DashboardClient.tsx");
const adminProjects = read("app/admin/AdminClient.tsx");
const accountClient = read("app/account/AccountClient.tsx");
const billingClient = read("app/admin/BillingClient.tsx");
const dashboardClient = read("app/admin/DashboardClient.tsx");
const pricing = read("app/pricing/page.tsx");
const siteNav = read("app/SiteNav.tsx");
const chatWorkspace = read("app/chat/ChatWorkspace.tsx");
const robots = read("public/robots.txt");
const sitemap = read("public/sitemap.xml");
const terms = read("app/terms/PageContent.tsx");

// 1) Account/session layer.
for (const endpoint of [
  "/api/auth/login",
  "/api/auth/session",
  "/api/auth/logout",
]) {
  assert.ok(auth.includes(endpoint), `Missing auth lifecycle endpoint: ${endpoint}`);
}
assert.ok(auth.includes("sessionCookies"));
assert.ok(auth.includes("refreshSession") || read("worker/core.ts").includes("refreshSession"));
assert.ok(auth.includes('path==="/api/account"'));
assert.ok(auth.includes('path==="/api/account/email"'));
assert.ok(auth.includes('path==="/api/auth/logout-others"'));
assert.ok(auth.includes("/profiles?select="));

// 1b) Admin stays isolated while client pages keep the normal LINETECH site chrome.
assert.ok(workerIndex.includes("adminLoginRedirect"));
assert.ok(workerIndex.includes('app_metadata?.role==="admin"'));
assert.ok(workerIndex.includes('app_metadata?.role!=="admin"'));
assert.ok(siteSurface.includes("if (admin) return"));
assert.ok(siteSurface.includes("<SiteNav />"));
assert.ok(siteSurface.includes("<SiteFooter />"));
assert.ok(!siteSurface.includes("ClientPortalShell"));
assert.ok(adminShell.includes("/admin/login"));
assert.ok(adminShell.includes("/admin/account"));

// 2) Project intake -> atomic request/project/conversation bootstrap.
assert.ok(intake.includes("/api/project-request"));
assert.ok(intake.includes("submissionKey"));
assert.ok(client.includes("/rpc/submit_project_request"));
assert.ok(client.includes("p_submission_key:submissionKey"));
assert.ok(schema.includes("p_submission_key uuid"));
assert.ok(schema.includes("'idempotent_replay'"));
assert.ok(schema.includes("insert into public.project_requests"));
assert.ok(schema.includes("insert into public.projects"));
assert.ok(schema.includes("insert into public.conversations"));
assert.ok(intake.includes("plan,"), "Selected plan is not included in the project request payload");
assert.ok(client.includes("p_plan:fields.plan"), "Worker is not forwarding the selected plan to the request RPC");
assert.ok(intake.includes("project_id?: string"), "Intake is not expecting the created project id");
assert.ok(intake.includes("setSubmittedProjectId(result.data.project_id"), "Created project id is not retained for the success handoff");
assert.ok(intake.includes("/workspace?project="), "Success screen does not target the created project workspace");
assert.ok(intake.includes("/chat?project="), "Success screen does not target the created project chat");

// 3) Workspace reads project state, activity and project files.
assert.ok(client.includes('path==="/api/projects"'));
assert.ok(client.includes("requestedProjectId"));
assert.ok(client.includes("projectContext"));
assert.ok(workspace.includes("/api/workspace"));
for (const table of ["project_requests","projects","project_activity","project_files"]) {
  assert.ok(client.includes(`/${table}?`), `Workspace API is not reading ${table}`);
}
assert.ok(workspace.includes("loadWorkspace"));
assert.ok(workspace.includes("visibilitychange"));
assert.ok(workspace.includes("handoverUnlocked"));
assert.ok(client.includes("plan:pr.selected_plan_code"), "Workspace API is not exposing the requested plan");
assert.ok(workspace.includes("record.project.plan"), "Workspace UI is not rendering the requested plan");
assert.ok(workspace.includes("new URLSearchParams(window.location.search).get(\"project\")"), "Workspace does not honor the project query parameter");

// 4) Client chat supports text + rich uploads and authenticated downloads.
assert.ok(chat.includes("/api/chat/messages"));
assert.ok(chat.includes("/api/chat/upload"));
assert.ok(client.includes('sender_role:"client"'));
assert.ok(client.includes("validateUpload(file,kind)"));
assert.ok(client.includes("/api/files/download"));
assert.ok(client.includes("/object/authenticated/"));
assert.ok(client.includes("message_attachments"));

// 5) Admin can operate lifecycle and communicate back to the client.
for (const endpoint of [
  "/api/admin/projects",
  "/api/admin/project",
  "/api/admin/files",
  "/api/admin/chat",
  "/api/admin/chat/upload",
  "/api/admin/handover",
  "/api/admin/users",
  "/api/admin/members",
  "/api/admin/subscription",
  "/api/admin/billing",
]) {
  assert.ok(admin.includes(endpoint), `Missing admin lifecycle endpoint: ${endpoint}`);
}
assert.ok(admin.includes('sender_role:"company"'));
assert.ok(admin.includes("project_activity"));
assert.ok(admin.includes("notifications"));
assert.ok(admin.includes("next_action_required"));
assert.ok(admin.includes("file_status_updated"));
assert.ok(admin.includes('action_kind:"message"'));
assert.ok(admin.includes('clientProjectPath("/chat",projectId)'));
assert.ok(admin.includes('clientProjectPath("/handover",projectId)'));
assert.ok(admin.includes("/project_requests?select=*"), "Admin project feed is not loading the full request record");
assert.ok(admin.includes("request:requestMap.get"), "Admin project feed is not attaching the request to the project");
assert.ok(adminClients.includes("selected_plan_code"), "Admin Clients does not show the requested plan");
assert.ok(adminDashboard.includes("selected_plan_code"), "Admin Dashboard does not show the requested plan");
assert.ok(admin.includes("/client_subscriptions?select=*"), "Admin subscription API is not reading client subscriptions");
assert.ok(admin.includes("/plan_catalog?select=*"), "Admin subscription API is not reading the active plan catalog");
assert.ok(admin.includes("setup_fee_usd:plan.setup_price_usd"), "Subscription does not snapshot the setup price");
assert.ok(admin.includes("recurring_price_usd:plan.monthly_price_usd"), "Subscription does not snapshot the recurring price");
assert.ok(adminProjects.includes("saveSubscription"), "Admin project UI has no subscription action");
assert.ok(adminProjects.includes("Requested plan"), "Admin project UI does not distinguish requested plan");
assert.ok(adminProjects.includes("Current subscription"), "Admin project UI does not show the commercial subscription");
assert.ok(auth.includes("/client_subscriptions?select=*,plan:plan_catalog(*)"), "Account API does not load the client subscription and plan");
assert.ok(accountClient.includes("account.subscription"), "Account UI does not render the commercial subscription");
assert.ok(accountClient.includes("max_storage_gb"), "Account UI does not show plan limits");
assert.ok(admin.includes('path==="/api/admin/billing"'), "Admin billing API is missing");
assert.ok(admin.includes("overdueAmount"), "Billing API does not calculate overdue recurring value");
assert.ok(admin.includes('new Set(["active","past_due"])'), "MRR must exclude trial, suspended and cancelled subscriptions");
assert.ok(billingClient.includes("Active + past due recurring value"), "Billing UI must explain the MRR definition");
assert.ok(billingClient.includes("MRR"), "Billing center does not display MRR");
assert.ok(dashboardClient.includes('fetch("/api/admin/billing"') && dashboardClient.includes("billing.summary?.mrr"), "Admin dashboard does not surface live billing KPIs");
assert.ok(dashboardClient.includes("admin-ops-table") && dashboardClient.includes("Project / client") && dashboardClient.includes("PAST DUE"), "Admin dashboard is missing the laptop operations table or collection KPI");
assert.ok(dashboardClient.includes("Delivery overdue") && dashboardClient.includes("Payment past due") && dashboardClient.includes("Due soon"), "Admin attention center does not cover delivery, collection and deadline risk");
assert.ok(dashboardClient.includes("priority = 0") && dashboardClient.includes(".sort((a, b) => a.priority - b.priority)"), "Admin attention queue is not risk-prioritized");
assert.ok(adminClient.includes("admin-project-command") && adminClient.includes("SUBSCRIPTION") && adminClient.includes("detail.project.phase"), "Project operations is missing the laptop command bar");
assert.ok(adminClient.includes("admin-project-tabs") && adminClient.includes("admin-project-chat") && adminClient.includes("admin-project-handover"), "Project operations is missing direct section navigation");
assert.ok(adminClient.includes('projectSection === "overview"') && adminClient.includes('projectSection === "chat"') && adminClient.includes('projectSection === "files"'), "Project operation tabs are not focused conditional workspaces");
assert.ok(adminClient.includes("admin-tab-workspace-chat") && adminClient.includes('projectSection === "team"'), "Chat and team are not isolated admin workspaces");
assert.ok(pricing.includes('setup:"$149",monthly:"$19"') && pricing.includes('setup:"$299",monthly:"$35"') && pricing.includes('setup:"$499",monthly:"$59"'), "Published website plan pricing drifted from the approved catalog");
assert.ok(pricing.includes('setup:"$699",monthly:"$79"') && pricing.includes('setup:"$1,199",monthly:"$129"') && pricing.includes('monthly:"$199+"'), "Published commerce/custom pricing drifted from the approved catalog");
assert.ok(pricing.includes('Up to 20 pages') && pricing.includes('6 updates / month'), "Published plan limits drifted from the approved catalog");
assert.ok(pricing.includes('/start?plan=${encodeURIComponent(p.name)}'), "Pricing plan CTA must carry the selected plan into intake");
assert.ok(intake.includes('new URLSearchParams(window.location.search).get("plan")') && intake.includes("planOptions).find"), "Project intake must validate and preselect the pricing plan query");
assert.ok(billingClient.includes("Day 7") && billingClient.includes("Day 14") && billingClient.includes("Day 30"), "Billing center does not expose the collection policy");
assert.ok(admin.includes("existing?.starts_at||now.toISOString()"), "Subscription updates must preserve the original start date");
assert.ok(admin.includes("existing?.next_billing_at||nextBilling.toISOString()"), "Subscription updates must preserve the current billing date");
assert.ok(admin.includes("project:projectMap.get"), "Billing API does not connect subscriptions to client projects");
assert.ok(billingClient.includes("/admin/projects?project="), "Billing actions do not route to the related client project");
assert.ok(siteNav.includes("portalHref"), "Client navigation does not preserve active project context");
assert.ok(siteNav.includes("useSearchParams") && siteNav.includes('searchParams.get("project")'), "Client portal project context must use Next search params instead of window during render");
assert.ok(accountClient.includes("currentProjectId ? `/workspace?project="), "Account workspace link does not preserve project context");
assert.ok(accountClient.includes("currentProjectId ? `/chat?project="), "Account chat link does not preserve project context");
assert.ok(chatWorkspace.includes("Open project workspace"), "Project chat is not connected back to Workspace");
assert.ok(!chatWorkspace.includes("Search or start new chat"), "Placeholder chat search control is still exposed");
assert.ok(client.includes('if(value==="archived") return "archived"'), "Workspace API collapses archived projects into a misleading state");
assert.ok(client.includes('if(value==="planned") return "planned"'), "Workspace API collapses planned projects into a misleading state");
assert.ok(workspace.includes("statusArchived"), "Workspace UI does not expose archived project state");
assert.ok(client.includes("client_subscriptions?select=*,plan:plan_catalog(*)"), "Workspace API does not expose the client subscription context");
assert.ok(workspace.includes("workspace-commercial-overview") && workspace.includes("activeSubscription"), "Workspace does not connect project status to the active subscription");
assert.ok(workspace.includes("requestedPlan") && workspace.includes("monthlyService"), "Workspace does not distinguish requested plan from recurring service");
assert.ok(workspace.includes("workspace-v2-overview") && workspace.includes("overviewTitle"), "Workspace is missing the at-a-glance project overview");
assert.ok(workspace.includes("clientAction.required") && workspace.includes("nextMilestone") && workspace.includes("latestUpdate"), "Workspace overview does not surface action, milestone and latest update together");
assert.ok(workspace.includes("statusPlanned"), "Workspace UI does not expose planning project state");
assert.ok(chatWorkspace.includes("chat-shell-loading"), "Project chat has no explicit loading state");
assert.ok(siteNav.includes('{ href: "/workspace", en: "Workspace"'), "Client portal navigation is missing Workspace");
assert.ok(siteNav.includes('{ href: "/chat", en: "Project Chat"'), "Client portal navigation is missing Project Chat");
assert.ok(siteNav.includes('{ href: "/handover", en: "Handover"'), "Client portal navigation is missing Handover");
assert.ok(siteNav.includes('{ href: "/account", en: "Account"'), "Client portal navigation is missing Account");
assert.ok(schema.includes("action_kind text not null default 'project_update'"));
assert.ok(schema.includes("destination text not null default '/workspace'"));

// 6) Final handover exposes completed items and ready/approved delivery files.
assert.ok(handover.includes("/api/handover"));
assert.ok(handover.includes("files"));
assert.ok(client.includes("category=in.(handover,deliverable)"));
assert.ok(client.includes("status=in.(ready,approved)"));
assert.ok(client.includes('status==="completed"') || client.includes('status==="completed"'));

// 7) RLS and least privilege remain part of the lifecycle contract.
for (const table of [
  "project_requests",
  "projects",
  "project_activity",
  "project_files",
  "conversations",
  "messages",
  "message_attachments",
  "handover_items",
  "notifications",
]) {
  assert.ok(
    schema.toLowerCase().includes(`alter table public.${table} enable row level security`),
    `RLS missing from lifecycle table: ${table}`,
  );
}
assert.ok(schema.includes("'app_metadata' ->> 'role'"));
assert.ok(schema.includes("grant select, insert, update on public.messages to authenticated"));

for (const privateRoute of ["/admin","/login","/workspace","/chat","/handover","/account","/api/"]) {
  assert.ok(robots.includes(`Disallow: ${privateRoute}`), `Private route is indexable in robots.txt: ${privateRoute}`);
}
for (const publicRoute of ["/pricing","/how-we-work","/service-finder"]) {
  assert.ok(sitemap.includes(`${publicRoute}</loc>`), `Commercial route is missing from sitemap: ${publicRoute}`);
}
assert.ok(terms.includes("recurring monthly service"), "Terms do not cover recurring subscription service");
assert.ok(terms.includes("رسوم تأسيس واشتراكًا شهريًا"), "Arabic terms do not cover setup and recurring subscription fees");

console.log("PASS: LINETECH end-to-end lifecycle contract is wired from intake through handover");
