import { Resend } from 'resend';

// Lazy-initialize so build doesn't throw when RESEND_API_KEY is absent
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');
  return _resend;
}
const FROM = 'SuperFunded <noreply@superfunded.ro>';

export async function sendWelcomeEmail(to: string, numeComplet?: string) {
  const name = numeComplet ?? to.split('@')[0];
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Bun venit la SuperFunded!',
    html: emailTemplate({
      title: 'Bun venit la SuperFunded',
      preheader: 'Contul tău a fost creat cu succes.',
      body: `
        <p>Salut <strong>${name}</strong>,</p>
        <p>Contul tău SuperFunded a fost creat cu succes. Ești acum la un pas de a-ți demonstra abilitățile de betting.</p>
        <p>Alege un plan de evaluare și începe provocarea:</p>
      `,
      cta: { label: 'Alege planul tău', url: `${process.env.NEXT_PUBLIC_SITE_URL}/planuri` },
      footer: 'Ai primit acest email deoarece ți-ai creat un cont pe SuperFunded.',
    }),
  });
}

export async function sendPlanActivatEmail(to: string, plan: string, capital: number) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Planul tău ${plan} a fost activat!`,
    html: emailTemplate({
      title: 'Plan activat cu succes',
      preheader: `Capitalul tău de €${capital.toLocaleString('ro-RO')} este gata.`,
      body: `
        <p>Planul <strong>${plan}</strong> cu un capital de <strong>€${capital.toLocaleString('ro-RO')}</strong> a fost activat.</p>
        <p>Poți începe să plasezi pariuri pe contul tău de evaluare acum. Toate regulile se aplică din prima zi.</p>
      `,
      cta: { label: 'Mergi la Dashboard', url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
      footer: 'Ai primit acest email deoarece ai activat un plan pe SuperFunded.',
    }),
  });
}

export async function sendRetragereStatusEmail(to: string, suma: number, status: 'APROBAT' | 'RESPINS') {
  const aprobat = status === 'APROBAT';
  return getResend().emails.send({
    from: FROM,
    to,
    subject: aprobat ? `Retragere de €${suma} aprobată` : `Retragere de €${suma} respinsă`,
    html: emailTemplate({
      title: aprobat ? 'Retragere aprobată' : 'Retragere respinsă',
      preheader: aprobat ? `€${suma} sunt în drum spre tine.` : 'Contactează suportul pentru detalii.',
      body: aprobat
        ? `<p>Retragerea ta de <strong>€${suma}</strong> a fost aprobată și va fi procesată în 1–3 zile lucrătoare.</p>`
        : `<p>Retragerea ta de <strong>€${suma}</strong> a fost respinsă. Te rugăm să contactezi echipa de suport pentru mai multe detalii.</p>`,
      cta: { label: 'Vezi statusul', url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/retrageri` },
      footer: 'Ai primit acest email deoarece ai solicitat o retragere pe SuperFunded.',
    }),
  });
}

export async function sendKYCStatusEmail(to: string, status: 'APROBAT' | 'RESPINS') {
  const aprobat = status === 'APROBAT';
  return getResend().emails.send({
    from: FROM,
    to,
    subject: aprobat ? 'Verificare identitate aprobată ✓' : 'Verificare identitate — acțiune necesară',
    html: emailTemplate({
      title: aprobat ? 'KYC aprobat' : 'KYC respins',
      preheader: aprobat ? 'Poți acum să retragi profiturile.' : 'Documentele necesită reverificare.',
      body: aprobat
        ? `<p>Verificarea ta de identitate a fost <strong>aprobată</strong>. Acum poți solicita retrageri din profiturile tale.</p>`
        : `<p>Din păcate, verificarea ta de identitate a fost <strong>respinsă</strong>. Te rugăm să relectualizezi documentele și să reîncerci.</p>`,
      cta: { label: aprobat ? 'Solicită retragere' : 'Reîncearcă KYC', url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/kyc` },
      footer: 'Ai primit acest email deoarece ai trecut prin procesul KYC pe SuperFunded.',
    }),
  });
}

export async function sendContactInquiry(opts: {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
  category?: string;
}) {
  const to = process.env.CONTACT_INBOX_EMAIL || 'support@superfunded.ro';
  return getResend().emails.send({
    from: FROM,
    to,
    replyTo: opts.fromEmail,
    subject: `[Contact${opts.category ? ` · ${opts.category}` : ''}] ${opts.subject}`,
    html: emailTemplate({
      title: 'Mesaj nou de contact',
      preheader: `${opts.fromName} <${opts.fromEmail}>`,
      body: `
        <p><strong>De la:</strong> ${escapeHtml(opts.fromName)} &lt;${escapeHtml(opts.fromEmail)}&gt;</p>
        ${opts.category ? `<p><strong>Categorie:</strong> ${escapeHtml(opts.category)}</p>` : ''}
        <p><strong>Subiect:</strong> ${escapeHtml(opts.subject)}</p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0;" />
        <p style="white-space:pre-wrap;">${escapeHtml(opts.message)}</p>
      `,
      cta: { label: 'Răspunde direct', url: `mailto:${opts.fromEmail}` },
      footer: 'Mesaj trimis prin formularul de contact SuperFunded.',
    }),
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Template ────────────────────────────────────────────────────────────────

function emailTemplate({ title, preheader, body, cta, footer }: {
  title: string;
  preheader: string;
  body: string;
  cta: { label: string; url: string };
  footer: string;
}) {
  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#060606;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <!-- Preheader (hidden preview text) -->
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060606;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:0 0 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:20px 32px;background:#0e0e0e;border-bottom:1px solid rgba(230,57,70,0.2);">
                <span style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:0.12em;text-transform:uppercase;">SUPER<span style="color:#e63946;">FUNDED</span></span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#111111;border:1px solid rgba(255,255,255,0.06);padding:40px 32px;">
          <h1 style="margin:0 0 24px 0;font-size:28px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.04em;">${title}</h1>
          <div style="font-size:15px;line-height:1.7;color:rgba(255,255,255,0.65);">
            ${body}
          </div>
          <div style="margin-top:32px;">
            <a href="${cta.url}"
              style="display:inline-block;background:#e63946;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;padding:14px 32px;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);">
              ${cta.label}
            </a>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 32px;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;border-top:1px solid rgba(255,255,255,0.04);">
          <p style="margin:0 0 8px 0;">${footer}</p>
          <p style="margin:0;">© ${new Date().getFullYear()} SuperFunded SRL · România ·
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/confidentialitate" style="color:rgba(255,255,255,0.3);text-decoration:none;">Confidențialitate</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
