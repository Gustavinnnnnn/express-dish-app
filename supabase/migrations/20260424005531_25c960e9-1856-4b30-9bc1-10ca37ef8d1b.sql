-- store_settings: payment mode + MP credentials
ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS payment_mode text NOT NULL DEFAULT 'whatsapp',
  ADD COLUMN IF NOT EXISTS mp_access_token text,
  ADD COLUMN IF NOT EXISTS mp_public_key text,
  ADD COLUMN IF NOT EXISTS mp_environment text NOT NULL DEFAULT 'sandbox';

-- orders: payment fields + delivery address
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS mp_preference_id text,
  ADD COLUMN IF NOT EXISTS mp_payment_id text,
  ADD COLUMN IF NOT EXISTS customer_address text,
  ADD COLUMN IF NOT EXISTS estimated_minutes integer DEFAULT 40;

CREATE INDEX IF NOT EXISTS idx_orders_mp_preference ON public.orders(mp_preference_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);

-- Realtime para pedidos
ALTER TABLE public.orders REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;