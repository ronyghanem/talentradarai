-- =========================================================
-- TalentRadar AI — Auth-only schema (Phase 1)
-- Run in the Supabase SQL editor. This is intentionally scoped
-- to what authentication needs; jobs/candidates/matching tables
-- are added in supabase/schema.sql during the next phase.
-- =========================================================

create extension if not exists "uuid-ossp";

create type user_role as enum ('candidate', 'recruiter');

-- One row per auth user. Role decides which dashboard/UI a user sees.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create the profile row the moment someone signs up.
-- `role` and `full_name` are passed in as auth metadata at signup time
-- (see lib/actions/auth.ts -> signUp()).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'candidate'),
    coalesce(new.raw_user_meta_data->>'full_name', 'New User')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.profiles enable row level security;

create policy "Authenticated users can view all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);
