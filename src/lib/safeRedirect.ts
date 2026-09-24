/** Only allow redirects to our own pages (blocks "//evil.com" style links). */
export function safeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/login')) {
    return '/products';
  }
  return raw;
}
