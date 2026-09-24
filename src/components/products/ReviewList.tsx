import { formatDate } from '@/lib/format';
import type { Review } from '@/types/product';
import { RatingBadge } from './RatingBadge';

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-stone-500">No reviews yet.</p>;
  }

  return (
    <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
      {reviews.map((review, index) => (
        <li key={`${review.reviewerEmail ?? review.reviewerName}-${index}`} className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{review.reviewerName}</p>
            <p className="text-sm">
              <RatingBadge rating={review.rating} />
              <span className="ml-3 text-stone-500">{formatDate(review.date)}</span>
            </p>
          </div>
          <p className="mt-1 text-sm text-stone-700">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
