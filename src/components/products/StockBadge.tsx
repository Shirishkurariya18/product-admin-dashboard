export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Out of stock</span>;
  }
  if (stock < 10) {
    return <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Low: {stock}</span>;
  }
  return <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">{stock} in stock</span>;
}
