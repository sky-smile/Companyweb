interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: string;
  sameAs?: string[];
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  email,
  telephone,
  address,
  sameAs = [],
}: OrganizationJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo && { logo: { '@type': 'ImageObject', url: logo } }),
    ...(description && { description }),
    ...(email && { email }),
    ...(telephone && { telephone }),
    ...(address && { address: { '@type': 'PostalAddress', streetAddress: address } }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface NewsArticleJsonLdProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  publisher?: string;
}

export function NewsArticleJsonLd({
  headline,
  description,
  datePublished,
  dateModified,
  author = '企业官网',
  image,
  publisher = 'Sky Smile',
}: NewsArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    description,
    datePublished,
    ...(dateModified && { dateModified }),
    author: { '@type': 'Organization', name: author },
    publisher: { '@type': 'Organization', name: publisher },
    ...(image && { image: { '@type': 'ImageObject', url: image } }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  image?: string;
  brand?: string;
}

export function ProductJsonLd({
  name,
  description,
  image,
  brand = 'Sky Smile',
}: ProductJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    ...(brand && { brand: { '@type': 'Brand', name: brand } }),
    ...(image && { image: { '@type': 'ImageObject', url: image } }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbListJsonLdProps {
  items: Array<{
    position: number;
    name: string;
    item: string;
  }>;
}

export function BreadcrumbListJsonLd({ items }: BreadcrumbListJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
