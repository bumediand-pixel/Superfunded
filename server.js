'use strict';

require('dotenv').config();
const express = require('express');
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors    = require('cors');
const path    = require('path');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

// Raw body required for Stripe webhook signature verification
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

const PLANS = {
  '10k':  { name: '$10K Challenge',  amount: 9900,  label: '$10,000 Funded Account',  profit: '80%' },
  '25k':  { name: '$25K Challenge',  amount: 19900, label: '$25,000 Funded Account',  profit: '85%' },
  '50k':  { name: '$50K Challenge',  amount: 29900, label: '$50,000 Funded Account',  profit: '90%' },
  '100k': { name: '$100K Challenge', amount: 49900, label: '$100,000 Funded Account', profit: '90%' },
  '200k': { name: '$200K Challenge', amount: 79900, label: '$200,000 Funded Account', profit: '90%' },
};

// Return plan list (used by checkout page to populate UI)
app.get('/api/plans', (_req, res) => res.json(PLANS));

// Create a Stripe Checkout Session and return its URL
app.post('/api/create-checkout-session', async (req, res) => {
  const { planId, email } = req.body;
  const plan = PLANS[planId];
  if (!plan) return res.status(400).json({ error: 'Invalid plan ID' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: plan.name, description: plan.label },
          unit_amount: plan.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/checkout.html?success=true&plan=${planId}`,
      cancel_url:  `${process.env.DOMAIN}/checkout.html?canceled=true&plan=${planId}`,
      metadata: { planId },
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook — called by Stripe after events (payment success, refund, etc.)
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { planId } = session.metadata;
    console.log(`✅ Payment complete — ${session.customer_email} — ${planId}`);
    // TODO: provision funded account, trigger KYC email, update database
  }

  if (event.type === 'payment_intent.payment_failed') {
    console.log('❌ Payment failed:', event.data.object.id);
  }

  res.json({ received: true });
});

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SuperFunded server → http://localhost:${PORT}`);
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  STRIPE_SECRET_KEY not set — payments will not work');
  }
});
