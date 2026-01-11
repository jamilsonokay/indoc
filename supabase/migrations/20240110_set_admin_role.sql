-- Update the admin user role in public.profiles
-- We assume the email is 'admin@inpharma.cv'
update public.profiles
set role = 'admin'
where email = 'admin@inpharma.cv';

-- Ensure the enum type exists properly (it seems it does based on schema info)
-- If not, we would create it: create type user_role as enum ('admin', 'manager', 'user');
