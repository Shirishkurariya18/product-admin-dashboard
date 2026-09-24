export function getTotalPages(total: number, limit: number): number {
  return Math.max(1, Math.ceil(total / limit));
}

/** For the text "Showing 21–40 of 194". */
export function getRange(page: number, limit: number, total: number) {
  if (total === 0) return { from: 0, to: 0 };
  return { from: (page - 1) * limit + 1, to: Math.min(page * limit, total) };
}

/** Page buttons with gaps: 1 … 4 5 6 … 20 */
export function getPageItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | '…')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push('…');
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push('…');
  items.push(total);

  return items;
}
