create table public.learners (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);
create table public.lesson_completions (
  user_id uuid not null references public.learners(user_id) on delete cascade,
  lesson_id text not null check (lesson_id in ('define', 'track', 'render')),
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create table public.achievement_states (
  user_id uuid primary key references public.learners(user_id) on delete cascade,
  state jsonb not null,
  schema_version integer not null default 1 check (schema_version = 1),
  updated_at timestamptz not null default now()
);
-- No browser access policies: every earned-progress operation uses an authenticated app route.
-- The server database role must own these tables or hold BYPASSRLS; never expose its credentials.
-- UUIDs come exclusively from validated Supabase auth identities. No email/profile data is stored.
revoke all on public.learners, public.lesson_completions, public.achievement_states from public;
alter table public.learners enable row level security;
alter table public.lesson_completions enable row level security;
alter table public.achievement_states enable row level security;
do $$
declare role_name text;
begin
  foreach role_name in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = role_name) then
      execute format('revoke all on public.learners, public.lesson_completions, public.achievement_states from %I', role_name);
    end if;
  end loop;
end $$;
