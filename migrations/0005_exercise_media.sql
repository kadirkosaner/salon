alter table exercises add column if not exists external_id text null;
alter table exercises add column if not exists gif_url text null;
alter table exercises add column if not exists image_url text null;
alter table exercises add column if not exists form_cues text null;
create index if not exists exercises_external_id_idx on exercises (external_id);
