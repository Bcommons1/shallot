-- Run once in the Supabase SQL Editor or apply with `supabase db push`.
begin;

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  category text not null default 'From our kitchen',
  price numeric(10,2) check (price >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  dietary_labels text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.menu_items enable row level security;
revoke all on public.menu_items from anon, authenticated;
grant select on public.menu_items to anon, authenticated;
grant all on public.menu_items to service_role;
create policy "Visitors read published menu items" on public.menu_items
  for select to anon, authenticated using (published = true);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  type text not null check (type in ('general', 'catering')),
  message text not null check (char_length(message) between 10 and 3000),
  consent_at timestamptz not null default now(),
  fingerprint text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;
revoke all on public.inquiries from anon, authenticated;
grant all on public.inquiries to service_role;
-- Deliberately no public policies: inquiry details are private.
create index inquiries_rate_limit on public.inquiries (fingerprint, created_at desc);

create function public.submit_inquiry(p_name text, p_email text, p_type text, p_message text, p_fingerprint text)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  -- Serialize requests per fingerprint so simultaneous requests cannot bypass the cap.
  perform pg_advisory_xact_lock(hashtextextended(p_fingerprint, 0));
  if (select count(*) from public.inquiries where fingerprint = p_fingerprint and created_at > now() - interval '1 hour') >= 5 then
    raise sqlstate 'PT429' using message = 'Rate limit exceeded';
  end if;
  insert into public.inquiries (name, email, type, message, fingerprint)
  values (p_name, p_email, p_type, p_message, p_fingerprint);
end;
$$;
revoke all on function public.submit_inquiry(text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_inquiry(text, text, text, text, text) to service_role;

commit;
