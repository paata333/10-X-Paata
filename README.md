# 10X Shop

A demo online store built as a graduation project. Browse products loaded from the
[DummyJSON](https://dummyjson.com) API, view product details, manage a shopping cart and
complete a checkout. Built with React, TypeScript (strict) and Tailwind CSS v4.

## Live Demo

> Add the deployed URL here after the first Vercel / Netlify deploy, for example
> `https://10x-shop-yourname.vercel.app`, and check that `/products/5` opens directly.

## Features

**CORE (implemented)**

- **Catalog** – 12 products per load from `GET /products?limit=12&skip=0`, product cards with
  discount badge, rating, stock badge ("In stock", "Only N left!", "Out of stock"),
  loading, error and empty states.
- **Product details** – `/products/:id` loads one product, image gallery, quantity selector
  limited by stock, add to cart with inline feedback, "Page not found" for invalid ids.
- **Cart** – add from catalog or product page, change quantity (never above stock), remove,
  clear (with confirmation), subtotal / total, item-count badge in the header. The cart is
  stored in `localStorage` (`shop_cart`) and survives a page reload; corrupted data is ignored.
- **Checkout** – protected route (guests are sent to login and returned afterwards), controlled
  form with validation (full name, email, address, city), processing state, confirmation page.
- **Login and Sign up (demo)** – validated controlled forms. No real accounts exist: nothing is
  stored or sent anywhere, a valid submit only signs you in for the current visit.
- **Quality** – responsive from 320px to desktop with no horizontal scroll, 44px touch targets
  on mobile, visible focus styles, labelled form fields, `alt` on images, Error Boundary with a
  "Something went wrong." fallback and a Reload button, 404 page.

**FULL (implemented so far)**

- **Catalog search, filter, sort and pagination** – debounced search (400 ms), category filter,
  four sort orders and numbered pagination. All of it lives in the URL (`?q=`, `?category=`,
  `?sort=`, `?page=`), so refresh, Back / Forward and shared links restore the same view. Search
  and category exclude each other, any change resets the page to 1, outdated responses are
  ignored, and the page shows skeleton cards while loading and a Retry button on errors.
- **Product reviews** – description / reviews tabs, star rating form with validation, reviews
  saved in `localStorage` (`shop_reviews`) and shown above the ones from the API, average rating
  and review count.
- **Related products** – up to four products from the same category with the same card.

**FULL (not implemented yet)** – reducer-based cart and promo codes; orders and profile pages;
Formik + Yup login; dark mode and `@theme` tokens; toasts; route-level code splitting.

## Tech Stack

- React 19 and React Router 7
- TypeScript with `strict` mode
- Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite` plugin, utility classes only)
- ESLint with `typescript-eslint` and `eslint-plugin-react-hooks`
- Data: DummyJSON REST API (products only)

## Architecture

```text
src/
├── api/            fetch functions and ApiError (products.api.ts)
├── components/
│   ├── cart/       CartItemRow, CartSummary
│   ├── catalog/    CatalogToolbar
│   ├── checkout/   OrderItemsList, OrderConfirmation
│   ├── layout/     Layout, Header, Footer, ScrollToTop
│   ├── product/    ProductCard, ProductGrid, ProductDetails, ProductTabs, ReviewForm,
│   │               ReviewList, RelatedProducts, skeletons, StockBadge, StarRating
│   └── ui/         Button, FormField, Page, Pagination, QuantityStepper, StatusMessage
├── context/        AuthContext, CartContext
├── hooks/          useDebounce, useProductReviews
├── pages/          Catalog, Product, Cart, Checkout, Login, SignUp, NotFound
├── routes/         AppRoutes, ProtectedRoute
├── types/          Product, CartItem, AuthUser, form value and error types
└── utils/          cart maths, formatting, validation, localStorage helpers
```

**Data flow.** Pages fetch data in `useEffect` through the functions in `src/api` (with an
`AbortController`) and keep `loading`, `error` and `data` in local state. On the catalog page
the URL search params are the single source of truth for search, category, sort and page. Shared state lives in
two React Contexts: `AuthContext` (who is signed in) and `CartContext` (cart items; every change
is immutable and is mirrored to `localStorage`). Totals and the header badge are derived from
`items` on every render instead of being stored. `ProtectedRoute` guards `/checkout` and passes
the original path in router state so the login page can send the user back.

## Getting Started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the address printed by Vite (usually `http://localhost:5173`).

## Scripts

| Script              | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                                |
| `npm run build`     | Type-check (`tsc -b`) and create a production build      |
| `npm run preview`   | Serve the production build locally                       |
| `npm run typecheck` | Run `tsc --noEmit` for app and tooling configs           |
| `npm run lint`      | Run ESLint                                               |

## Deployment

The app is a single-page application, so every path must serve `index.html`.
`vercel.json` (Vercel) and `public/_redirects` (Netlify) contain that rewrite.
On Vercel: import the repository, framework preset "Vite", build command `npm run build`,
output directory `dist`.

## Test Account

The login is a demo: any username plus a password of at least 6 characters is accepted.
For example: **emilys** / **emilyspass**.

## Known Limitations

- Orders are not saved: the confirmation exists only until the page is reloaded.
- Authentication is simulated and not persisted.

## Credits

- Product data: [DummyJSON](https://dummyjson.com)
- Fonts: Bricolage Grotesque and DM Sans (Google Fonts)
- Built with the help of Claude (Anthropic) as an AI pair-programmer; see `REPORT.md` for details.
