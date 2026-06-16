-- ─── UPDATED_AT HELPER ─────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── PROFILES ──────────────────────────────────────────────────────────────────
-- One row per auth user, auto-created on sign-up via trigger below.
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Trigger: auto-create profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── CLIENTS ───────────────────────────────────────────────────────────────────
create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  name       text not null,
  email      text not null,
  phone      text,
  company    text,
  address    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_user_id_idx on public.clients(user_id);

alter table public.clients enable row level security;

create policy "Users can manage own clients"
  on public.clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_clients_updated_at
  before update on public.clients
  for each row execute procedure public.set_updated_at();

-- ─── INVOICES ──────────────────────────────────────────────────────────────────
create table public.invoices (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  client_id  uuid not null references public.clients(id) on delete restrict,
  number     text not null,
  amount     numeric(12, 2) not null check (amount >= 0),
  currency   text not null default 'USD',
  issue_date date not null,
  due_date   date not null,
  status     text not null default 'draft'
               check (status in ('draft', 'pending', 'paid', 'overdue')),
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, number)
);

create index invoices_user_id_idx    on public.invoices(user_id);
create index invoices_client_id_idx  on public.invoices(client_id);
create index invoices_status_due_idx on public.invoices(status, due_date);

alter table public.invoices enable row level security;

create policy "Users can manage own invoices"
  on public.invoices for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_invoices_updated_at
  before update on public.invoices
  for each row execute procedure public.set_updated_at();

-- ─── REMINDERS ─────────────────────────────────────────────────────────────────
-- One row per scheduled reminder for an invoice.
-- sent_at is null until the email is dispatched.
create table public.reminders (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  trigger     text not null check (trigger in ('before_due', 'on_due', 'after_due')),
  days_offset integer not null default 0,
  sent_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index reminders_invoice_id_idx on public.reminders(invoice_id);
create index reminders_sent_at_idx    on public.reminders(sent_at) where sent_at is null;

alter table public.reminders enable row level security;

create policy "Users can manage reminders for own invoices"
  on public.reminders for all
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = reminders.invoice_id
        and invoices.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invoices
      where invoices.id = reminders.invoice_id
        and invoices.user_id = auth.uid()
    )
  );

-- ─── REMINDER SETTINGS ─────────────────────────────────────────────────────────
-- One row per user, auto-created on profile creation with sensible defaults.
create table public.reminder_settings (
  user_id            uuid primary key references public.profiles(id) on delete cascade,
  before_due_enabled boolean  not null default true,
  before_due_days    integer  not null default 3,
  on_due_enabled     boolean  not null default true,
  after_due_enabled  boolean  not null default true,
  after_due_days     integer[] not null default '{7,14}'
);

alter table public.reminder_settings enable row level security;

create policy "Users can manage own reminder settings"
  on public.reminder_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger: auto-create default reminder settings when a profile is created
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.reminder_settings (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();
