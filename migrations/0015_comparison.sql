-- Social comparison: opt-in + indexes for exercise benchmarks
alter table user_profiles
  add column if not exists comparison_opt_in boolean not null default true;

-- Bench lookups: last 90d completed sets by exercise
create index if not exists workout_exercises_exercise_id_idx
  on workout_exercises (exercise_id);

create index if not exists workouts_user_status_date_idx
  on workouts (user_id, status, date desc);

create index if not exists workout_sets_we_completed_weight_idx
  on workout_sets (workout_exercise_id)
  where completed = true;
