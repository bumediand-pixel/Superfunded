'use client';
/**
 * /dashboard/retrageri — request withdrawal.
 * Metode: transfer bancar (IBAN + nume titular) sau crypto (wallet + rețea).
 * Datele suplimentare sunt trimise ca `detaliiPlata` la /api/retrageri.
 */
import { useState } from 'react';
import Link from 'next/link';

type Metoda = 'TRANSFER_BANCAR' | 'CRYPTO';
type CryptoNet = 'USDT-TRC20' | 'USDT-ERC20' | 'BTC' | 'ETH';

export default function RetrageriPage() {
  const [suma, setSuma] = useState('');
  const [metoda, setMetoda] = useState<Metoda>('TRANSFER_BANCAR');

  // Bank
  const [iban, setIban] = useState('');
  const [titular, setTitular] = useState('');

  // Crypto
  const [wallet, setWallet] = useState('');
  const [network, setNetwork] = useState<CryptoNet>('USDT-TRC20');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleRetragere = async (e: React.FormEvent) => {
    e.preventDefault();

    const detaliiPlata = metoda === 'CRYPTO'
      ? { wallet: wallet.trim(), network, currency: network.split('-')[0] }
      : { iban: iban.trim().toUpperCase().replace(/\s+/g, ''), titular: titular.trim() };

    if (metoda === 'CRYPTO' && !detaliiPlata.wallet) {
      setMsg('Eroare: introdu adresa wallet-ului');
      return;
    }
    if (metoda === 'TRANSFER_BANCAR' && (!detaliiPlata.iban || !detaliiPlata.titular)) {
      setMsg('Eroare: introdu IBAN-ul și numele titularului');
      return;
    }

    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/retrageri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suma: parseFloat(suma), metoda, detaliiPlata }),
      });
      const data = await res.json();
      if (data.error) setMsg(`Eroare: ${data.error}`);
      else {
        setMsg('Cerere trimisă! Procesare 24-48h. Vei primi email când e plătită.');
        setSuma(''); setWallet(''); setIban(''); setTitular('');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors";

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24" style={{ background: 'var(--dash-bg)', minHeight: '100vh' }}>
      <div className="max-w-3xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--dash-text)' }}>Retrageri</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--dash-text-muted)' }}>Retrage-ți profitul săptămânal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <div className="rounded-2xl p-5 sm:p-6"
            style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
            <h2 className="font-black text-lg mb-5" style={{ color: 'var(--dash-text)' }}>Cerere retragere</h2>
            <form onSubmit={handleRetragere} className="space-y-4">
              {msg && (
                <div className={`rounded-xl p-3 text-sm ${msg.startsWith('Eroare')
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                  : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
                  {msg}
                </div>
              )}

              <div>
                <label className="text-sm mb-1.5 block" style={{ color: 'var(--dash-text-muted)' }}>Sumă (€)</label>
                <input type="number" min="50" step="0.01" value={suma} onChange={e => setSuma(e.target.value)} required
                  className={inputStyle} placeholder="Ex: 500" />
              </div>

              <div>
                <label className="text-sm mb-1.5 block" style={{ color: 'var(--dash-text-muted)' }}>Metodă</label>
                <select value={metoda} onChange={e => setMetoda(e.target.value as Metoda)} className={inputStyle}>
                  <option value="TRANSFER_BANCAR">Transfer bancar (SEPA / SWIFT)</option>
                  <option value="CRYPTO">Crypto (USDT, BTC, ETH)</option>
                </select>
              </div>

              {metoda === 'TRANSFER_BANCAR' && (
                <>
                  <div>
                    <label className="text-sm mb-1.5 block" style={{ color: 'var(--dash-text-muted)' }}>IBAN</label>
                    <input type="text" value={iban} onChange={e => setIban(e.target.value)} required
                      className={inputStyle} placeholder="RO49 AAAA 1B31 0075 9384 0000" autoComplete="off" />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block" style={{ color: 'var(--dash-text-muted)' }}>Nume titular</label>
                    <input type="text" value={titular} onChange={e => setTitular(e.target.value)} required
                      className={inputStyle} placeholder="Cum apare pe cont" autoComplete="off" />
                  </div>
                </>
              )}

              {metoda === 'CRYPTO' && (
                <>
                  <div>
                    <label className="text-sm mb-1.5 block" style={{ color: 'var(--dash-text-muted)' }}>Rețea</label>
                    <select value={network} onChange={e => setNetwork(e.target.value as CryptoNet)} className={inputStyle}>
                      <option value="USDT-TRC20">USDT pe TRON (TRC-20) · fee minim</option>
                      <option value="USDT-ERC20">USDT pe Ethereum (ERC-20) · fee mare</option>
                      <option value="BTC">Bitcoin (BTC) · rețea Bitcoin</option>
                      <option value="ETH">Ethereum (ETH) · rețea ETH</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block" style={{ color: 'var(--dash-text-muted)' }}>
                      Adresă wallet
                    </label>
                    <input type="text" value={wallet} onChange={e => setWallet(e.target.value)} required
                      className={inputStyle}
                      placeholder={network === 'USDT-TRC20' ? 'TR7Nh…' : network === 'BTC' ? 'bc1q…' : '0x…'}
                      autoComplete="off" spellCheck={false} />
                    <p className="text-[11px] mt-1.5" style={{ color: 'var(--dash-text-subtle)' }}>
                      ⚠️ Verifică atent — fondurile trimise pe o adresă greșită nu pot fi recuperate.
                    </p>
                  </div>
                </>
              )}

              <button type="submit" disabled={loading}
                className="w-full text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                style={{ background: 'var(--red, #e63946)' }}>
                {loading ? 'Se procesează…' : 'Solicită retragerea'}
              </button>
            </form>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { icon: '⏱', title: 'Procesare 24-48h', desc: 'Cererile de luni–vineri sunt procesate în aceeași zi lucrătoare.' },
              { icon: '💰', title: 'Minimum €50', desc: 'Suma minimă per retragere este de €50.' },
              { icon: '🔄', title: 'Prima retragere = rambursare taxă', desc: 'Prima retragere include automat taxa de evaluare plătită.' },
              { icon: '₿', title: 'Crypto: fără cont bancar', desc: 'USDT TRC-20 ajunge în 5-10 minute, fee de rețea minim.' },
            ].map(item => (
              <div key={item.title} className="rounded-2xl p-4 sm:p-5 flex gap-4"
                style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <div className="font-bold text-sm mb-1" style={{ color: 'var(--dash-text)' }}>{item.title}</div>
                  <div className="text-xs" style={{ color: 'var(--dash-text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
              <p className="text-yellow-400 text-xs">
                KYC obligatoriu pentru prima retragere.{' '}
                <Link href="/dashboard/kyc" className="underline font-bold">Verifică identitatea →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
