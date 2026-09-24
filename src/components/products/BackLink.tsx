'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getListHref } from '@/lib/listUrl';

/** Goes back to the list exactly as the user left it (same page, search, filter, sort). */
export function BackLink() {
  const [href, setHref] = useState('/products');

  useEffect(() => {
    setHref(getListHref());
  }, []);

  return (
    <Link href={href} className="text-sm text-teal-700 hover:underline">
      ‹ Back to products
    </Link>
  );
}
