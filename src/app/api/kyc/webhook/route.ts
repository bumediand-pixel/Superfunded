import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendKYCStatusEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Parse before signature check so we can return 400 on malformed JSON
  let payload: { type?: string; reviewResult?: { reviewAnswer?: string }; applicantId?: string };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'JSON invalid' }, { status: 400 });
  }

  const sig = req.headers.get('x-payload-digest') ?? '';
  const expected = crypto
    .createHmac('sha256', process.env.SUMSUB_SECRET_KEY!)
    .update(body)
    .digest('hex');
  const sigBuf = Buffer.from(sig, 'hex');
  const expBuf = Buffer.from(expected, 'hex');
  const sigValid = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
  if (!sigValid) {
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 401 });
  }

  if (payload.type === 'applicantReviewed' && payload.applicantId) {
    const status: 'APROBAT' | 'RESPINS' = payload.reviewResult?.reviewAnswer === 'GREEN' ? 'APROBAT' : 'RESPINS';
    await prisma.utilizator.updateMany({
      where: { sumsubApplicantId: payload.applicantId },
      data: { statusKYC: status },
    });
    const utilizator = await prisma.utilizator.findFirst({ where: { sumsubApplicantId: payload.applicantId } });
    if (utilizator?.email) {
      await sendKYCStatusEmail(utilizator.email, status).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
