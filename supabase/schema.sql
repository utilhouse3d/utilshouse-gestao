begin;
create table public.gestao_members (user_id uuid primary key references auth.users(id) on delete cascade, display_name text not null check (display_name in ('Felipe','Vinicius','Bruxao')));
alter table public.gestao_members enable row level security;
revoke all on public.gestao_members from anon, authenticated;
grant select on public.gestao_members to authenticated;
create policy own_membership on public.gestao_members for select to authenticated using(user_id=(select auth.uid()));
create table public.gestao_state (id integer primary key check(id=1), revision bigint not null default 0, payload jsonb not null default '{}'::jsonb check(jsonb_typeof(payload)='object' and octet_length(payload::text)<4000000), updated_at timestamptz not null default now());
insert into public.gestao_state(id) values(1);
alter table public.gestao_state enable row level security;
revoke all on public.gestao_state from anon, authenticated;
grant select on public.gestao_state to authenticated;
grant update(payload,revision,updated_at) on public.gestao_state to authenticated;
create policy member_read on public.gestao_state for select to authenticated using(exists(select 1 from public.gestao_members where user_id=(select auth.uid())));
create policy member_update on public.gestao_state for update to authenticated using(exists(select 1 from public.gestao_members where user_id=(select auth.uid()))) with check(exists(select 1 from public.gestao_members where user_id=(select auth.uid())) and id=1 and jsonb_typeof(payload)='object' and octet_length(payload::text)<4000000);
commit;

-- Depois de criar os usuários em Authentication > Users, autorize cada UUID:
-- insert into public.gestao_members(user_id,display_name) values ('UUID_DO_USUARIO','Felipe');
-- Repita para Vinicius e Bruxao. Execute cada insert como administrador.

