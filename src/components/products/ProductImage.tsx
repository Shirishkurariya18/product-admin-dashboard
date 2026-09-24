'use client';

import { useState } from 'react';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">' +
      '<rect width="200" height="200" fill="#e7e5e4"/>' +
      '<path d="M60 130l30-38 22 26 14-16 24 28z" fill="#a8a29e"/>' +
      '<circle cx="80" cy="76" r="10" fill="#a8a29e"/></svg>',
  );

interface Props {
  src: string | undefined;
  alt: string;
  className?: string;
}

/** A plain <img> (product images come from any host) that falls back to a placeholder. */
export function ProductImage({ src, alt, className }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const useFallback = !src || failedSrc === src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={useFallback ? PLACEHOLDER : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src ?? null)}
      className={className}
    />
  );
}
