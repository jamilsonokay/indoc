-- 1. Create a sequence table to track document numbers per category and year
create table public.document_sequences (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  year integer not null,
  current_val integer default 0,
  updated_at timestamptz default now(),
  unique(category, year)
);

-- Enable RLS for sequence table (only admin or system should touch this directly, but functions bypass RLS)
alter table public.document_sequences enable row level security;

-- 2. Add 'code' column to documents table
alter table public.documents 
add column code text unique;

-- 3. Function to generate document code
create or replace function public.generate_document_code()
returns trigger as $$
declare
  doc_year integer;
  doc_seq integer;
  new_code text;
  cat_prefix text;
begin
  -- Get current year
  doc_year := date_part('year', now())::integer;
  
  -- Extract category prefix (first 2-3 chars, uppercase) - fallback to 'DOC' if null
  if new.category is null then
     cat_prefix := 'DOC';
  else
     cat_prefix := upper(substring(new.category from 1 for 2));
  end if;

  -- Insert or update sequence
  insert into public.document_sequences (category, year, current_val)
  values (cat_prefix, doc_year, 1)
  on conflict (category, year)
  do update set current_val = public.document_sequences.current_val + 1
  returning current_val into doc_seq;

  -- Format: PRE_SEQ_YEAR (e.g., IT_01_2026)
  -- LPAD ensures 01 instead of 1
  new_code := cat_prefix || '_' || lpad(doc_seq::text, 2, '0') || '_' || doc_year::text;

  -- Set the code
  new.code := new_code;

  return new;
end;
$$ language plpgsql;

-- 4. Trigger to auto-generate code on insert
create trigger set_document_code
before insert on public.documents
for each row
execute procedure public.generate_document_code();
