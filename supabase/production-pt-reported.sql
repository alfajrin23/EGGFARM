-- Preserve the PT notation reported with daily production without assigning
-- an unconfirmed meaning to values such as "12+1/180kg".
-- Safe to rerun; existing report notes are backfilled when possible.
alter table public.daily_reports
  add column if not exists pt_reported text;

update public.daily_reports
set pt_reported = btrim(substring(note from '(?i)(?:^|[^[:alnum:]])pt[.]?[[:space:]]*([[:digit:]][^;[:cntrl:]]*)'))
where pt_reported is null
  and note ~* '(^|[^[:alnum:]])pt[.]?[[:space:]]*[[:digit:]]+';
