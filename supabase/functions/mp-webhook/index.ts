// Webhook do Mercado Pago — recebe notificação de pagamento, consulta o status
// e marca o pedido como pago/falhou.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature, x-request-id",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    let topic = url.searchParams.get("type") || url.searchParams.get("topic");
    let paymentId = url.searchParams.get("data.id") || url.searchParams.get("id");

    if (req.method === "POST") {
      try {
        const body = await req.json();
        topic = topic || body?.type || body?.topic;
        paymentId = paymentId || body?.data?.id || body?.id;
      } catch { /* corpo pode ser vazio em alguns testes */ }
    }

    if (topic !== "payment" || !paymentId) {
      return new Response(JSON.stringify({ ok: true, ignored: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settings } = await supabase.from("store_settings").select("mp_access_token").limit(1).maybeSingle();
    if (!settings?.mp_access_token) {
      console.error("MP access token ausente");
      return new Response(JSON.stringify({ error: "no token" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${settings.mp_access_token}` },
    });
    const payment = await payRes.json();
    if (!payRes.ok) {
      console.error("Falha consultando pagamento:", payment);
      return new Response(JSON.stringify({ error: "mp lookup failed" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const orderId = payment?.external_reference || payment?.metadata?.order_id;
    if (!orderId) {
      return new Response(JSON.stringify({ ok: true, no_ref: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const status = payment.status; // approved | pending | rejected | in_process | cancelled | refunded
    const paymentStatus =
      status === "approved" ? "pago"
      : status === "rejected" || status === "cancelled" ? "falhou"
      : status === "refunded" ? "estornado"
      : "pendente";

    const update: Record<string, unknown> = {
      payment_status: paymentStatus,
      mp_payment_id: String(paymentId),
    };
    // Quando pago, sai automaticamente para preparo
    if (paymentStatus === "pago") update.status = "preparo";

    await supabase.from("orders").update(update).eq("id", orderId);

    return new Response(JSON.stringify({ ok: true, status: paymentStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("mp-webhook error:", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});