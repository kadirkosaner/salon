-- Optional fitness profile details (birth date, sex, height)
alter table user_profiles
  add column if not exists birth_date date;
alter table user_profiles
  add column if not exists sex text
    check (sex is null or sex in ('female', 'male', 'unspecified'));
alter table user_profiles
  add column if not exists height_cm numeric(5, 1);
alter table user_profiles
  add column if not exists details_public boolean not null default false;
