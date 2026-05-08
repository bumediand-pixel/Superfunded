import { Resend } from 'resend';
import { SKILL_EVAL_DISCLAIMER } from '@/lib/legal';

// Lazy-initialize so build doesn't throw when RESEND_API_KEY is absent
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');
  return _resend;
}
const FROM = 'SuperFunded <noreply@thesuperfunded.com>';

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

export async function sendRetragereCeruta(to: string, suma: number, metoda: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Cerere de retragere de €${suma} primită`,
    html: emailTemplate({
      title: 'Cerere de retragere primită',
      preheader: `€${suma} via ${metoda} — în procesare 24-48h.`,
      body: `
        <p>Am primit cererea ta de retragere de <strong>€${suma}</strong> via <strong>${metoda === 'CRYPTO' ? 'Crypto' : 'Transfer bancar'}</strong>.</p>
        <p>Status curent: <strong>În procesare</strong>. Vei primi un email când fondurile sunt trimise (24-48h în zilele lucrătoare).</p>
      `,
      cta: { label: 'Vezi statusul', url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/retrageri` },
      footer: 'Ai primit acest email pentru că ai solicitat o retragere pe SuperFunded.',
    }),
  });
}

export async function sendAdminWithdrawalAlert(suma: number, metoda: string, userEmail: string) {
  const adminTo = process.env.ADMIN_EMAIL;
  if (!adminTo) return;
  return getResend().emails.send({
    from: FROM,
    to: adminTo,
    subject: `[Retragere] €${suma} via ${metoda} — ${userEmail}`,
    html: emailTemplate({
      title: 'Retragere nouă în așteptare',
      preheader: `${userEmail} solicită €${suma}.`,
      body: `
        <p><strong>Utilizator:</strong> ${userEmail}</p>
        <p><strong>Sumă:</strong> €${suma}</p>
        <p><strong>Metodă:</strong> ${metoda}</p>
        <p>Procesează din panoul admin.</p>
      `,
      cta: { label: 'Deschide admin', url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
      footer: 'Notificare automată pentru echipa SuperFunded.',
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
  const to = process.env.CONTACT_INBOX_EMAIL || 'support@thesuperfunded.com';
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

/**
 * Triggered by the settle-bets cron whenever an account transitions phase
 * (FAZA_1 → FAZA_2, FAZA_2 → FINANTAT, or → RESPINS on max-drawdown breach).
 */
export async function sendPhaseChangeEmail(to: string, opts: {
  plan: string;
  fromPhase: string;
  toPhase: string;
  capital: number;
}) {
  const { plan, fromPhase, toPhase, capital } = opts;
  const isWin = toPhase === 'FAZA_2' || toPhase === 'FINANTAT';
  const subject = isWin
    ? toPhase === 'FINANTAT'
      ? `🎉 Cont FINANȚAT — ${plan}`
      : `Felicitări — ai trecut în FAZA 2 (${plan})`
    : `Cont ${plan} — evaluare oprită`;

  const body = isWin
    ? toPhase === 'FINANTAT'
      ? `<p>Felicitări! Contul tău <strong>${plan}</strong> (€${capital.toLocaleString('ro-RO')}) este oficial <strong>FINANȚAT</strong>.</p>
         <p>De acum poți cere retrageri săptămânal pe profiturile generate. Verifică KYC-ul în dashboard pentru a debloca retragerile.</p>`
      : `<p>Ai trecut cu succes din <strong>${fromPhase}</strong> în <strong>${toPhase}</strong> pe contul ${plan}.</p>
         <p>Țintă următoare: încă 20% profit fără să spargi drawdown-ul de 8%. Mult succes.</p>`
    : `<p>Contul tău <strong>${plan}</strong> a fost oprit din evaluare deoarece a depășit pragul de drawdown.</p>
       <p>Poți reseta contul cu o taxă redusă sau să cumperi un challenge nou.</p>`;

  return getResend().emails.send({
    from: FROM,
    to,
    subject,
    html: emailTemplate({
      title: subject,
      preheader: isWin ? 'Felicitări!' : 'Evaluare oprită — opțiuni de continuare',
      body,
      cta: { label: 'Mergi la Dashboard', url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
      footer: 'Ai primit acest email pentru schimbarea de status pe un cont SuperFunded.',
    }),
  });
}

/**
 * Triggered when a referred user generates a commission for the affiliate.
 */
export async function sendComisionAfiliatEmail(to: string, opts: {
  suma: number;
  procent: number;
  emailReferit?: string;
}) {
  const { suma, procent, emailReferit } = opts;
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `+€${suma.toFixed(2)} comision afiliat`,
    html: emailTemplate({
      title: 'Comision nou pe contul tău de afiliat',
      preheader: `+€${suma.toFixed(2)} (${procent}%) tocmai a intrat.`,
      body: `
        <p>Un picker referit ${emailReferit ? `(${escapeHtml(emailReferit)}) ` : ''}tocmai a cumpărat un challenge.</p>
        <p>Comision generat: <strong>€${suma.toFixed(2)}</strong> (${procent}%). Va fi virat la următoarea plată lunară.</p>
      `,
      cta: { label: 'Vezi statusul', url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/afiliere` },
      footer: 'Ai primit acest email pentru o comision nouă pe contul tău de afiliat.',
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
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thesuperfunded.com';
  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#faf7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a;">
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.06);">

        <!-- Header (red bar) -->
        <tr><td style="padding:24px 32px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
          <table width="100%"><tr>
            <td style="vertical-align:middle;">
              <span style="display:inline-block;width:36px;height:36px;border-radius:8px;background:#e63946;color:#ffffff;font-weight:900;font-size:14px;line-height:36px;text-align:center;letter-spacing:1px;">SF</span>
            </td>
            <td style="vertical-align:middle;padding-left:10px;">
              <span style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:0.04em;">SUPER<span style="color:#e63946;">FUNDED</span></span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 32px;">
          <h1 style="margin:0 0 20px 0;font-size:28px;font-weight:800;color:#0f172a;line-height:1.2;">${title}</h1>
          <div style="font-size:15px;line-height:1.7;color:#475569;">
            ${body}
          </div>
          <div style="margin-top:32px;">
            <a href="${cta.url}"
              style="display:inline-block;background:#e63946;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:999px;box-shadow:0 6px 18px rgba(230,57,70,0.28);">
              ${cta.label}
            </a>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 32px;background:#fbf8f6;border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 6px 0;font-size:12px;line-height:1.6;color:#64748b;">${footer}</p>
          <p style="margin:0 0 12px 0;font-size:11px;line-height:1.6;color:#94a3b8;font-style:italic;">${SKILL_EVAL_DISCLAIMER.email_footer}</p>
          <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} SuperFunded SRL · România ·
            <a href="${SITE}/confidentialitate" style="color:#e63946;text-decoration:none;font-weight:600;">Confidențialitate</a> ·
            <a href="${SITE}/contact" style="color:#e63946;text-decoration:none;font-weight:600;">Contact</a>
          </p>
        </td></tr>

      </table>

      <p style="margin:16px 0 0 0;font-size:11px;color:#94a3b8;">
        Joc responsabil — <a href="https://www.jocresponsabil.ro" style="color:#94a3b8;">jocresponsabil.ro</a> · 18+
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}
