'use client';

import Image from 'next/image';
import { LazyImage } from './LazyImage';

interface NewsCardImageProps {
  src: string;
  alt: string;
  loading?: 'eager' | 'lazy';
  sizes?: string;
}

export function NewsCardImage({ src, alt, loading = 'lazy' }: NewsCardImageProps) {
  if (loading === 'eager') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement?.classList.add('news-image-error');
          }}
        />
      </div>
    );
  }

  return (
    <LazyImage
      src={src}
      alt={alt}
      height={180}
      borderRadius={0}
    />
  );
}
