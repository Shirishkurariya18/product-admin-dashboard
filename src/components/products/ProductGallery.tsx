'use client';

import { useState } from 'react';
import { ProductImage } from './ProductImage';

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  return (
    <div>
      <ProductImage
        src={current}
        alt={title}
        className="aspect-square w-full rounded-lg border border-stone-200 bg-white object-contain"
      />
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, index) => (
            <li key={`${src}-${index}`}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === selected}
                className={`overflow-hidden rounded border-2 ${
                  index === selected ? 'border-teal-700' : 'border-transparent'
                }`}
              >
                <ProductImage src={src} alt="" className="h-16 w-16 bg-white object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
