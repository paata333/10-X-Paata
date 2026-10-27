# PLAN — 10X Shop

Graduation project: a single-page e-commerce application built with React, TypeScript (strict) and Tailwind CSS v4, using the DummyJSON API.

## 1. Goal and scope

**Goal:** a working shop where a user can log in, browse products, view product details, manage a cart and complete a checkout form, deployed to a public URL.

**In scope (CORE):**

| Module | What is delivered |
| --- | --- |
| Auth | Login form (validation), `AuthContext` (React Context, no persistence), `ProtectedRoute` |
| Catalog | Product list from `/products`, product card and grid, loading / error / empty states |
| Product details | Fetch by id, gallery, price, stock, quantity selector, add to cart |
| Cart | `CartContext` (`useState`, immutable updates), quantity change, remove, totals, persistence in `shop_cart` |
| Checkout | 4-field form (full name, email, address, city), validation, confirmation page |
| Quality | Responsive layout, Error Boundary, 404 page, `tsc --noEmit` and `vite build` without errors |
| Docs | README (EN), PLAN, REPORT, DEBUG-LOG, deployed link |

**Out of scope until CORE is finished and approved:** search / sort / pagination, orders history, profile page, Formik + Yup, `useReducer` cart, OOP classes (`Cart`, `ApiClient`), dark mode, lazy loading, toasts, promo codes.

**Rules I follow:** no `any`, no libraries outside the allowed list, no direct DOM manipulation, one commit per logical change, `main` only for setup and docs.

## 2. Schedule

The project started on **26 October 2026**, so the plan is compressed into 12 days. Submission deadline: **6 November 2026, 23:59**. Theory test: **5 November**.

| Date | Day | Work | Steps |
| --- | --- | --- | --- |
| Oct 26 | 1 | Setup, PLAN.md, TypeScript types | 1–3 |
| Oct 27 | 2 | Router, layout, header, auth context, login, route protection | 4–6 |
| Oct 28 | 3 | API client, catalog page, product card and grid | 7–9 |
| Oct 29 | 4 | Product details page | 10–11 |
| Oct 30 | 5 | Cart context and cart page | 12–13 |
| Oct 31 | 6 | Checkout form, confirmation page | 14–15 |
| Nov 1 | 7 | Responsive layout, loading / error / empty states, Error Boundary | 19–22 |
| Nov 2 | 8 | Full flow test, typecheck, build, deploy, README / REPORT | 21, 23–25 |
| Nov 3–4 | 9–10 | FULL features (only if approved), bug fixing, test preparation | — |
| Nov 5 | 11 | Theory test | — |
| Nov 6 | 12 | Final check of the deployed site and repository, submit before 23:59 | — |

## 3. Work breakdown (CORE)

| Epic | Tasks | Estimate |
| --- | --- | --- |
| A. Foundation | Vite + React + TS strict + Tailwind v4, ESLint, PLAN.md, types | 3.5 h |
| B. Routing and layout | React Router, `Layout`, `Header`, 404 page | 2.5 h |
| C. Auth | `AuthContext`, login page + validation, `ProtectedRoute`, redirect back to checkout | 5.5 h |
| D. Catalog | API helper, `ProductCard`, `ProductGrid`, catalog page states | 5.5 h |
| E. Product details | Fetch by id, details layout, quantity selector, add to cart | 4 h |
| F. Cart | `CartContext`, cart page, quantity / remove / totals, persistence | 6 h |
| G. Checkout | Form + validation, confirmation page | 4.5 h |
| H. Quality | Responsive pass, states, Error Boundary, full flow test, typecheck / build | 7 h |
| I. Deploy and docs | Deploy + SPA rewrite, README, REPORT, DEBUG-LOG | 4.5 h |
| **Total** | | **43 h** |

**Definition of Done for every task:** it works in the browser, `npm run typecheck` and `npm run lint` pass, there are no console errors, and the change is committed with a clear message.

## 4. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Late start: week 1 of the official schedule is already over | Less time for polish and FULL features | Strict CORE-first order, one step per day, FULL only after CORE works end to end |
| DummyJSON is slow or unavailable | Pages cannot be demonstrated | Always render loading and error states; keep a short note in the README on how the API is used |
| Refreshing a deep link on the deployed site returns 404 | Broken demo on Vercel / Netlify | Add the SPA rewrite config and test a refresh on `/cart` and `/products/1` during deploy |
| Type errors pile up and block the build at the end | Last-minute fixing | Run `npm run typecheck` before every commit |
| Scope creep into FULL features | CORE finished late or half-done | FULL items are listed as out of scope above and start only with an explicit decision |
| Cannot explain own code at the defense | Lower defense score | After every step write down what the code does and why; keep DEBUG-LOG entries for real bugs |
