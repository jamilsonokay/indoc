-- Enable pgcrypto for password hashing
create extension if not exists "pgcrypto";

-- Insert admin user into auth.users manually handling the check
do $$
declare
  new_user_id uuid := uuid_generate_v4();
begin
  if not exists (select 1 from auth.users where email = 'admin@inpharma.cv') then
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
      new_user_id,
      'authenticated',
      'authenticated',
      'admin@inpharma.cv',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Administrador Sistema"}',
      now(),
      now()
    );
  end if;
end $$;

-- Update profile to admin
update public.profiles
set role = 'admin'
where email = 'admin@inpharma.cv';
