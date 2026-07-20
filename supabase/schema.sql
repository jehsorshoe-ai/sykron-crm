-- Orbit CRM: schema inicial multiempresa para executar no SQL Editor do Supabase.
-- As tabelas ficam inacessíveis até o usuário pertencer à organização do registro.
create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, document text, website text, segment text, created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null, name text not null, email text, phone text,
  job_title text, created_at timestamptz not null default now()
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null, contact_id uuid references public.contacts(id) on delete set null,
  owner_id uuid references auth.users(id) on delete set null, title text not null, value numeric(12,2) not null default 0,
  stage text not null default 'new' check (stage in ('new','diagnosis','proposal','negotiation','won','lost')),
  expected_close_date date, loss_reason text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete cascade, assigned_to uuid references auth.users(id) on delete set null,
  title text not null, due_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.deals enable row level security;
alter table public.tasks enable row level security;

grant select, insert, update, delete on public.organizations, public.organization_members, public.companies, public.contacts, public.deals, public.tasks to authenticated;

create policy "members_select_organizations" on public.organizations for select to authenticated
using (id in (select organization_id from public.organization_members where user_id = (select auth.uid())));
create policy "members_select_memberships" on public.organization_members for select to authenticated
using (user_id = (select auth.uid()));

create policy "members_select_companies" on public.companies for select to authenticated
using (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())));
create policy "members_insert_companies" on public.companies for insert to authenticated
with check (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())));
create policy "members_update_companies" on public.companies for update to authenticated
using (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())))
with check (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())));
create policy "members_delete_companies" on public.companies for delete to authenticated
using (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())));

create policy "members_all_contacts" on public.contacts for all to authenticated
using (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())))
with check (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())));
create policy "members_all_deals" on public.deals for all to authenticated
using (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())))
with check (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())));
create policy "members_all_tasks" on public.tasks for all to authenticated
using (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())))
with check (organization_id in (select organization_id from public.organization_members where user_id = (select auth.uid())));

create index if not exists companies_organization_idx on public.companies(organization_id);
create index if not exists contacts_organization_idx on public.contacts(organization_id);
create index if not exists deals_organization_stage_idx on public.deals(organization_id, stage);
create index if not exists tasks_organization_due_idx on public.tasks(organization_id, due_at);
