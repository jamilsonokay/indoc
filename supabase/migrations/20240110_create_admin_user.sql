-- Enable pgcrypto for password hashing
create extension if not exists "pgcrypto";

-- Insert admin user into auth.users
-- Password will be 'admin123'
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'admin@inpharma.cv',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Administrador Sistema"}',
  now(),
  now()
)
on conflict (email) do nothing;

-- The trigger on auth.users will automatically create the profile in public.profiles.
-- We just need to update that profile to be an admin.
update public.profiles
set role = 'admin'
where email = 'admin@inpharma.cv';
