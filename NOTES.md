# Short note

_Edit this so it is 100% true for you before you submit. It is a draft._

## My choices

- **Next.js App Router + client components.** The token lives in `localStorage`, so pages that need it are client components behind an `AuthGuard`. Simple to explain; the trade-off (XSS vs cookies) is in the README.
- **URL as the source of truth** for page, page size, search, category and sort, parsed defensively in one file (`lib/params.ts`). Refresh, Back and shared links work without extra code.
- **Layers:** components → hooks → services → one Axios instance. No component imports Axios.
- **Search and category are mutually exclusive**, because the API can't do both and filtering in the browser would break pagination totals.
- **Fake persistence for add/edit/delete:** call the real endpoint, then keep a local record (sessionStorage) and merge it into results. Documented approximations are in the README.

## A problem I faced and how I fixed it

The search box and the URL kept fighting each other. The input shows what you type, the URL holds the "official" search text, and both update at different times. When I typed "abc" quickly, the URL updated to "ab" after the debounce, and my code copied "ab" back into the input, deleting the "c" the user had just typed. A related bug: after picking a category (which clears search), a stale debounced value could re-submit the old search.
Fix: `SearchBar` stores the last value it and the URL agreed on (`lastCommitted` ref). It only copies URL → input when the URL differs from that value (meaning it changed from outside, e.g. Back button or category), and only pushes input → URL when the debounced text differs from it.

## Where AI helped

I used an AI assistant (Claude) to draft the first version of the project structure and code, and to think through the edge cases in the assignment. I then read every file, ran the app, and checked the tricky cases (fast typing with `delay=2000`, bad `page` values, double-clicks) myself. I can explain each file and make changes live.
