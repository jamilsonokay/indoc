-- Fix permissions for schema and tables
grant usage on schema public to postgres, anon, authenticated, service_role;

grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

-- Ensure RLS is enabled but policies exist
alter table public.profiles enable row level security;

-- Re-apply policies to be sure (drop if exists first)
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Ensure admin exists in auth.users and has a profile (Redundant check but safe)
do $$
declare
  admin_uid uuid;
begin
  select id into admin_uid from auth.users where email = 'admin@inpharma.cv';
  if admin_uid is not null then
    insert into public.profiles (id, email, full_name, role)
    values (admin_uid, 'admin@inpharma.cv', 'Administrador Sistema', 'admin')
    on conflict (id) do update set role = 'admin';
  end if;
end $$;
