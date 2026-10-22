const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {PGlite}=require('@electric-sql/pglite');
(async()=>{const db=await PGlite.create();try{
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid$$;`);
await db.exec(`create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}'::jsonb)$$;grant usage on schema auth to authenticated,anon;`);
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',admin='33333333-3333-4333-8333-333333333333';
for(const id of [a,b,admin])await db.query('insert into auth.users(id) values($1)',[id]);
const migration=fs.readdirSync(path.join(__dirname,'../supabase/migrations')).find(x=>x.endsWith('_company_applications.sql'));await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations',migration),'utf8'));
async function actor(id,role='client',spoof=false){await db.exec('reset role');await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:id,app_metadata:{role},user_metadata:spoof?{role:'admin'}:{}})]);await db.exec('set role authenticated');}
const key='44444444-4444-4444-8444-444444444444';
async function submit(k=key,name='Example Company'){return (await db.query('select * from public.submit_company_application($1,$2,$3,$4,$5,$6)',[k,name,'Test Contact','TEST@example.test','','A company workspace for testing.'])).rows[0];}
await actor(a);const first=await submit();assert.equal(first.status,'pending');assert.equal(first.contact_email,'test@example.test');assert.equal((await submit()).id,first.id);
await assert.rejects(()=>submit(key,'Changed Name'),e=>e.code==='22023');
await assert.rejects(()=>submit('55555555-5555-4555-8555-555555555555'),e=>e.code==='23505');
await actor(b,'client',true);assert.equal((await db.query('select * from public.company_applications')).rows.length,0);
await assert.rejects(()=>db.query("select * from public.review_company_application($1,'approved','')",[first.id]),e=>e.code==='42501');
await assert.rejects(()=>db.query("insert into public.company_applications(applicant_id,submission_key,company_name,contact_name,contact_email,description) values($1,$2,'Other Co','Test','x@y.test','Valid description here')",[a,'66666666-6666-4666-8666-666666666666']),e=>e.code==='42501');
await actor(a);assert.equal((await db.query("update public.company_applications set status='rejected',decision_note='Nope',reviewed_by=$1,reviewed_at=now() returning id",[a])).rows.length,0);
await actor(admin,'admin');const approved=(await db.query("select * from public.review_company_application($1,'approved','Approved for testing')",[first.id])).rows[0];assert(approved.company_id);assert.equal(approved.reviewed_by,admin);
assert.equal((await db.query("select * from public.review_company_application($1,'approved','Approved for testing')",[first.id])).rows[0].company_id,approved.company_id);
await assert.rejects(()=>db.query("select * from public.review_company_application($1,'rejected','Different decision')",[first.id]),e=>e.code==='40001');
assert.equal((await db.query('select * from public.companies')).rows.length,1);assert.equal((await db.query('select * from public.company_memberships')).rows[0].role,'owner');
await actor(a);assert.equal((await db.query('select * from public.companies')).rows[0].id,approved.company_id);assert.equal((await db.query('select * from public.company_memberships')).rows.length,1);
await assert.rejects(()=>db.query("insert into public.companies(application_id,owner_id,name) values($1,$2,'Unauthorized company')",[first.id,a]),e=>e.code==='42501');
await actor(b);assert.equal((await db.query('select * from public.companies')).rows.length,0);assert.equal((await db.query('select * from public.company_memberships')).rows.length,0);
const second=await submit('77777777-7777-4777-8777-777777777777','Rejected Co');await actor(admin,'admin');await assert.rejects(()=>db.query("select * from public.review_company_application($1,'rejected','')",[second.id]),e=>e.code==='22023');
await db.query("select * from public.review_company_application($1,'rejected','Please clarify your company details')",[second.id]);assert.equal((await db.query('select * from public.companies')).rows.length,1);
await actor(b);assert.equal((await db.query('select * from public.company_applications')).rows[0].status,'rejected');
const atomic=await submit('88888888-8888-4888-8888-888888888888','Atomic Co');
await db.exec('reset role');await db.exec(`create function public.test_membership_failure() returns trigger language plpgsql as $$begin raise exception 'Simulated membership failure';end$$;create trigger test_membership_failure before insert on public.company_memberships for each row execute function public.test_membership_failure();`);
await actor(admin,'admin');await assert.rejects(()=>db.query("select * from public.review_company_application($1,'approved','')",[atomic.id]),e=>e.code==='P0001');
assert.equal((await db.query('select status from public.company_applications where id=$1',[atomic.id])).rows[0].status,'pending');assert.equal((await db.query('select * from public.companies')).rows.length,1);
await db.exec('reset role;drop trigger test_membership_failure on public.company_memberships;drop function public.test_membership_failure();');
await db.exec('reset role;set role anon');await assert.rejects(()=>db.query('select * from public.company_applications'),e=>e.code==='42501');await assert.rejects(()=>db.query('select * from public.companies'),e=>e.code==='42501');
await db.exec('reset role');const funcs=await db.query("select prosecdef from pg_proc join pg_namespace n on n.oid=pronamespace where n.nspname='public' and proname in ('submit_company_application','review_company_application')");assert.equal(funcs.rows.length,2);assert(funcs.rows.every(x=>x.prosecdef===false));
const grants=await db.query("select has_function_privilege('anon','public.review_company_application(uuid,text,text)','EXECUTE') as review,has_function_privilege('anon','public.submit_company_application(uuid,text,text,text,text,text)','EXECUTE') as submit");assert.equal(grants.rows[0].review,false);assert.equal(grants.rows[0].submit,false);
const policies=await db.query("select relrowsecurity from pg_class join pg_namespace n on n.oid=relnamespace where n.nspname='public' and relname in ('company_applications','companies','company_memberships')");assert.equal(policies.rows.length,3);assert(policies.rows.every(x=>x.relrowsecurity));
console.log('PASS: actual PostgreSQL application/review RPCs, idempotency, rejection, atomic company creation, owner membership and cross-user/anonymous RLS isolation');
}finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
