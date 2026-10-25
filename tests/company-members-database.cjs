const assert = require('node:assert/strict');
const fs = require('node:fs');
const {PGlite} = require('@electric-sql/pglite');
const {randomUUID} = require('node:crypto');
(async()=>{
  const db=await PGlite.create();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,deleted_at timestamptz,banned_until timestamptz);
      create function auth.uid() returns uuid language sql stable as $$select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid$$;
      create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}'::jsonb)$$;
      grant usage on schema auth to authenticated,anon;`);
    const owner=randomUUID(),member=randomUUID(),other=randomUUID(),admin=randomUUID(),unverified=randomUUID();
    for(const [id,email,confirmed] of [[owner,'owner@example.test',true],[member,'member@example.test',true],[other,'other@example.test',true],[admin,'admin@example.test',true],[unverified,'unverified@example.test',false]])
      await db.query('insert into auth.users values($1,$2,$3,null,null)',[id,email,confirmed?new Date():null]);
    const files=fs.readdirSync('supabase/migrations');
    for(const suffix of ['_company_applications.sql','_company_members_invitations.sql'])await db.exec(fs.readFileSync('supabase/migrations/'+files.find(x=>x.endsWith(suffix)),'utf8'));
    async function actor(id,role='client',claims={}){
      await db.exec('reset role');
      await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:id,app_metadata:{role},...claims})]);
      await db.exec('set role authenticated');
    }
    async function scalar(sql,params=[]){return (await db.query(sql,params)).rows[0].result;}
    async function createCompany(id,name){
      await actor(id);
      const app=(await db.query('select * from public.submit_company_application($1,$2,$3,$4,$5,$6)',[randomUUID(),name,'Test Contact','contact@example.test','','Workspace testing example.'])).rows[0];
      await actor(admin,'admin');return (await db.query("select * from public.review_company_application($1,'approved','')",[app.id])).rows[0].company_id;
    }
    const a=await createCompany(owner,'Company A'),b=await createCompany(other,'Company B');
    const team=c=>scalar('select public.company_team($1) result',[c]);
    const manage=(c,action,email=null,invitation=null,user=null)=>scalar('select public.manage_company_team($1,$2,$3,$4,$5) result',[c,action,email,invitation,user]);
    const respond=(id,action='accept')=>scalar('select public.respond_company_invitation($1,$2) result',[id,action]);
    const inbox=()=>scalar('select public.my_company_invitations() result');
    await actor(owner);
    assert.equal((await team(a)).owner,true);
    await assert.rejects(()=>team(b),e=>e.code==='42501');
    const invite=await manage(a,'invite',' MEMBER@example.test ');
    assert.equal((await manage(a,'invite','member@example.test')).id,invite.id,'Retry must not create a duplicate invitation');
    await assert.rejects(()=>manage(a,'invite','invalid'),e=>e.code==='22023');
    await assert.rejects(()=>manage(a,'invite','owner@example.test'),e=>e.code==='40001');
    await assert.rejects(()=>manage(a,'remove',null,null,owner),e=>e.code==='22023');
    await assert.rejects(()=>db.query("insert into public.company_memberships(company_id,user_id,role) values($1,$2,'member')",[a,member]),e=>e.code==='42501');
    await assert.rejects(()=>db.query('select * from public.company_invitations'),e=>e.code==='42501');
    await actor(other,'client',{email:'member@example.test',user_metadata:{role:'admin'}});
    assert.equal((await inbox()).length,0,'JWT email must not select another user’s invitations');
    await assert.rejects(()=>respond(invite.id),e=>e.code==='42501');
    await assert.rejects(()=>manage(a,'invite','someone@example.test'),e=>e.code==='42501');
    await assert.rejects(()=>team(a),e=>e.code==='42501');
    await actor(member);
    assert.equal((await inbox())[0].company_name,'Company A');
    assert.equal((await respond(invite.id)).company_id,a);
    assert.equal((await respond(invite.id)).company_id,a,'Accept retry is idempotent');
    assert.equal((await inbox()).length,0);
    assert.equal((await db.query('select * from public.companies')).rows[0].id,a,'Accepted membership enables company visibility');
    const memberTeam=await team(a);
    assert.equal(memberTeam.owner,false);assert.equal(memberTeam.members.length,2);
    assert(memberTeam.members.every(m=>m.email===null),'Members do not receive teammates’ emails');
    assert.deepEqual(memberTeam.invitations,[]);
    await assert.rejects(()=>manage(a,'invite','someone@example.test'),e=>e.code==='42501');
    await assert.rejects(()=>manage(a,'remove',null,null,owner),e=>e.code==='42501');
    await actor(owner);assert.equal((await team(a)).members.find(m=>m.user_id===member).role,'member');
    await manage(a,'remove',null,null,member);
    await actor(member);await assert.rejects(()=>team(a),e=>e.code==='42501');
    await assert.rejects(()=>respond(invite.id),e=>e.code==='40001','Old invitation cannot re-add a removed member');
    assert.equal((await db.query('select * from public.companies')).rows.length,0);
    await actor(owner);
    const revoked=await manage(a,'invite','member@example.test');
    await manage(a,'revoke',null,revoked.id);await manage(a,'revoke',null,revoked.id);
    await actor(member);await assert.rejects(()=>respond(revoked.id),e=>e.code==='40001');
    await actor(owner);const declined=await manage(a,'invite','member@example.test');
    await actor(member);await respond(declined.id,'decline');await respond(declined.id,'decline');
    await assert.rejects(()=>respond(declined.id),e=>e.code==='40001');
    await actor(owner);const expired=await manage(a,'invite','member@example.test');
    await db.exec('reset role');await db.query("update public.company_invitations set created_at=now()-interval '9 days',expires_at=now()-interval '1 day' where id=$1",[expired.id]);
    await actor(member);assert.equal((await inbox()).length,0);await assert.rejects(()=>respond(expired.id),e=>e.code==='40001');
    await actor(owner);const fresh=await manage(a,'invite','member@example.test');assert.notEqual(fresh.id,expired.id);
    const notVerified=await manage(a,'invite','unverified@example.test');
    await actor(unverified,'client',{email:'unverified@example.test',email_confirmed_at:'2026-01-01'});
    assert.equal((await inbox()).length,0);await assert.rejects(()=>respond(notVerified.id),e=>e.code==='42501');
    await actor(member,'client',{is_anonymous:true});await assert.rejects(()=>inbox(),e=>e.code==='42501');
    // Membership and invitation decision roll back together if an insert fails.
    await db.exec(`reset role; create function public.fail_test_member() returns trigger language plpgsql as $$begin raise exception 'test failure';end$$;
      create trigger fail_test_member before insert on public.company_memberships for each row execute function public.fail_test_member();`);
    await actor(member);await assert.rejects(()=>respond(fresh.id),e=>e.code==='P0001');
    assert.equal((await inbox())[0].id,fresh.id);
    await db.exec('reset role;drop trigger fail_test_member on public.company_memberships;drop function public.fail_test_member();');
    // Verify current auth record, including email changes, rather than stale JWT.
    await db.query("update auth.users set email='changed@example.test' where id=$1",[member]);
    await actor(member,'client',{email:'member@example.test'});await assert.rejects(()=>respond(fresh.id),e=>e.code==='42501');
    await db.exec('reset role');await db.query('update auth.users set banned_until=now()+interval \'1 day\' where id=$1',[owner]);
    await actor(owner);await assert.rejects(()=>team(a),e=>e.code==='42501');
    await db.exec('reset role;set role anon');
    await assert.rejects(()=>inbox(),e=>e.code==='42501');await assert.rejects(()=>team(a),e=>e.code==='42501');
    await db.exec('reset role');
    const funcs=(await db.query("select p.proname,p.prosecdef,p.proconfig,has_function_privilege('anon',p.oid,'EXECUTE') as anon from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('company_team','manage_company_team','my_company_invitations','respond_company_invitation')")).rows;
    assert.equal(funcs.length,4);assert(funcs.every(f=>!f.prosecdef&&!f.anon));
    assert.equal((await db.query("select relrowsecurity from pg_class where oid='public.company_invitations'::regclass")).rows[0].relrowsecurity,true);
    console.log('PASS: actual PostgreSQL company invitation lifecycle, verified live email, owner-only writes, replay, expiry, revocation, removal, cross-company isolation, grants and transactional rollback');
  } finally {await db.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
