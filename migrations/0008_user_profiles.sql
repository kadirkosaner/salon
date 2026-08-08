-- Social profiles: username, bio, avatar, privacy
create table if not exists user_profiles (
  user_id text primary key references "user"(id) on delete cascade,
  username text not null,
  bio text,
  avatar_url text,
  visibility text not null default 'public'
    check (visibility in ('public', 'followers', 'private')),
  unit_system text not null default 'metric'
    check (unit_system in ('metric', 'imperial')),
  measures_public boolean not null default false,
  username_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists user_profiles_username_lower_uidx
  on user_profiles (lower(username));
