-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ENUMS
-- Define document status
create type document_status as enum ('draft', 'pending_approval', 'approved', 'rejected', 'archived');
-- Define user roles
create type user_role as enum ('admin', 'manager', 'user');

-- 2. PROFILES (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  role user_role default 'user'::user_role,
  department text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. DOCUMENTS (Metadata for documents)
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text,
  current_version integer default 1,
  status document_status default 'draft'::document_status,
  owner_id uuid references public.profiles(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. DOCUMENT VERSIONS (Versioning control)
create table public.document_versions (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  version_number integer not null,
  file_url text not null,
  file_path text not null, -- Storage path
  uploaded_by uuid references public.profiles(id) not null,
  change_summary text, -- "Cycle of life": what changed in this version
  created_at timestamptz default now()
);

-- 5. DOCUMENT ACCESS (Access Control List)
-- Defines who can access which document and with what permission level
create table public.document_access (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  permission_level text check (permission_level in ('view', 'comment', 'edit', 'approve')),
  granted_by uuid references public.profiles(id) not null,
  created_at timestamptz default now(),
  unique(document_id, user_id)
);

-- 6. DOCUMENT ACKNOWLEDGMENTS (Tomada de Conhecimento)
create table public.document_acknowledgments (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  version_id uuid references public.document_versions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  acknowledged_at timestamptz default now(),
  notes text, -- Optional notes upon acknowledgment
  unique(document_id, version_id, user_id)
);

-- 7. AUDIT LOGS (Audit Trail / Lifecycle tracking)
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null, -- e.g., 'created', 'updated', 'viewed', 'downloaded', 'approved', 'rejected'
  details jsonb, -- Store extra metadata about the action
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- RLS (Row Level Security) Policies
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.document_versions enable row level security;
alter table public.document_access enable row level security;
alter table public.document_acknowledgments enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES Policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- DOCUMENTS Policies
-- Admins can do everything
create policy "Admins have full access to documents" on public.documents for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
-- Owners can view/edit their documents
create policy "Owners can view their documents" on public.documents for select using (owner_id = auth.uid());
create policy "Owners can update their documents" on public.documents for update using (owner_id = auth.uid());
-- Users with explicit access can view
create policy "Users with access can view documents" on public.documents for select using (
  exists (select 1 from public.document_access where document_id = id and user_id = auth.uid())
);

-- VERSIONS Policies
create policy "Admins have full access to versions" on public.document_versions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Users with document access can view versions" on public.document_versions for select using (
  exists (select 1 from public.documents d 
          left join public.document_access da on d.id = da.document_id
          where d.id = document_id and (d.owner_id = auth.uid() or da.user_id = auth.uid()))
);

-- ACKNOWLEDGMENTS Policies
create policy "Users can view their own acknowledgments" on public.document_acknowledgments for select using (user_id = auth.uid());
create policy "Users can create their own acknowledgments" on public.document_acknowledgments for insert with check (user_id = auth.uid());
create policy "Admins and Owners can view all acknowledgments for their docs" on public.document_acknowledgments for select using (
  exists (select 1 from public.documents d where d.id = document_id and (d.owner_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')))
);

-- TRIGGERS & FUNCTIONS
-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_profiles_updated_at before update on public.profiles for each row execute procedure update_updated_at_column();
create trigger update_documents_updated_at before update on public.documents for each row execute procedure update_updated_at_column();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
