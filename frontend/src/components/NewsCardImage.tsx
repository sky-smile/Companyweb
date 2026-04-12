'use client';

import Image from 'next/image';

interface NewsCardImageProps {
  src: string;
  alt: string;
  loading?: 'eager' | 'lazy';
  sizes?: string;
}

export function NewsCardImage({ src, alt, loading = 'lazy', sizes }: NewsCardImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="news-image"
      loading={loading}
      sizes={sizes}
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = 'none';
        target.parentElement?.classList.add('news-image-error');
      }}
    />
  );
}
