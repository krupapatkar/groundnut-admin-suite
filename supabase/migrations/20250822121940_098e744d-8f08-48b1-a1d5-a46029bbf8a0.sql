-- Enable pgcrypto for bcrypt hashing
create extension if not exists pgcrypto;

-- Function to hash password if not already bcrypt
create or replace function public.hash_user_password()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.password is not null and new.password <> '' and new.password !~ '^\\$2[aby]\\$\\d{2}\\$' then
    new.password := crypt(new.password, gen_salt('bf'));
  end if;
  return new;
end;
$$;

-- Trigger to hash on insert/update
drop trigger if exists trg_hash_user_password on public.users;
create trigger trg_hash_user_password
before insert or update of password on public.users
for each row
execute function public.hash_user_password();

-- Backfill: hash any existing plain-text passwords
update public.users
set password = crypt(password, gen_salt('bf'))
where password is not null
  and password <> ''
  and password not like '$2a$%'
  and password not like '$2b$%'
  and password not like '$2y$%';