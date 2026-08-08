-- Library name uniqueness for batch upsert (owner_id is null = shared library)
create unique index if not exists exercises_library_name_uidx
  on exercises (name)
  where owner_id is null;

-- Per-user timezone (calendar / "today" correctness)
create table if not exists user_settings (
  user_id text primary key references "user"(id) on delete cascade,
  time_zone text not null default 'Europe/Istanbul',
  updated_at timestamptz not null default now()
);
