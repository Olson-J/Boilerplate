-- Profiles table and related auth triggers/policies

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text constraint full_name_length_check check (char_length(full_name) <= 50),
  bio text constraint bio_length_check check (char_length(bio) <= 160),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profile data for each authenticated user.';

-- Update updated_at on row updates
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

-- Automatically create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles
  for select
  using ((select auth.uid()) = id);

create policy "Profiles are insertable by owner"
  on public.profiles
  for insert
  with check ((select auth.uid()) = id);

create policy "Profiles are updatable by owner"
  on public.profiles
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
