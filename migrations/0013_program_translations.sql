-- Catalog program + exercise copy translations (user content is not translated)
create table if not exists program_translations (
  program_id integer not null references programs(id) on delete cascade,
  locale text not null,
  name text not null,
  description text,
  primary key (program_id, locale)
);

create table if not exists exercise_translations (
  exercise_id integer not null,
  locale text not null,
  form_cues text,
  note text,
  primary key (exercise_id, locale)
);

create index if not exists program_translations_locale_idx
  on program_translations (locale);

create index if not exists exercise_translations_locale_idx
  on exercise_translations (locale);
