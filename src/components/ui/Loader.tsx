export function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-stone-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-teal-700" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader />
    </div>
  );
}
