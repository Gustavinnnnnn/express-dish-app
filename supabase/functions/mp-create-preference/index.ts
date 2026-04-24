// Cria uma preferência de pagamento no Mercado Pago a partir de um pedido já gravado.
// Usa o Access Token que o dono salvou em store_settings (mp_access_token).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id obrigatório" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settings } = await supabase.from("store_settings").select("mp_access_token, mp_environment, store_name").limit(1).maybeSingle();
    if (!settings?.mp_access_token) {
      return new Response(JSON.stringify({ error: "Credenciais do Mercado Pago não configuradas no painel" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: order } = await supabase.from("orders").select("*").eq("id", order_id).maybeSingle();
    if (!order) {
      return new Response(JSON.stringify({ error: "Pedido não encontrado" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const items = (order.items || []).map((it: any) => ({
      title: String(it.name || "Item").slice(0, 250),
      quantity: Number(it.qty || 1),
      unit_price: Number(it.unit_price || it.unitPrice || 0),
      currency_id: "BRL",
    }));

    const origin = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/$/, "") || "https://example.com";

    const preferenceBody = {
      items,
      external_reference: order.id,
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mp-webhook`,
      back_urls: {
        success: `${origin}/perfil?pedido=${order.id}&status=ok`,
        failure: `${origin}/carrinho?pedido=${order.id}&status=falha`,
        pending: `${origin}/perfil?pedido=${order.id}&status=pendente`,
      },
      auto_return: "approved",
      statement_descriptor: (settings.store_name || "PEDIDO").slice(0, 22),
      payer: {
        name: order.customer_name || undefined,
        phone: order.customer_phone ? { number: order.customer_phone } : undefined,
      },
      metadata: { order_id: order.id, order_code: order.code },
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.mp_access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceBody),
    });

    const mpData = await mpRes.json();
    if (!mpRes.ok) {
      console.error("MP preference error:", mpData);
      return new Response(JSON.stringify({ error: "Falha ao criar preferência", details: mpData }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await supabase.from("orders").update({ mp_preference_id: mpData.id }).eq("id", order.id);

    const isProd = settings.mp_environment === "production";
    const checkoutUrl = isProd ? mpData.init_point : mpData.sandbox_init_point;

    return new Response(JSON.stringify({ preference_id: mpData.id, checkout_url: checkoutUrl }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("mp-create-preference error:", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});