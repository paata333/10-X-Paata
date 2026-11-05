# REPORT — 10X Shop

> Status: **CORE complete, most of FULL done** (catalog search / filter / sort / pagination / URL
> state, reviews, related products, reducer cart with promo and shipping, orders, profile, toasts,
> lazy routes, `ApiClient`, `useFetch`). Dark mode and Formik + Yup are not done. The `TODO` cells
> are updated before submission.

## 1. Planned vs delivered

| Module | Level | Status | Evidence |
| --- | --- | --- | --- |
| Auth: login, sign-up (demo), protected checkout | CORE | Done | `AuthContext`, `LoginPage`, `SignUpPage`, `ProtectedRoute` |
| Catalog from the API with loading / error / empty | CORE | Done | `CatalogPage`, `ProductCard`, `ProductGrid` |
| Product details, gallery, stock-aware add to cart | CORE | Done | `ProductPage`, `ProductDetails` |
| Cart: quantity, remove, totals, `localStorage` | CORE | Done | `CartContext`, `CartPage`, `utils/cart.ts` |
| Checkout form, validation, confirmation | CORE | Done | `CheckoutPage`, `OrderConfirmation` |
| TypeScript strict, typed props / state / API | CORE | Done | `tsconfig.app.json`, `src/types`, `npm run typecheck` |
| Tailwind CSS v4: utilities, grid / flex, responsive, hover / focus / disabled | CORE | Done | `vite.config.ts`, `src/index.css`, `buttonStyles.ts` |
| Error Boundary and DEBUG-LOG | CORE | Done | `ErrorBoundary.tsx`, `DEBUG-LOG.md` |
| Responsive 320px to desktop, 44px touch targets on mobile | CORE | Done | DEBUG-LOG entries 2 and 4 |
| PLAN, README, REPORT, deploy config | CORE | Done, deploy link pending | `PLAN.md`, `README.md`, `vercel.json` |
| Search, category filter, sort, pagination, URL state | FULL | Done | `CatalogPage`, `CatalogToolbar`, `Pagination`, `utils/catalogParams.ts`, `useDebounce` |
| Reviews (form, `shop_reviews`, average), related products, tabs | FULL | Done | `ProductTabs`, `ReviewForm`, `useProductReviews`, `RelatedProducts` |
| Loading skeletons and Retry on errors | FULL | Done | `ProductGridSkeleton`, `ProductDetailsSkeleton`, `StatusMessage` |
| Reducer cart, `Cart` class, promo code, shipping rule | FULL | Done | `cart.reducer.ts`, `models/Cart.ts`, `CartContext`, `PromoCodeForm` |
| Orders (list, details, status over time, reorder) | FULL | Done | `models/Order.ts`, `utils/orders.ts`, `OrdersPage`, `OrderDetailsPage` |
| Profile page, clear local data | FULL | Done | `ProfilePage`, `AuthContext`, `utils/storage.ts` |
| Toast notifications | FULL | Done | `ToastContext`, `ToastViewport` |
| OOP: `Cart`, `Order`, generic `StorageService<T>` | FULL | Done | `src/models` |
| Formik + Yup login, advanced validation | FULL | Not done | – |
| Dark mode, `@theme` tokens | FULL | Not done | – |
| Route-level code splitting, Lighthouse targets | FULL | Not done | – |
| OOP `ApiClient`, generic `useFetch<T>` | FULL | Done | `api/ApiClient.ts`, `hooks/useFetch.ts` |
| Type guards (`isProduct`, `isProductsResponse`, `isApiError`) and utility types (`Pick`, `Required`, `Partial`) | FULL | Done | `utils/guards.ts`, `types/` |
| Route-level code splitting (`React.lazy` + `Suspense`) | FULL | Done | `routes/AppRoutes.tsx`, `Layout.tsx`, `Spinner.tsx` |

Why part of FULL is still open: the project started on 26 October 2026, nine days after the
official start, so CORE was finished first and FULL is added in order of value. Not done:
Formik + Yup and dark mode with `@theme` (both touch almost every component and were left out
to avoid last-minute bugs before the test) and the Lighthouse targets, which need the deployed site.

## 2. Metrics

| Metric | Value |
| --- | --- |
| JavaScript, all chunks together | 328.6 kB, 108.7 kB gzip in 20 files (target: ≤ 250 kB gzip) |
| JavaScript for the first visit of the catalog | about 92 kB gzip in 5 files, measured in Chromium (was about 99 kB before code splitting) |
| Main chunk (React, Router, shared code) | 230.19 kB, 72.28 kB gzip |
| CSS | 32.86 kB, 6.89 kB gzip |
| TypeScript / ESLint errors | 0 / 0 |
| Source size | about 4,300 lines of TypeScript / TSX |
| Commits | TODO: `git rev-list --count HEAD` |
| Lighthouse (mobile) before → after | TODO: run on the deployed site and add `docs/lighthouse/before.png` and `after.png` |
| Hours per epic, planned vs actual | planned: 43 h in `PLAN.md`; TODO: actual hours |

## 3. The hardest problems

1. **Logout on the checkout page redirected to the login page.** Two dependent state updates
   (auth state and router location) were rendered at different times, and the route guard reacted
   to the in-between render. Solved by applying both inside one `startTransition`.
   See DEBUG-LOG entry 1.
2. **Keeping the cart correct.** Stock limits must also count what is already in the cart, the
   quantity must stay between 1 and the stock, and saved data from `localStorage` cannot be
   trusted. Solved with one `addItem` function that returns a message, clamping in
   `setQuantity`, and a loader that validates every stored item and ignores broken data.
3. **Layout at 320px.** A grid column grew wider than its container because of the minimum
   width of the inputs inside it. Found with a scripted measurement and fixed with
   `grid-cols-1` and `minmax(0, 1fr)`. See DEBUG-LOG entry 2.
4. **Keeping the search box, the URL and the requests in sync.** The URL is the single source
   of truth (`q`, `category`, `sort`, `page`), the input keeps its own text for fast typing, and
   a debounce writes it to the URL. An effect that depended on a helper function re-applied an
   old search text after a category change; an older, slower response must also never replace a
   newer one. Solved with a ref for the last pushed value, an effect that depends only on the
   debounced text, and `AbortController` plus an `aborted` check. See DEBUG-LOG entry 5.
5. **Placing an order without a redirect race.** After an order the cart is emptied, but the
   checkout page redirects to the cart when it is empty. If both happened as separate updates the
   user could land on the cart instead of the order. The page now remembers the new order id and
   renders `<Navigate>` to the order first, so the empty-cart redirect can never win. The status
   of an order is never stored: it is calculated from the time, so it cannot become out of date.
6. **Not trusting data from the network.** The API answer is JSON, which has no types, so a
   missing field would show up as `NaN` or a crash far from its cause. `ApiClient` now checks every
   answer with type guards and turns network failures, HTTP errors and unexpected data into one
   `ApiError`, which the pages show with a Retry button.

## 4. What I would do differently

- Start earlier: `PLAN.md` was committed on 26 October, not in the first week of the official
  schedule, and the plan had to be compressed into 12 days.
- Keep automated tests in the repository. Behaviour tests were used while building and found
  real bugs, but they are not committed.
- Deploy a first version early instead of leaving deployment for the end.
- Apply changes to the repository by choosing files myself from the start; applying patch files
  from the wrong folder produced a wrong first commit that had to be undone before pushing.

## 5. AI usage

I worked with Claude (Anthropic) as an AI assistant, following the project requirements one
day at a time.

- **Delegated to the assistant:** the code for each daily step, the first drafts of `PLAN.md`,
  `README.md`, `DEBUG-LOG.md` and this report, and the scripts used to test and audit the app
  (behaviour tests, a headless-browser audit for overflow, accessibility and touch targets).
- **My own decisions:** adding a sign-up page, asking for a distinctive visual design,
  committing by choosing files myself instead of applying patch files, and deciding what to
  build in which order.
- **What had to be corrected:** the first `PLAN.md` claimed the login is saved in
  `localStorage`, which contradicts the specification (fixed before it was committed); the
  logout race, the 320px overflow and the accessibility issues were mistakes in earlier
  versions of the generated code and were found by testing, not by the assistant's own review.
- I ran the project locally, applied the files and made the commits in my own repository.

## 6. React concepts used (Step 16 checklist)

| Concept | Where |
| --- | --- |
| Props | `ProductCard`, `StatusMessage`, `QuantityStepper`, `CartSummary` |
| `children` | `Page`, `ProtectedRoute`, `AuthProvider`, `CartProvider`, `ErrorBoundary` |
| Callback props | `onAdd` (`ProductGrid` → `ProductCard`), `onQuantityChange` / `onRemove` (`CartItemRow`), `onChange` (`FormField`) |
| `map` and `key` | `ProductGrid`, the item list in `CartPage`, `OrderItemsList` |
| Conditional rendering | loading / error / empty / data in `CatalogPage`; guest vs signed-in `Header`; `CheckoutPage` (order, empty cart, form) |
| Context | `AuthContext` (`useAuth`), `CartContext` (`useCart`), `ToastContext` (`useToast`) |
| `useEffect` dependencies | `CatalogPage` (`[]`), `ProductPage` (`[productId]`), `CartContext` (`[items]`), `CheckoutPage` (timer), `ScrollToTop` (`[pathname]`) |
| Immutable state | `CartContext` (`map`, `filter`, spread), form handlers (`setValues(prev => ({ ...prev }))`) |
| Custom hooks | `useDebounce<T>`, `useFetch<T>` (loading / error / success, abort, reload), `useProductReviews`, `useNow` (interval with cleanup), `useLogout` |
| Lazy loading | `React.lazy` + `Suspense` around the page outlet, inside the Error Boundary |
| `useReducer` and discriminated unions | `cart.reducer.ts`: `CartAction` union, `switch` with a `never` check, pure and tested without React |
| Classes and generics | `Cart` (implements `ICart`), `Order` (private constructor, factory), `StorageService<T>`, `ApiClient.get<T>` |
| Type guards and utility types | `isCartItem`, `isOrderData` in `storage.ts`; `Pick`, `Required`, `Partial` in `types/` |
| `useRef`, `useMemo`, `useCallback` | `CatalogPage` (last pushed query), `useProductReviews` (merged reviews, average), `CartContext` (stable actions) |
| URL state | `useSearchParams` in `CatalogPage`, parsing and validation in `utils/catalogParams.ts` |
| Controlled forms | `LoginPage`, `SignUpPage`, `CheckoutPage` with `FormField` |
| Routing | `AppRoutes`, `useParams`, `useNavigate`, `Navigate` with router state, `NavLink` |
