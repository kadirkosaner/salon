-- Sharing, program descriptions, exercise form cues / preview keys.

alter table programs add column if not exists description text null;
alter table programs add column if not exists is_public boolean not null default false;
alter table programs add column if not exists share_code text null;
alter table programs add column if not exists tags text null;
alter table programs add column if not exists clone_count int not null default 0;
alter table programs add column if not exists source_program_id int null;

create unique index if not exists programs_share_code_uidx
  on programs (share_code) where share_code is not null;

create index if not exists programs_public_idx
  on programs (is_public) where is_public = true;

alter table exercises add column if not exists form_cues text null;
alter table exercises add column if not exists preview_key text null;
