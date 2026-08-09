-- One-time onboarding gate (null = must complete / skip)
alter table user_profiles
  add column if not exists onboarded_at timestamptz;

-- Existing accounts already past signup — do not force them through onboarding
update user_profiles
set onboarded_at = coalesce(created_at, now())
where onboarded_at is null;
