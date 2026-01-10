-- Fix handle_new_user function to be more robust and set search_path
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user')
  on conflict (id) do update
  set 
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Ensure trigger is set
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Ensure admin profile exists if it was missed
do $$
declare
  admin_user_id uuid;
begin
  select id into admin_user_id from auth.users where email = 'admin@inpharma.cv';
  
  if admin_user_id is not null then
    insert into public.profiles (id, email, full_name, role)
    values (
      admin_user_id, 
      'admin@inpharma.cv', 
      'Administrador Sistema', 
      'admin'
    )
    on conflict (id) do update
    set role = 'admin';
  end if;
end $$;
