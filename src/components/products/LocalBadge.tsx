import { isLocalId } from '@/lib/localChanges';

/** Marks products that only exist in this browser (added in the UI, never saved by the API). */
export function LocalBadge({ id }: { id: number }) {
  if (!isLocalId(id)) return null;
  return (
    <span
      title="Added in this browser. DummyJSON does not save new products."
      className="ml-2 rounded bg-teal-100 px-1.5 py-0.5 text-xs font-medium text-teal-800"
    >
      Local
    </span>
  );
}
