-- Social depth: user posts, notifications, comment replies/likes, verified badge

-- ── posts ──────────────────────────────────────────────────────────
create table if not exists posts (
  id                   bigserial primary key,
  user_id              text not null references "user"(id) on delete cascade,
  body                 text not null,
  attached_workout_id  bigint references workouts(id) on delete set null,
  attached_program_id  bigint references programs(id) on delete set null,
  created_at           timestamptz not null default now(),
  edited_at            timestamptz
);

create index if not exists posts_user_created_idx
  on posts (user_id, created_at desc);

-- ── activity type: user_post ───────────────────────────────────────
-- Drop any check constraint on activity_events.type and re-add expanded set
do $$
declare
  cname text;
begin
  for cname in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where rel.relname = 'activity_events'
      and nsp.nspname = 'public'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%type%'
  loop
    execute format('alter table activity_events drop constraint %I', cname);
  end loop;
end $$;

alter table activity_events
  add constraint activity_events_type_check
  check (type in (
    'workout_completed',
    'personal_record',
    'program_published',
    'streak_milestone',
    'user_post'
  ));

-- One activity card per post
create unique index if not exists activity_user_post_uidx
  on activity_events (user_id, subject_id)
  where type = 'user_post' and subject_id is not null;

-- ── comment replies + edit ─────────────────────────────────────────
alter table activity_comments
  add column if not exists parent_id bigint references activity_comments(id) on delete cascade;
alter table activity_comments
  add column if not exists edited_at timestamptz;

create index if not exists activity_comments_parent_idx
  on activity_comments (parent_id)
  where parent_id is not null;

-- ── comment likes ──────────────────────────────────────────────────
create table if not exists activity_comment_likes (
  comment_id bigint not null references activity_comments(id) on delete cascade,
  user_id    text not null references "user"(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

-- ── notifications ──────────────────────────────────────────────────
create table if not exists notifications (
  id           bigserial primary key,
  user_id      text not null references "user"(id) on delete cascade,
  actor_id     text not null references "user"(id) on delete cascade,
  type         text not null
    check (type in (
      'like',
      'comment',
      'reply',
      'follow',
      'mention',
      'comment_like'
    )),
  subject_type text not null
    check (subject_type in ('activity', 'comment', 'user', 'post')),
  subject_id   text not null,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists notifications_user_created_idx
  on notifications (user_id, created_at desc);

create index if not exists notifications_user_unread_idx
  on notifications (user_id)
  where read_at is null;

-- ── verified badge ─────────────────────────────────────────────────
alter table user_profiles
  add column if not exists verified boolean not null default false;
