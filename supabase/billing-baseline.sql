-- Recovered from the live LINETECH catalog, 2026-10-02.
-- Prerequisite for selected_plan_code; creates only missing billing tables.

do $baseline$
begin
  if to_regclass('public.plan_catalog') is null then
    create table public.plan_catalog (
  "code" text not null,
  "name" text not null,
  "setup_price_usd" numeric(10,2),
  "monthly_price_usd" numeric(10,2),
  "max_pages" integer,
  "max_storage_gb" numeric(10,2),
  "max_monthly_updates" integer,
  "max_products" integer,
  "max_team_members" integer,
  "languages" integer,
  "priority_support" boolean default false not null,
  "support_response_hours" integer,
  "features" jsonb default '[]'::jsonb not null,
  "is_active" boolean default true not null,
  "sort_order" integer default 0 not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  constraint "plan_catalog_pkey" PRIMARY KEY (code)
    );
    alter table public.plan_catalog enable row level security;
    revoke all on table public.plan_catalog from anon, authenticated;
    grant select on public.plan_catalog to anon, authenticated;
    execute 'create policy "Public can read active plans" on public.plan_catalog for SELECT to anon, authenticated using ((is_active = true))';
  end if;
end;
$baseline$;

do $baseline$
begin
  if to_regclass('public.client_subscriptions') is null then
    create table public.client_subscriptions (
  "id" uuid default gen_random_uuid() not null,
  "client_id" uuid not null,
  "plan_code" text not null,
  "status" text default 'active'::text not null,
  "billing_cycle" text default 'monthly'::text not null,
  "setup_fee_usd" numeric(10,2),
  "recurring_price_usd" numeric(10,2),
  "started_at" timestamp with time zone default now() not null,
  "current_period_start" timestamp with time zone,
  "current_period_end" timestamp with time zone,
  "past_due_since" timestamp with time zone,
  "suspended_at" timestamp with time zone,
  "cancelled_at" timestamp with time zone,
  "custom_limits" jsonb default '{}'::jsonb not null,
  "internal_notes" text,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  constraint "client_subscriptions_billing_cycle_check" CHECK ((billing_cycle = ANY (ARRAY['monthly'::text, 'yearly'::text, 'custom'::text]))),
  constraint "client_subscriptions_client_id_fkey" FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  constraint "client_subscriptions_client_id_key" UNIQUE (client_id),
  constraint "client_subscriptions_internal_notes_check" CHECK (((internal_notes IS NULL) OR (char_length(internal_notes) <= 5000))),
  constraint "client_subscriptions_pkey" PRIMARY KEY (id),
  constraint "client_subscriptions_plan_code_fkey" FOREIGN KEY (plan_code) REFERENCES plan_catalog(code),
  constraint "client_subscriptions_status_check" CHECK ((status = ANY (ARRAY['trial'::text, 'active'::text, 'past_due'::text, 'suspended'::text, 'cancelled'::text])))
    );
    alter table public.client_subscriptions enable row level security;
    revoke all on table public.client_subscriptions from anon, authenticated;
    grant select, insert, update, delete on public.client_subscriptions to authenticated;
    execute 'create policy "Admins delete subscriptions" on public.client_subscriptions for DELETE to authenticated using ((COALESCE(((( SELECT auth.jwt() AS jwt) -> ''app_metadata''::text) ->> ''role''::text), ''''::text) = ''admin''::text))';
    execute 'create policy "Admins insert subscriptions" on public.client_subscriptions for INSERT to authenticated with check ((COALESCE(((( SELECT auth.jwt() AS jwt) -> ''app_metadata''::text) ->> ''role''::text), ''''::text) = ''admin''::text))';
    execute 'create policy "Admins update subscriptions" on public.client_subscriptions for UPDATE to authenticated using ((COALESCE(((( SELECT auth.jwt() AS jwt) -> ''app_metadata''::text) ->> ''role''::text), ''''::text) = ''admin''::text)) with check ((COALESCE(((( SELECT auth.jwt() AS jwt) -> ''app_metadata''::text) ->> ''role''::text), ''''::text) = ''admin''::text))';
    execute 'create policy "Clients read own subscription" on public.client_subscriptions for SELECT to authenticated using (((( SELECT auth.uid() AS uid) = client_id) OR (COALESCE(((( SELECT auth.jwt() AS jwt) -> ''app_metadata''::text) ->> ''role''::text), ''''::text) = ''admin''::text)))';
  end if;
end;
$baseline$;

insert into public.plan_catalog select * from jsonb_populate_recordset(null::public.plan_catalog,
'[{"code":"start","name":"START","features":["Responsive website","Custom domain connection","SSL, hosting & management","Basic SEO"],"is_active":true,"languages":1,"max_pages":5,"sort_order":1,"max_products":null,"max_storage_gb":1,"setup_price_usd":149,"max_team_members":1,"priority_support":false,"monthly_price_usd":19,"max_monthly_updates":1,"support_response_hours":48,"created_at":"2026-10-01T07:31:57.350448+00:00","updated_at":"2026-10-01T07:31:57.350448+00:00"},{"code":"business","name":"BUSINESS","features":["Arabic + English","Content management","Analytics","Enhanced SEO","Lead forms"],"is_active":true,"languages":2,"max_pages":10,"sort_order":2,"max_products":null,"max_storage_gb":3,"setup_price_usd":299,"max_team_members":2,"priority_support":false,"monthly_price_usd":35,"max_monthly_updates":3,"support_response_hours":24,"created_at":"2026-10-01T07:31:57.350448+00:00","updated_at":"2026-10-01T07:31:57.350448+00:00"},{"code":"pro","name":"PRO","features":["Advanced customization","Bookings","Advanced analytics","Priority support"],"is_active":true,"languages":2,"max_pages":20,"sort_order":3,"max_products":null,"max_storage_gb":5,"setup_price_usd":499,"max_team_members":5,"priority_support":true,"monthly_price_usd":59,"max_monthly_updates":5,"support_response_hours":12,"created_at":"2026-10-01T07:31:57.350448+00:00","updated_at":"2026-10-01T07:31:57.350448+00:00"},{"code":"ecommerce","name":"E-COMMERCE","features":["Products & categories","Cart & checkout","Orders","Inventory","Admin dashboard"],"is_active":true,"languages":2,"max_pages":null,"sort_order":4,"max_products":1000,"max_storage_gb":10,"setup_price_usd":699,"max_team_members":3,"priority_support":true,"monthly_price_usd":79,"max_monthly_updates":3,"support_response_hours":12,"created_at":"2026-10-01T07:31:57.350448+00:00","updated_at":"2026-10-01T07:31:57.350448+00:00"},{"code":"ecommerce_pro","name":"E-COMMERCE PRO","features":["Advanced inventory","Staff permissions","Sales reports","Advanced promotions","Priority integrations"],"is_active":true,"languages":2,"max_pages":null,"sort_order":5,"max_products":10000,"max_storage_gb":25,"setup_price_usd":1199,"max_team_members":10,"priority_support":true,"monthly_price_usd":129,"max_monthly_updates":6,"support_response_hours":6,"created_at":"2026-10-01T07:31:57.350448+00:00","updated_at":"2026-10-01T07:31:57.350448+00:00"},{"code":"custom","name":"CUSTOM","features":["Custom scope","CRM & business systems","Branches & roles","Custom APIs","Dedicated architecture"],"is_active":true,"languages":null,"max_pages":null,"sort_order":6,"max_products":null,"max_storage_gb":null,"setup_price_usd":null,"max_team_members":null,"priority_support":true,"monthly_price_usd":199,"max_monthly_updates":null,"support_response_hours":6,"created_at":"2026-10-01T07:31:57.350448+00:00","updated_at":"2026-10-01T07:31:57.350448+00:00"}]'::jsonb)
on conflict (code) do nothing;

