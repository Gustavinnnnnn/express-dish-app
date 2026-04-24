// Testa as credenciais do Mercado Pago salvas em store_settings.
// Modos:
//   { mode: "verify" } -> só valida o token chamando /users/me
//   { mode: "preference" } -> cria uma preferência fake de R$1 e devolve o link sandbox
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { mode = "verify" } = await req.json().catch(() => ({}));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settings } = await supabase
      .from("store_settings")
      .select("mp_access_token, mp_environment, store_name")
      .limit(1)
      .maybeSingle();

    if (!settings?.mp_access_token) {
      return json({ ok: false, error: "Access Token não configurado" }, 400);
    }

    const token = settings.mp_access_token as string;
    const isProd = settings.mp_environment === "production";

    if (mode === "verify") {
      const r = await fetch("https://api.mercadopago.com/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      if (!r.ok) return json({ ok: false, error: data?.message || "Token inválido", details: data }, 400);
      return json({
        ok: true,
        user_id: data.id,
        nickname: data.nickname,
        email: data.email,
        site: data.site_id,
        environment: isProd ? "production" : "sandbox",
        token_type: token.startsWith("APP_USR-") ? "produção" : token.startsWith("TEST-") ? "teste" : "desconhecido",
      });
    }

    if (mode === "preference") {
      const origin =
        req.headers.get("origin") || req.headers.get("referer")?.replace(/\/$/, "") || "https://example.com";

      const body = {
        items: [
          {
            title: `Teste ${settings.store_name || "Loja"} (R$1)`,
            quantity: 1,
            unit_price: 1.0,
            currency_id: "BRL",
          },
        ],
        external_reference: `test-${Date.now()}`,
        back_urls: {
          success: `${origin}/perfil?teste=ok`,
          failure: `${origin}/carrinho?teste=falha`,
          pending: `${origin}/perfil?teste=pendente`,
        },
        statement_descriptor: (settings.store_name || "TESTE").slice(0, 22),
      };

      const r = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) return json({ ok: false, error: data?.message || "Falha ao criar preferência", details: data }, 502);
      const url = isProd ? data.init_point : data.sandbox_init_point;
      return json({ ok: true, preference_id: data.id, checkout_url: url });
    }

    return json({ ok: false, error: "Modo desconhecido" }, 400);
  } catch (e) {
    console.error("mp-test error:", e);
    return json({ ok: false, error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
