-- Visual identity: theme + accent on user profiles
alter table user_profiles
  add column if not exists theme text not null default 'obsidian';

alter table user_profiles
  add column if not exists accent text not null default 'pirinc';

-- Drop loose checks if re-run; add constrained values
do $$
begin
  alter table user_profiles drop constraint if exists user_profiles_theme_check;
  alter table user_profiles drop constraint if exists user_profiles_accent_check;
exception when undefined_object then null;
end $$;

alter table user_profiles
  add constraint user_profiles_theme_check
  check (theme in ('obsidian', 'carbon'));

alter table user_profiles
  add constraint user_profiles_accent_check
  check (accent in (
    'pirinc', 'bakir', 'kemik',
    'volt', 'ates', 'buz', 'neon', 'kehribar', 'beyaz', 'ufuk'
  ));
