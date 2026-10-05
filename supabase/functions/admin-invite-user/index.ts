import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) => new Response(
  JSON.stringify(body),
  { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Metode tidak didukung." }, 405);

  const authorization = request.headers.get("Authorization");
  const projectUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!authorization || !projectUrl || !anonKey || !serviceRoleKey) {
    return json({ error: "Konfigurasi server atau sesi login tidak tersedia." }, 401);
  }

  const token = authorization.replace(/^Bearer\s+/i, "");
  const callerClient = createClient(projectUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await callerClient.auth.getUser(token);
  if (authError || !authData.user) return json({ error: "Sesi login tidak valid." }, 401);

  let input: { email?: string; full_name?: string; farm_id?: string };
  try { input = await request.json(); }
  catch { return json({ error: "Isi permintaan tidak valid." }, 400); }
  const email = input.email?.trim().toLowerCase();
  const fullName = input.full_name?.trim() || "Staff Farm";
  const farmId = input.farm_id?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !farmId) {
    return json({ error: "Email dan lokasi farm wajib diisi." }, 400);
  }

  const admin = createClient(projectUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: membership, error: membershipError } = await admin
    .from("farm_members")
    .select("role")
    .eq("user_id", authData.user.id)
    .in("role", ["admin_farm", "manajer", "admin_sistem"])
    .limit(1)
    .maybeSingle();
  if (membershipError || !membership) {
    return json({ error: "Hanya admin yang dapat mengundang staff ke lokasi." }, 403);
  }

  const siteUrl = Deno.env.get("APP_SITE_URL");
  const inviteOptions: { data: { full_name: string }; redirectTo?: string } = {
    data: { full_name: fullName },
  };
  if (siteUrl) inviteOptions.redirectTo = siteUrl;
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, inviteOptions);
  if (inviteError || !invited.user) {
    return json({ error: inviteError?.message || "Undangan tidak dapat dibuat." }, 400);
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    user_id: invited.user.id,
    email,
    full_name: fullName,
    updated_at: new Date().toISOString(),
  });
  const { error: staffMembershipError } = profileError ? { error: profileError } : await admin
    .from("farm_members")
    .upsert({ farm_id: farmId, user_id: invited.user.id, role: "petugas" });

  if (profileError || staffMembershipError) {
    await admin.auth.admin.deleteUser(invited.user.id);
    return json({ error: profileError?.message || staffMembershipError?.message || "Akses staff gagal disimpan." }, 500);
  }

  return json({ ok: true, email, full_name: fullName, role: "petugas", farm_id: farmId });
});
