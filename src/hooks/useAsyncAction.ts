import { useCallback, useRef, useState } from 'react';
import { getErrorMessage } from '@/lib/axios';

/**
 * Wraps a submit-style action (login, save, delete) so it can only run once at a time.
 *
 * Why a ref AND state? `pending` state disables the button, but state updates
 * are asynchronous: two fast clicks can both run before React re-renders.
 * The ref changes synchronously, so the second click is rejected immediately.
 *
 * After a SUCCESS the lock stays on on purpose: the caller is about to navigate
 * away or close a dialog, and we don't want a third click to sneak in meanwhile.
 * After a FAILURE the lock is released so the user can try again.
 */
export function useAsyncAction<A extends unknown[]>(action: (...args: A) => Promise<void>) {
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: A): Promise<boolean> => {
      if (lock.current) return false;
      lock.current = true;
      setPending(true);
      setError(null);

      try {
        await action(...args);
        return true;
      } catch (err) {
        setError(getErrorMessage(err));
        lock.current = false;
        setPending(false);
        return false;
      }
    },
    [action],
  );

  return { run, pending, error };
}
