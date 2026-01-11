-- Temporarily disable RLS on profiles to rule out policy issues
alter table public.profiles disable row level security;

-- Ensure permissions are broad enough for now
grant all on public.profiles to anon, authenticated, service_role;
