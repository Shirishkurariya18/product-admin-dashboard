'use client';

interface Props {
  message: string;
  onRetry: () => void;
  title?: string;
}

export function ErrorState({ message, onRetry, title = 'Something went wrong' }: Props) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center">
      <h2 className="text-base font-semibold text-red-800">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-red-700">{message}</p>
      <button type="button" onClick={onRetry} className="btn-primary mt-4">
        Retry
      </button>
    </div>
  );
}
