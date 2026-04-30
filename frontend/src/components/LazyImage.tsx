'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
  borderRadius?: number;
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  width,
  height = 220,
  className,
  style,
  threshold = 0.1,
  borderRadius = 20,
  priority = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, priority]);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        position: 'relative',
        width: width || '100%',
        height,
        overflow: 'hidden',
        borderRadius,
        background: 'var(--line)',
        ...style,
      }}
    >
      {!isLoaded && (
        <div
          className="lazy-image-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, var(--line) 25%, rgba(255,248,241,0.6) 50%, var(--line) 75%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface)',
            color: 'rgba(29, 20, 15, 0.4)',
            fontSize: 14,
          }}
        >
          图片加载失败
        </div>
      )}

      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </div>
  );
}
