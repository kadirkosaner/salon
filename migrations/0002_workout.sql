-- Workout tracker schema (snapshot-based history).
-- user_id is TEXT to match Better Auth / dev-user ids.

create table if not exists exercises (
  id serial primary key,
  owner_id text null,
  name text not null,
  detail text null,
  unit text not null default 'kg',
  muscle_group text not null default 'diger',
  default_note text null,
  created_at timestamptz not null default now()
);
create index if not exists exercises_owner_id_idx on exercises (owner_id);
create index if not exists exercises_name_idx on exercises (name);

create table if not exists programs (
  id serial primary key,
  user_id text not null,
  name text not null,
  is_active boolean not null default true,
  valid_from date not null default current_date,
  valid_to date null,
  created_at timestamptz not null default now()
);
create index if not exists programs_user_id_idx on programs (user_id);

create table if not exists program_days (
  id serial primary key,
  program_id int not null references programs(id) on delete cascade,
  dow smallint not null,
  name text not null,
  focus text null,
  sort smallint not null default 0
);
create index if not exists program_days_program_id_idx on program_days (program_id);

create table if not exists program_exercises (
  id serial primary key,
  program_day_id int not null references program_days(id) on delete cascade,
  exercise_id int not null references exercises(id),
  detail text null,
  sets smallint not null,
  rep_lo smallint not null,
  rep_hi smallint not null,
  rest_sec smallint not null,
  load_tag text not null,
  note text null,
  sort smallint not null
);
create index if not exists program_exercises_day_id_idx on program_exercises (program_day_id);

create table if not exists workouts (
  id serial primary key,
  user_id text not null,
  date date not null,
  program_day_id int null references program_days(id) on delete set null,
  day_name text not null,
  status text not null default 'planned',
  notes text null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);
create index if not exists workouts_user_date_idx on workouts (user_id, date);

create table if not exists workout_exercises (
  id serial primary key,
  workout_id int not null references workouts(id) on delete cascade,
  exercise_id int not null references exercises(id),
  exercise_name text not null,
  detail text null,
  unit text not null default 'kg',
  target_sets smallint not null,
  target_rep_lo smallint not null,
  target_rep_hi smallint not null,
  rest_sec smallint not null,
  load_tag text not null,
  note text null,
  sort smallint not null
);
create index if not exists workout_exercises_workout_id_idx on workout_exercises (workout_id);

create table if not exists workout_sets (
  id serial primary key,
  workout_exercise_id int not null references workout_exercises(id) on delete cascade,
  set_index smallint not null,
  weight numeric(6,2) null,
  reps smallint null,
  rir smallint null,
  completed boolean not null default false
);
create index if not exists workout_sets_we_id_idx on workout_sets (workout_exercise_id);

create table if not exists body_measurements (
  id serial primary key,
  user_id text not null,
  date date not null,
  body_weight numeric(5,2) null,
  waist numeric(5,1) null,
  chest numeric(5,1) null,
  arm numeric(5,1) null,
  thigh numeric(5,1) null,
  unique (user_id, date)
);
create index if not exists body_measurements_user_idx on body_measurements (user_id);

create table if not exists user_onboarding (
  user_id text primary key,
  seeded_at timestamptz not null default now()
);
