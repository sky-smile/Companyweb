'use client';

import { LazyImage } from './LazyImage';

interface NewsCardImageProps {
  src: string;
  alt: string;
  loading?: 'eager' | 'lazy';
  sizes?: string;
}

export function NewsCardImage({ src, alt, loading = 'lazy' }: NewsCardImageProps) {
  // Use native img for eager loading, LazyImage for lazy loading
  if (loading === 'eager') {
    return (
      <img
        src={src}
        alt={alt}
        className="news-image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          target.parentElement?.classList.add('news-image-error');
        }}
      />
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
