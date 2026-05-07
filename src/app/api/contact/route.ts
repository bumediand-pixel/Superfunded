import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimiter';
import { sendContactInquiry } from '@/lib/email';

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Nume prea scurt').max(80),
  email: z.string().trim().email('Email invalid').max(120),
  category: z.enum(['support', 'affiliates', 'partnerships', 'general']).default('general'),
  subject: z.string().trim().min(3, 'Subiect prea scurt').max(120),
  message: z.string().trim().min(10, 'Mesaj prea scurt').max(4000),
  // honeypot — bots fill this; humans don't see it
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Prea multe încercări. Reîncearcă peste o oră.' }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Payload invalid' }, { status: 400 }); }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 });
  }

  // Silently drop honeypot hits — pretend success to bot, do nothing
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendContactInquiry({
      fromName: parsed.data.name,
      fromEmail: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      category: parsed.data.category,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] send failed:', err);
    return NextResponse.json({ error: 'Trimiterea a eșuat. Reîncearcă mai târziu.' }, { status: 500 });
  }
}
