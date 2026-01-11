-- Remove the manually inserted admin user to fix 500 Error
delete from auth.users where email = 'admin@inpharma.cv';

-- Remove the trigger temporarily to isolate issues
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
