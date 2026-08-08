-- Social activity feed
create table if not exists activity_events (
  id         bigserial primary key,
  user_id    text not null references "user"(id) on delete cascade,
  type       text not null
    check (type in (
      'workout_completed',
      'personal_record',
      'program_published',
      'streak_milestone'
    )),
  subject_id bigint,
  payload    jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists activity_user_created_idx
  on activity_events (user_id, created_at desc);
create index if not exists activity_created_idx
  on activity_events (created_at desc);

-- One workout_completed per workout
create unique index if not exists activity_workout_completed_uidx
  on activity_events (user_id, subject_id)
  where type = 'workout_completed' and subject_id is not null;

-- One program_published per program (until re-publish handled separately)
create unique index if not exists activity_program_published_uidx
  on activity_events (user_id, subject_id)
  where type = 'program_published' and subject_id is not null;

-- Streak milestones: subject_id = week count
create unique index if not exists activity_streak_uidx
  on activity_events (user_id, subject_id)
  where type = 'streak_milestone' and subject_id is not null;

-- PR events: subject_id = set id (optional uniqueness)
create unique index if not exists activity_pr_set_uidx
  on activity_events (user_id, subject_id)
  where type = 'personal_record' and subject_id is not null;

create table if not exists activity_likes (
  event_id   bigint not null references activity_events(id) on delete cascade,
  user_id    text not null references "user"(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists activity_comments (
  id         bigserial primary key,
  event_id   bigint not null references activity_events(id) on delete cascade,
  user_id    text not null references "user"(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists activity_comments_event_idx
  on activity_comments (event_id, created_at);
