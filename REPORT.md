# REPORT — 10X Shop

> Status: **CORE complete, FULL partly done** (catalog search / filter / sort / pagination /
> URL state, product reviews, related products). The remaining FULL rows and the `TODO` cells
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
| Reducer cart, `Cart` class, promo codes | FULL | Not done | – |
| Orders and profile pages | FULL | Not done | – |
| Formik + Yup login, advanced validation | FULL | Not done | – |
| Dark mode, `@theme` tokens | FULL | Not done | – |
| Route-level code splitting, Lighthouse targets | FULL | Not done | – |
| OOP `ApiClient`, generics, type guards | FULL | Not done | – |

Why part of FULL is still open: the project started on 26 October 2026, nine days after the
official start, so CORE was finished first and FULL is added in order of value.

## 2. Metrics

| Metric | Value |
| --- | --- |
| Production bundle (JS) | 310.00 kB, 94.38 kB gzip (target: ≤ 250 kB gzip) |
| Production bundle (CSS) | 31.48 kB, 6.63 kB gzip |
| TypeScript / ESLint errors | 0 / 0 |
| Source size | about 3,000 lines of TypeScript / TSX |
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
| Context | `AuthContext` (`useAuth`), `CartContext` (`useCart`) |
| `useEffect` dependencies | `CatalogPage` (`[]`), `ProductPage` (`[productId]`), `CartContext` (`[items]`), `CheckoutPage` (timer), `ScrollToTop` (`[pathname]`) |
| Immutable state | `CartContext` (`map`, `filter`, spread), form handlers (`setValues(prev => ({ ...prev }))`) |
| Custom hooks | `useDebounce` (generic), `useProductReviews` |
| `useRef`, `useMemo`, `useCallback` | `CatalogPage` (last pushed query), `useProductReviews` (merged reviews, average), `CartContext` (stable actions) |
| URL state | `useSearchParams` in `CatalogPage`, parsing and validation in `utils/catalogParams.ts` |
| Controlled forms | `LoginPage`, `SignUpPage`, `CheckoutPage` with `FormField` |
| Routing | `AppRoutes`, `useParams`, `useNavigate`, `Navigate` with router state, `NavLink` |
