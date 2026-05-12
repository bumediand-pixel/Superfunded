/**
 * NOWPayments client — crypto deposit gateway pentru cumpărarea challenge-urilor.
 * Fee ~0.5% pe NOWPayments, plătit de noi. User-ul vede prețul în EUR și plătește
 * în USDT/BTC/ETH/etc. — NOWPayments convertește automat la cursul pieței.
 *
 * Env required:
 *   NOWPAYMENTS_API_KEY      — din dashboard NOWPayments → API
 *   NOWPAYMENTS_IPN_SECRET   — pentru verificarea webhook-ului (signature HMAC SHA512)
 *   NEXT_PUBLIC_SITE_URL     — folosit pentru success/cancel redirects
 *
 * Docs: https://documenter.getpostman.com/view/7907941/2s93JusNJt
 */

const BASE = 'https://api.nowpayments.io/v1';
const SANDBOX_BASE = 'https://api-sandbox.nowpayments.io/v1';

export type NowPaymentInvoice = {
  id: string;
  invoice_url: string;        // hosted payment page user is redirected to
  order_id: string;           // our internal order id (we set this)
  price_amount: number;       // EUR amount we set
  price_currency: string;     // 'eur'
  pay_currency: string | null; // user picks at checkout (USDT, BTC, ETH, ...)
  created_at: string;
};

function base(): string {
  return process.env.NOWPAYMENTS_SANDBOX === 'true' ? SANDBOX_BASE : BASE;
}

function apiKey(): string {
  const key = process.env.NOWPAYMENTS_API_KEY;
  if (!key) throw new Error('NOWPAYMENTS_API_KEY missing — add it in Vercel env to enable crypto payments.');
  return key;
}

/**
 * Create a hosted invoice on NOWPayments. Returns the URL we redirect the user to.
 *
 * `orderId` should encode whatever we need to reconcile the payment on our side
 * (we put `${userId}:${plan}:${mode}` so the webhook can provision the same
 * ContTrader Stripe does).
 */
export async function createInvoice(opts: {
  orderId: string;
  priceAmount: number;       // EUR
  description: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}): Promise<NowPaymentInvoice> {
  const res = await fetch(`${base()}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_amount: opts.priceAmount,
      price_currency: 'eur',
      order_id: opts.orderId,
      order_description: opts.description,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/crypto/webhook`,
      success_url: opts.successUrl,
      cancel_url: opts.cancelUrl,
      is_fee_paid_by_user: false,
      // We allow any crypto NOWPayments supports — user picks at checkout.
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`NOWPayments invoice failed (${res.status}): ${body.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Verify the IPN signature NOWPayments sends with each callback.
 * They sign the raw JSON body sorted alphabetically with HMAC-SHA-512
 * using NOWPAYMENTS_IPN_SECRET. Returns true if valid.
 */
export async function verifyIpnSignature(rawBody: string, signature: string): Promise<boolean> {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret) {
    console.warn('[nowpayments] NOWPAYMENTS_IPN_SECRET missing — rejecting IPN.');
    return false;
  }

  // NOWPayments sorts JSON keys alphabetically before signing.
  let sortedJson: string;
  try {
    const parsed = JSON.parse(rawBody);
    sortedJson = JSON.stringify(parsed, Object.keys(parsed).sort());
  } catch {
    return false;
  }

  const { createHmac } = await import('node:crypto');
  const expected = createHmac('sha512', secret).update(sortedJson).digest('hex');
  return expected === signature;
}
