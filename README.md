# Product Admin Dashboard

A small admin dashboard built with **Next.js (App Router), React, TypeScript, Tailwind CSS and Axios**.
A user logs in, then browses, searches, filters, sorts, views, adds, edits and deletes products.
Data comes from the free [DummyJSON](https://dummyjson.com) API.

- **Live demo:** _add your Vercel / Netlify link here_
- **Login:** username `emilys`, password `emilyspass`

## Setup

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.
No environment variables are needed.

## What I finished

| Requirement | Status | Where |
| --- | --- | --- |
| Login with `POST /auth/login`, errors for wrong details | Done | `components/auth/LoginForm.tsx`, `services/authService.ts` |
| Protected product pages + logout button | Done | `components/auth/AuthGuard.tsx`, `components/layout/Header.tsx` |
| Product list: image, title, category, price, rating, stock | Done | `ProductTable.tsx` (desktop), `ProductCardList.tsx` (mobile) |
| Server-side pagination (`limit` / `skip`), page numbers, Previous/Next, page size 10/20/50, "Showing 21–40 of 194" | Done | `components/ui/Pagination.tsx`, `lib/pagination.ts` |
| Search with `/products/search?q=`, debounced, back to page 1 on change | Done | `SearchBar.tsx`, `hooks/useDebounce.ts`, `hooks/useProductQuery.ts` |
| Category filter (`/products/categories`) and sort by price / rating / title | Done | `CategoryFilter.tsx`, `SortSelect.tsx`, `services/productService.ts` |
| Product details at `/products/[id]`: images, description, price, reviews, not-found page | Done | `ProductDetail.tsx`, `app/products/not-found.tsx` |
| Add / edit with validation, confirm popup before delete | Done | `ProductForm.tsx`, `lib/validation.ts`, `ConfirmDialog.tsx` |
| Loading, empty and error states with Retry | Done | `components/ui/Loader.tsx`, `EmptyState.tsx`, `ErrorState.tsx` |
| One shared Axios file (token on every request, errors in one place) | Done | `lib/axios.ts` |
| Page, search, filter, sort (and page size) kept in the URL | Done | `hooks/useProductQuery.ts`, `lib/params.ts` |
| No React Query / SWR / table or pagination libraries | Done | Only `axios`, `next`, `react` are dependencies |
| Small components, API calls in separate files | Done | Components → hooks → `services/` → `lib/axios.ts` |

## Project structure

```
src/
├── app/            Routes only: login, products, products/new, products/[id], products/[id]/edit
├── components/
│   ├── auth/       LoginForm, AuthGuard
│   ├── layout/     Header
│   ├── products/   ProductsView, ProductTable, ProductCardList, ProductDetail, ProductForm, SearchBar, ...
│   └── ui/         Pagination, PageSizeSelect, ConfirmDialog, Loader, EmptyState, ErrorState, FormField
├── context/        AuthContext, LocalChangesContext
├── hooks/          useProducts, useProduct, useProductQuery, useProductActions, useDebounce, useAsyncAction, useCategories
├── lib/            axios (shared instance), params (safe URL parsing), pagination, validation, localChanges, ...
├── services/       authService, productService, categoryService  (the only files that call the API)
└── types/
```

The rule: **components never call Axios**. Components use hooks, hooks call services, services use the one shared Axios instance.

## The tricky parts, and what I decided

### 1. Old search results must never replace new ones
`hooks/useProducts.ts` creates an `AbortController` inside `useEffect` and passes its `signal` to Axios.
When the query changes, React runs the effect's cleanup first, which **aborts the previous request**, so a slow old response can't arrive and overwrite a newer one.
As a second safety net the `.then` also checks `signal.aborted` before calling `setState`.
Test it: open `/products?delay=2000`, then type quickly. (The `delay` param is forwarded to every API call by the Axios interceptor, and the app keeps it in the URL when you page/search.)

### 2. Search + category can't be combined
DummyJSON has separate endpoints (`/products/search` and `/products/category/:slug`), so it can't do both in one request.
**My choice: they are mutually exclusive.** Typing a search clears the category; choosing a category clears the search. A short hint under the filters says so, and if a hand-edited URL has both, search wins.
Why: the alternative (search on the server, then filter by category in the browser) makes `total`, the page count and "Showing x–y of N" wrong, because the server doesn't know about the browser-side filter.
Sorting works together with either one, because the API supports `sortBy` / `order` on all three endpoints.

### 3. Add, edit and delete aren't really saved by the API
The app still **calls the real endpoints** (`POST /products/add`, `PUT /products/:id`, `DELETE /products/:id`) so loading, error and double-click behaviour are real. Because the API stores nothing, it then records the change in a **local changes store** (`context/LocalChangesContext.tsx`, saved in `sessionStorage`, logic in `lib/localChanges.ts`) and merges it into every result:

- **Deleted** server products are removed from lists, and their details page shows "not found".
- **Edited** server products replace the API version.
- **Added** products get ids from 1,000,000 up (they can't clash with real ids), appear at the top of page 1 with a "Local" badge, and only exist in this browser tab session. If they match the active search or category, they are shown there too.
- `total` is adjusted so page counts stay sensible.

Known approximation: after a delete a page can be one item short (no back-fill from the next page), and page 1 can show a few extra rows while you have locally added products. A real backend would not have this problem.

### 4. Wrong URL values (`?page=abc`, `?page=999`)
Everything read from the URL goes through `lib/params.ts`:
`page` must be digits only and ≥ 1 (else 1), `limit` must be 10/20/50 (else 10), `sort` must be a known option (else default), `category` must look like a slug. `/products/abc` shows the not-found page.
If the page is beyond the last page (`?page=999`), `ProductsView` moves to the real last page with `router.replace` once it knows the total.

### 5. Clicking Save or Login many times
`hooks/useAsyncAction.ts` uses a **ref lock plus a `pending` state**. The state disables the button; the ref blocks a second click *immediately* (two clicks can happen before React re-renders, so state alone isn't enough). After a failure the lock is released; after a success it stays locked because we are about to navigate away. The same hook protects Login, Save (add/edit) and the delete confirmation.

## Other decisions

- **URL is the source of truth.** `useProductQuery` reads the URL and every filter change writes to it (`push` for page/filter/sort so Back works, `replace` for typing so Back doesn't replay every keystroke). Defaults are left out of the URL (`page=1` is not shown).
- **Search box:** the input keeps its own text so typing is never laggy; the URL is updated after a 400 ms pause. `SearchBar.tsx` documents how it avoids the URL overwriting text you are still typing.
- **Auth:** the token is stored in `localStorage` and attached by the Axios request interceptor. `AuthGuard` redirects to `/login` (and back after login). A `401` from the API logs the user out via the response interceptor. Trade-off: `localStorage` is readable by any script on the page (XSS), while an httpOnly cookie set by a server route would be safer but needs a backend layer, which is out of scope for this task.
- **Sort options:** price, rating, title (ascending and descending where useful).
- **Accessibility basics:** labelled inputs, `aria-invalid` + error text, dialog with `role="dialog"`, Escape to close, focus starts on Cancel, `aria-live` on the result count.

## Manual test checklist

1. Log in with wrong details → error shown. Log in with `emilys` / `emilyspass` → product list. Click Log out → back to login; open `/products` while logged out → redirected.
2. Change page size, click page numbers / Next / Previous → URL updates, text reads "Showing 21–40 of 194". Refresh → same view.
3. Go to `/products?page=abc` and `/products?page=999` → no crash (page 1 / last page).
4. Type in search quickly with `?delay=2000` in the URL → only the last search's results appear. Page goes back to 1.
5. Pick a category → search box clears. Sort by price → list re-orders.
6. Open a product, then `/products/99999` and `/products/abc` → "Product not found".
7. Add a product (try invalid values first), edit it, edit a server product, delete one → all reflected in the list.
8. Double-click Sign in / Add product / Delete → only one request in the Network tab.
9. Turn the network off (DevTools → Offline) and reload the list → error message with Retry; turn it on and click Retry.

## Deploy

Push to GitHub, import the repo in Vercel (framework preset: Next.js, no settings needed), deploy.
