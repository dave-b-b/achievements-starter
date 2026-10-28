create table public.daily_events (
  day date not null default current_date,
  event text not null check (event in ('playground_view', 'first_unlock', 'copy_code', 'starter_open')),
  count integer not null default 1 check (count between 1 and 100000),
  primary key (day, event)
);
revoke all on public.daily_events from public;
alter table public.daily_events enable row level security;
do $$
declare role_name text;
begin
  foreach role_name in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = role_name) then
      execute format('revoke all on public.daily_events from %I', role_name);
    end if;
  end loop;
end $$;
