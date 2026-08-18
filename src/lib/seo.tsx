import type { Metadata } from 'next';

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://thesuperfunded.com';
export const BRAND = 'TheSuperFunded';

type Args = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
};

export function pageMetadata({ title, description, path, ogImage, keywords }: Args): Metadata {
  const url = `${SITE}${path}`;
  const image = ogImage ?? `${SITE}/logo.svg`;
  const fullTitle = path === '/' ? title : `${title} | ${BRAND}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: BRAND,
      locale: 'ro_RO',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: BRAND }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}#org`,
    name: BRAND,
    url: SITE,
    logo: `${SITE}/logo.svg`,
    sameAs: ['https://discord.gg/superfunded'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@thesuperfunded.com',
      contactType: 'customer support',
      availableLanguage: ['Romanian', 'English'],
    },
  } as const;
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
    url: SITE,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  } as const;
}

export function productJsonLd(args: {
  id: string;
  name: string;
  price: number;
  capital: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE}/planuri#${args.id}`,
    name: `${BRAND} — ${args.name}`,
    description: `Cont de evaluare ${args.name} cu €${args.capital.toLocaleString('ro-RO')} bankroll pentru pick-uri sportive simulate.`,
    brand: { '@type': 'Brand', name: BRAND },
    offers: {
      '@type': 'Offer',
      url: `${SITE}/planuri`,
      priceCurrency: 'EUR',
      price: args.price,
      availability: 'https://schema.org/InStock',
    },
  } as const;
}

export function breadcrumbsJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  } as const;
}

export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
