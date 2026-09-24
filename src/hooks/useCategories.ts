import { useEffect, useState } from 'react';
import { isCanceled } from '@/lib/axios';
import { fetchCategories } from '@/services/categoryService';
import type { Category } from '@/types/product';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetchCategories(controller.signal)
      .then((list) => {
        if (controller.signal.aborted) return;
        setCategories(list);
        setStatus('ready');
      })
      .catch((err) => {
        if (controller.signal.aborted || isCanceled(err)) return;
        setStatus('error');
      });

    return () => controller.abort();
  }, []);

  return { categories, status };
}
