-- Structure the PT packaging note while retaining its original text.
-- Example: 12+1/180kg means 12 full crates, 1 partial crate, and 180 kg
-- as reported. The partial crate is not converted to kg automatically.
-- Safe to rerun; existing raw notes are preserved.

alter table public.daily_reports
  add column if not exists pt_full_crates integer check (pt_full_crates is null or pt_full_crates >= 0),
  add column if not exists pt_partial_crates integer check (pt_partial_crates is null or pt_partial_crates >= 0),
  add column if not exists pt_reported_kg numeric(14,3) check (pt_reported_kg is null or pt_reported_kg >= 0);

-- Populate structured fields from A/Ckg or A+B/Ckg notes. A missing B means
-- no partial crate; B is the partial-crate count per the farm confirmation.
with parsed as (
  select id,
         regexp_match(pt_reported, '([0-9]+)[[:space:]]*(\+[[:space:]]*([0-9]+))?[[:space:]]*/[[:space:]]*([0-9]+([.,][0-9]+)?)[[:space:]]*kg', 'i') as parts
  from public.daily_reports
  where pt_reported is not null
)
update public.daily_reports as report
set pt_full_crates = coalesce(report.pt_full_crates, parsed.parts[1]::integer),
    pt_partial_crates = coalesce(report.pt_partial_crates, coalesce(parsed.parts[3]::integer, 0)),
    pt_reported_kg = coalesce(report.pt_reported_kg, replace(parsed.parts[4], ',', '.')::numeric)
from parsed
where report.id = parsed.id
  and parsed.parts is not null
  and (report.pt_full_crates is null or report.pt_partial_crates is null or report.pt_reported_kg is null);
