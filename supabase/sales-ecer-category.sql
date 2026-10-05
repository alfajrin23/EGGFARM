-- Add the retail/loose egg sales category and link its default stock balance.
-- Run in Supabase SQL Editor; safe to rerun.
-- Default Ecer -> SU is an editable starting assumption. Admins can change it
-- from Stok & Penjualan if loose sales should reduce a different stock class.
insert into public.farm_stock_rules
  (farm_id, sale_category, stock_category, kg_per_peti, conversion_confirmed)
select f.id, 'Telur ecer', 'SU',
       case when f.code = 'CKL' then 15::numeric else null end,
       false
from public.farms f
on conflict (farm_id, sale_category) do nothing;
