-- Freshley database: run once in Supabase → SQL Editor → New query → Run.
-- Safe to re-run: every statement is idempotent.
-- Then run supabase/seed-products.sql to load the vegetables and greens.

-- ---------------------------------------------------------------- tables

create table if not exists public.products (
  id          text primary key,                 -- e.g. 'tomato'
  kind        text not null check (kind in ('vegetable', 'leafy')),
  category    text,                             -- vegetables only, see vegetableCategories in src/data/produce.js
  name        text not null,
  name_te     text,
  name_hi     text,
  emoji       text not null default '🥬',
  seasonal    boolean not null default false,
  available   boolean not null default true,   -- false = hidden from the basket builder
  sort        integer not null default 0,
  updated_at  timestamptz not null default now()
);

create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  name           text not null,
  mobile         text not null unique check (mobile ~ '^[6-9][0-9]{9}$'),
  alt_mobile     text check (alt_mobile is null or alt_mobile ~ '^[6-9][0-9]{9}$'),
  address_line1  text not null,
  address_line2  text not null,
  city           text not null,
  pincode        text not null check (pincode ~ '^[1-9][0-9]{5}$'),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Admins are added by hand in the SQL editor (see SETUP-backend.md), never from the site.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table if not exists public.subscriptions (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null unique references public.profiles (id) on delete cascade,
  status        text not null default 'active' check (status in ('active', 'paused')),
  delivery_day  text not null check (delivery_day in ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  vegetables    text[] not null check (cardinality(vegetables) between 1 and 8),
  leafy_greens  text[] not null default '{}' check (cardinality(leafy_greens) <= 5),
  started_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- One row per weekly basket. Created and kept in sync from the subscription by
-- sync_subscription_order(); customers only read these, admins update status.
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid not null references public.profiles (id) on delete cascade,
  subscription_id  uuid references public.subscriptions (id) on delete set null,
  delivery_date    date not null,
  vegetables       text[] not null,
  leafy_greens     text[] not null default '{}',
  status           text not null default 'scheduled' check (status in ('scheduled', 'packed', 'delivered', 'skipped')),
  name             text not null,   -- snapshot of the customer's details for the packing list
  mobile           text not null,
  alt_mobile       text,
  address          text not null,
  pincode          text not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (customer_id, delivery_date)
);

create index if not exists orders_delivery_date_idx on public.orders (delivery_date);

-- ---------------------------------------------------------------- helpers

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- Delivery rules (match src/data/site.js): order by 12 pm the day before,
-- delivered next morning. Times are India time.
create or replace function public.order_cutoff(delivery date)
returns timestamptz
language sql stable
as $$ select ((delivery - 1) + time '12:00') at time zone 'Asia/Kolkata' $$;

-- The next delivery on `day` whose cutoff has not passed yet.
create or replace function public.next_delivery_date(day text, at timestamptz default now())
returns date
language plpgsql stable
as $$
declare
  target int := array_position(array['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], day);
  today date := (at at time zone 'Asia/Kolkata')::date;
  candidate date;
begin
  for i in 0..8 loop
    candidate := today + i;
    if extract(isodow from candidate) = target and at < public.order_cutoff(candidate) then
      return candidate;
    end if;
  end loop;
  return null;
end $$;

-- Makes the customer's next unlocked order match their subscription: creates it,
-- updates its items/address, or removes it when paused. Locked orders (past the
-- cutoff) are never touched.
create or replace function public.sync_subscription_order(sub_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  sub public.subscriptions;
  p   public.profiles;
  next_date date;
begin
  select * into sub from public.subscriptions where id = sub_id;
  if not found then return; end if;
  select * into p from public.profiles where id = sub.customer_id;

  next_date := case when sub.status = 'active' then public.next_delivery_date(sub.delivery_day) end;

  -- drop unlocked, still-scheduled orders that no longer match (day changed / paused)
  delete from public.orders o
  where o.subscription_id = sub.id
    and o.status = 'scheduled'
    and now() < public.order_cutoff(o.delivery_date)
    and (next_date is null or o.delivery_date <> next_date);

  if next_date is null then return; end if;

  insert into public.orders (customer_id, subscription_id, delivery_date, vegetables, leafy_greens,
                             name, mobile, alt_mobile, address, pincode)
  values (sub.customer_id, sub.id, next_date, sub.vegetables, sub.leafy_greens,
          p.name, p.mobile, p.alt_mobile,
          p.address_line1 || ', ' || p.address_line2 || ', ' || p.city, p.pincode)
  on conflict (customer_id, delivery_date) do update
    set vegetables   = excluded.vegetables,
        leafy_greens = excluded.leafy_greens,
        name         = excluded.name,
        mobile       = excluded.mobile,
        alt_mobile   = excluded.alt_mobile,
        address      = excluded.address,
        pincode      = excluded.pincode,
        updated_at   = now()
    where public.orders.status = 'scheduled' and now() < public.order_cutoff(public.orders.delivery_date);
end $$;

-- Run hourly by pg_cron: once this week's basket locks, next week's order appears.
create or replace function public.sync_all_orders()
returns void
language plpgsql security definer set search_path = public
as $$
declare sub_id uuid;
begin
  for sub_id in select id from public.subscriptions loop
    perform public.sync_subscription_order(sub_id);
  end loop;
end $$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end $$;

create or replace function public.after_subscription_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  perform public.sync_subscription_order(new.id);
  return null;
end $$;

-- A changed name / number / address flows into the customer's unlocked order.
create or replace function public.after_profile_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare sub_id uuid;
begin
  for sub_id in select id from public.subscriptions where customer_id = new.id loop
    perform public.sync_subscription_order(sub_id);
  end loop;
  return null;
end $$;

drop trigger if exists subscriptions_touch on public.subscriptions;
create trigger subscriptions_touch before update on public.subscriptions
  for each row execute function public.touch_updated_at();

drop trigger if exists subscriptions_sync on public.subscriptions;
create trigger subscriptions_sync after insert or update on public.subscriptions
  for each row execute function public.after_subscription_change();

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists profiles_sync on public.profiles;
create trigger profiles_sync after update on public.profiles
  for each row execute function public.after_profile_change();

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- security
-- Row Level Security: customers see only their own rows; admins see everything.

alter table public.products      enable row level security;
alter table public.profiles      enable row level security;
alter table public.admins        enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders        enable row level security;

drop policy if exists "products are public" on public.products;
create policy "products are public" on public.products for select using (true);
drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "own profile or admin" on public.profiles;
create policy "own profile or admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists "create own profile" on public.profiles;
create policy "create own profile" on public.profiles for insert
  with check (id = auth.uid());
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

drop policy if exists "see own admin row" on public.admins;
create policy "see own admin row" on public.admins for select using (user_id = auth.uid());

drop policy if exists "own subscription or admin" on public.subscriptions;
create policy "own subscription or admin" on public.subscriptions for select
  using (customer_id = auth.uid() or public.is_admin());
drop policy if exists "create own subscription" on public.subscriptions;
create policy "create own subscription" on public.subscriptions for insert
  with check (customer_id = auth.uid());
drop policy if exists "update own subscription" on public.subscriptions;
create policy "update own subscription" on public.subscriptions for update
  using (customer_id = auth.uid() or public.is_admin())
  with check (customer_id = auth.uid() or public.is_admin());

drop policy if exists "own orders or admin" on public.orders;
create policy "own orders or admin" on public.orders for select
  using (customer_id = auth.uid() or public.is_admin());
drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders for update
  using (public.is_admin()) with check (public.is_admin());

-- Order syncing runs only from the triggers and the hourly job, never from the site.
revoke execute on function public.sync_all_orders() from public, anon, authenticated;
revoke execute on function public.sync_subscription_order(uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------- schedule
-- Hourly job that creates next week's orders. pg_cron is included in the free tier.

create extension if not exists pg_cron;
select cron.unschedule('freshley-sync-orders')
  where exists (select 1 from cron.job where jobname = 'freshley-sync-orders');
select cron.schedule('freshley-sync-orders', '5 * * * *', $$select public.sync_all_orders()$$);
