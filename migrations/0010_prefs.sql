-- Preferences: haptic + notifications on user_settings
alter table user_settings
  add column if not exists haptic_enabled boolean not null default true;
alter table user_settings
  add column if not exists notifications_enabled boolean not null default true;
