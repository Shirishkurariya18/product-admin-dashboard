export function RatingBadge({ rating }: { rating: number }) {
  if (!rating) return <span className="text-stone-400">No rating</span>;
  return (
    <span className="whitespace-nowrap">
      <span className="text-amber-500" aria-hidden="true">
        ★
      </span>{' '}
      {rating.toFixed(1)}
      <span className="sr-only"> out of 5</span>
    </span>
  );
}
