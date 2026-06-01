-- Fix 1: Add INSERT policy on profiles so the auth trigger can insert
-- The trigger uses SECURITY DEFINER but Supabase still enforces RLS on the target table
create policy "Trigger can insert profiles" on profiles
  for insert with check (true);

-- Fix 2: Recreate trigger function with proper search_path (Supabase best practice)
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role', 'buyer'));
  return new;
end;
$$ language plpgsql security definer set search_path = public;
